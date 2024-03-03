<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
import type CrudTableModal from './components/apiInfoAddOrUpdateForm.vue'
import { useTableQuery } from '~/composables/table-query.ts'
import { deleteApiInfoByIds, getApiInfoPageList } from '~/api/api.ts'
import { AccessEnum } from '~/utils/constant.ts'
import ApiInfoSdkAddOrUpdateForm from '~/pages/system/api-manage/components/apiInfoSdkAddOrUpdateForm.vue'
import ApiInfoAddOrUpdateForm from '~/pages/system/api-manage/components/apiInfoAddOrUpdateForm.vue'

const { hasAccess } = useAccess()
const { userInfo } = useUserStore()
const message = useMessage()
const isAdmin = hasAccess(AccessEnum.ADMIN)

const columns = shallowRef([
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '接口名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '接口封面',
    dataIndex: 'avatarUrl',
    key: 'avatarUrl',
  },
  {
    title: '映射路径',
    dataIndex: 'mappingUrl',
    key: 'mappingUrl',
  },
  {
    title: '请求方法',
    dataIndex: 'method',
    key: 'method',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
  },
])

const { state, initQuery, resetQuery, query } = useTableQuery({
  queryApi: getApiInfoPageList,
  queryParams: {
    name: undefined,
    status: undefined,
    method: undefined,
    userId: isAdmin ? undefined : userInfo?.id,
  },
  afterQuery: (res) => {
    return res
  },
})

const apiInfoCrudTableModal = ref<InstanceType<typeof CrudTableModal>>()
const apiInfoSdkCrudTableModal = ref()

async function handleDelete(record: any[]) {
  // 解构出id数组
  const ids = record.map(item => item.id)
  await deleteApiInfoByIds([...ids])
  await query()
  message.success('删除成功')

  close()
}

function handleAdd() {
  apiInfoCrudTableModal.value?.open({})
}
function handleEdit(record: any, readonly: boolean) {
  apiInfoCrudTableModal.value?.open(record, readonly, readonly)
}
function handEditSdk(id: any) {
  apiInfoSdkCrudTableModal.value?.open(id)
}

function statusCodeToName(status: number) {
  switch (status) {
    case 0:
      return '待审核'
    case 1:
      return '审核失败'
    case 2:
      return '下线'
    case 3:
      return '正常'
    default:
      return '未知'
  }
}
</script>

<template>
  <page-container>
    <a-card mb-4>
      <a-form class="system-crud-wrapper" :label-col="{ span: 7 }" :model="state.queryParams">
        <a-row :gutter="[15, 0]">
          <a-col :span="6">
            <a-form-item name="name" label="接口名称">
              <a-input v-model:value="state.queryParams.username" placeholder="请输入接口名称" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item name="method" label="请求方式">
              <a-select v-model:value="state.queryParams.method" placeholder="请选择请求方式">
                <a-select-option value="GET">
                  GET
                </a-select-option>
                <a-select-option value="POST">
                  POST
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item name="method" label="状态">
              <a-select v-model:value="state.queryParams.status" placeholder="请选择状态">
                <a-select-option :value="0">
                  待审核
                </a-select-option>
                <a-select-option :value="1">
                  审核失败
                </a-select-option>
                <a-select-option :value="2">
                  下线
                </a-select-option>
                <a-select-option :value="3">
                  正常
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-space flex justify-end w-full>
              <a-button :loading="state.loading" type="primary" @click="initQuery">
                查询
              </a-button>
              <a-button :loading="state.loading" @click="resetQuery">
                重置
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <a-card title="接口管理">
      <template #extra>
        <a-space size="middle">
          <a-button type="primary" @click="handleAdd">
            <template #icon>
              <PlusOutlined />
            </template>
            {{ isAdmin ? '新增' : '发布接口' }}
          </a-button>
        </a-space>
      </template>
      <a-table
        :loading="state.loading" :columns="columns"
        :data-source="state.dataSource" :pagination="state.pagination"
      >
        <template #bodyCell="scope">
          <template v-if="scope?.column?.dataIndex === 'avatarUrl'">
            <a-image
              :width="80"
              :src="scope?.record?.avatarUrl"
            />
          </template>

          <template v-else-if="scope?.column?.dataIndex === 'status'">
            <a-tag color="#2db7f5">
              {{ statusCodeToName(scope?.record?.status) }}
            </a-tag>
          </template>

          <template v-if="scope?.column?.dataIndex === 'action'">
            <div flex gap-2>
              <a-button type="link" @click="handleEdit(scope?.record, isAdmin && scope?.record?.status === 0)">
                {{ isAdmin && scope?.record?.status === 0 ? '查看' : '编辑' }}
              </a-button>
              <a-button v-if="scope?.record?.status !== 0" type="link" @click="handEditSdk(scope?.record.id)">
                编辑SDK
              </a-button>
              <a-popconfirm
                v-if="!(isAdmin && scope?.record?.status === 0)"
                title="确定删除该条数据？" ok-text="确定" cancel-text="取消"
                @confirm="handleDelete([scope?.record])"
              >
                <a-button type="link">
                  删除
                </a-button>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>

    <ApiInfoAddOrUpdateForm ref="apiInfoCrudTableModal" @ok="query" />
    <ApiInfoSdkAddOrUpdateForm ref="apiInfoSdkCrudTableModal" @ok="query" />
  </page-container>
</template>

<style lang="less" scoped>
.system-crud-wrapper{
  .ant-form-item{
    margin: 0;
  }
}
</style>
