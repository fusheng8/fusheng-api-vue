<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue'
import { notification } from 'ant-design-vue'
import { cloneDeep } from 'lodash'
import { computed, defineEmits, defineExpose, ref } from 'vue'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { useAuthorization } from '/src/composables/authorization.ts'
import { addOrUpdate } from '~/api/common/user.ts'
import ParamTable from '~/components/param-table/param-table.vue'
import { headOptions } from '~/pages/system/api-manage/components/param-table-options/header.ts'

const emit = defineEmits(['cancel', 'ok'])

const isUpdate = ref(false)
const avatarLoding = ref(false)

const FILE_UPLOAD_URL = import.meta.env.VITE_APP_FILE_UPLOAD_URL

const visible = ref(false)

const title = computed(() => {
  return isUpdate.value ? '编辑' : '新增'
})

const formRef = ref<FormInstance>()

const formData = ref<any>({})

const labelCol = { style: { width: '100px' } }
const wrapperCol = { span: 24 }

function open(record?: any) {
  visible.value = true
  isUpdate.value = !!record?.id
  if (!isUpdate.value) {
    formData.value = {}
    return
  }
  formData.value = cloneDeep(record) ?? {}
}

const headerData = ref<Record<string, any>[]>([
  {
    headerKey: 'token',
    headerExampleValue: 'asgjdcgayjhaschsaxca',
    remark: '备注',
  },
  {
    headerKey: 'cookie',
    headerExampleValue: 'asgjdcgayjhaschsaxca',
    remark: '备注',
  },
  {
    headerKey: 'time',
    headerExampleValue: '2022-01-01',
    remark: '备注',
  },
])

async function handleOk() {
  try {
    await formRef.value?.validate()

    await addOrUpdate(formData.value)

    emit('ok')
    notification?.success({
      message: `${isUpdate.value ? '修改' : '增加'}成功`,
      duration: 3,
    })
    visible.value = false
  }
  catch (error) {
  }
}

function onFileStatusChange(res: any) {
  switch (res.file.status) {
    case 'uploading':
      avatarLoding.value = true
      break
    case 'done':
      formData.value.avatarUrl = res.file.response.data
      avatarLoding.value = false
      break
    case 'error':
      avatarLoding.value = false
      break
  }
}

function handleCancel() {
  formRef.value?.resetFields()
  emit('cancel')
}

defineExpose({
  open,
})

// 整数转换
function numberRep(value: string | number) {
  if (typeof value === 'string')
    return !Number.isNaN(Number(value)) ? value.replace(/^(0+)|[^\d]/g, '') : ''
  else if (typeof value === 'number')
    return !Number.isNaN(value) ? String(value).replace(/^(0+)|[^\d]/g, '') : ''
  else
    return ''
}
</script>

<template>
  <a-modal v-model:open="visible" :width="800" :mask-closable="false" :title="title" @ok="handleOk" @cancel="handleCancel">
    <a-form ref="formRef" :model="formData" class="w-full" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item name="avatarUrl" label="接口封面">
        <a-upload
          name="file"
          list-type="picture-card"
          :show-upload-list="false"
          :action="FILE_UPLOAD_URL"
          :headers="{ token: useAuthorization().value }"
          :max-count="1"
          @change="onFileStatusChange"
        >
          <img v-if="!avatarLoding && formData.avatarUrl" class="avatar-img" :src="formData.avatarUrl" alt="avatar">
          <div v-else>
            <LoadingOutlined v-if="avatarLoding" />
            <PlusOutlined v-else />
            <div class="ant-upload-text">
              上传
            </div>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item name="name" label="接口名称" :rules="[{ required: true, message: '请输入接口名称' }]">
        <a-input v-model:value="formData.name" :maxlength="50" placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item name="url" label="接口地址" :rules="[{ required: true, message: '请输入接口地址' }]">
        <a-input v-model:value="formData.url" :maxlength="200" placeholder="请输入接口地址" />
      </a-form-item>
      <a-form-item name="description" label="接口描述">
        <a-textarea
          v-model:value="formData.description"
          show-count auto-size="true" allow-clear
          :maxlength="200" placeholder="请输入接口描述"
        />
      </a-form-item>
      <a-form-item name="method" label="请求方法" :rules="[{ required: true, message: '请输入接口名称' }]">
        <a-select v-model:value="formData.method" placeholder="请选择请求方法">
          <a-select-option value="GET">
            GET
          </a-select-option>
          <a-select-option value="POST">
            POST
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="reduceBalance" label="扣除积分数" :rules="[{ required: true, message: '请输入扣除积分数' }]">
        <a-input-number
          v-model:value="formData.reduceBalance"
          class="w-full" placeholder="请输入0-100的数字"
          :formatter="numberRep" :parser="numberRep" :min="0" :max="100"
        />
      </a-form-item>
      <a-form-item name="requestHeader" label="请求头">
        <ParamTable v-model="headerData" :options="headOptions" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>
.avatar-img {
  object-fit: fill;
  height: 100%;
  width: 100%;
}
</style>
