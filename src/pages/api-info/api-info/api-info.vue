<script setup>
import ApiDebug from '~/pages/api-info/api-info/components/api-debug.vue'
import { queryApiInfoById } from '~/api/api.ts'
import ParamTable from '~/components/param-table/param-table.vue'
import { requestHeaderOptions } from '~/param-table-options/requestHeaderOptions.js'

defineOptions({
  name: 'ApiInfo',
})

const tabActiveKey = ref('api-info-doc')
const apiInfo = ref({})

queryApiInfoById({ id: useRoute().query.id }).then((res) => {
  apiInfo.value = res.data
})
</script>

<template>
  <page-container>
    <template #title>
      {{ apiInfo.name ?? '暂无标题' }}
    </template>
    <template #content>
      <a-row>
        <a-col :span="19">
          <span class="text-20px font-medium">
            {{ apiInfo.description ?? '暂无描述' }}
          </span>
        </a-col>
      </a-row>
      <a-card :bordered="false" class="my-5">
        <a-row>
          <a-col :span="8">
            <div>
              <a-typography-paragraph :copyable="{ text: apiInfo.url }">
                请求地址：{{ apiInfo.url }}
              </a-typography-paragraph>
              <p>
                请求方式：{{ apiInfo.method }}
              </p>
              <p>
                接口费用：{{ apiInfo.reduceBalance > 0 ? `${apiInfo.reduceBalance}积分/次` : '免费' }}
              </p>
            </div>
          </a-col>
        </a-row>
      </a-card>
      <a-tabs v-model:activeKey="tabActiveKey" class="mb--7">
        <a-tab-pane key="api-doc" tab="接口文档" />
        <a-tab-pane key="api-debug" tab="在线调试" force-render />
      </a-tabs>
      <a-card v-show="tabActiveKey === 'api-info-doc'" :bordered="false" class="my-5">
        <ParamTable v-model="apiInfo.requestHeader" :options="requestHeaderOptions" />
      </a-card>
      <a-card v-show="tabActiveKey === 'api-info-debug'" :bordered="false" class="my-5">
        <ApiDebug />
      </a-card>
    </template>
  </page-container>
</template>

<style scoped lang="less">
:deep(.ant-btn) {
  border-radius: 0 !important;
}
:deep(.ant-card-body) {
  padding: 0;
}
</style>
