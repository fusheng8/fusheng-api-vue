<script setup>
import { getApiInfoPageList } from '~/api/api.ts'

defineOptions({
  name: 'ApiList',
})
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
})

const queryParam = ref({
  name: undefined,
  status: 3,
  method: undefined,
})

const router = useRouter()

const apiList = ref([])
onSearch()
function onSearch() {
  getApiInfoPageList({
    ...queryParam.value,
    current: pagination.value.current,
    pageSize: pagination.value.pageSize,
  }).then((res) => {
    pagination.value.total = res.data.total
    apiList.value = res.data.list
  })
}
</script>

<template>
  <div class="mt-2">
    <div v-if="!apiList.length || apiList.length === 0">
      <a-empty description="暂无数据" />
    </div>
    <a-row :gutter="20" :wrap="true" justify="space-evenly">
      <a-col v-for="(item, index) in apiList" :key="index" :xs="16" :sm="12" :md="10" :lg="8" :xl="6" class="mb-4">
        <a-badge
          :offset="[-10, 10]" color="blue"
          :count="item.reduceBalance > 0 ? `${item.reduceBalance}/次` : '免费'"
        >
          <a-card hoverable class="w-[280px]" @click="router.push({ path: '/api-info/info', query: { id: item.id } })">
            <template #cover>
              <img height="150px" :src="item.avatarUrl">
            </template>
            <a-card-meta :title="item.name ?? '暂无标题'">
              <template #description>
                <a-tooltip>
                  <template #title>
                    {{ item.description ?? '暂无描述' }}
                  </template>
                  <a-typography-paragraph :strong="false" :ellipsis="{ rows: 2 } " :content="item.description ?? '暂无描述'" />
                </a-tooltip>
              </template>
            </a-card-meta>
          </a-card>
        </a-badge>
      </a-col>
      <a-flex class="w-full" gap="middle" align="center" vertical>
        <a-pagination v-model:current="pagination.current" :page-size="pagination.pageSize" :responsive="true" show-quick-jumper :total="pagination.total" @change="onSearch" />
      </a-flex>
    </a-row>
  </div>
</template>

<style scoped>
</style>
