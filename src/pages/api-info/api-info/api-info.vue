<script setup>
import { queryApiInfoById } from '~/api/api.ts'
import ApiDebug from '~/pages/api-info/api-info/components/api-debug.vue'
import ApiSdk from '~/pages/api-info/api-info/components/api-sdk.vue'
import { requestHeaderOptions } from '~/param-table-options/requestHeaderOptions.js'
import { requestParamOptions } from '~/param-table-options/requestParamOptions.js'
import { responseParamOptions } from '~/param-table-options/responseParamOptions.js'

defineOptions({
  name: 'ApiInfo',
})

const tabActiveKey = ref('api-doc')
const info = ref({})
const isLoadFinish = ref(false)
onMounted(async () => {
  const res = await queryApiInfoById({ id: useRoute().query.id })
  info.value = res.data
  isLoadFinish.value = true
})
</script>

<template>
  <page-container>
    <template #title>
      {{ info.name ?? '暂无标题' }}
    </template>
    <template #content>
      <a-row>
        <a-col :span="19">
          <span class="text-20px font-medium">
            {{ info.description ?? '暂无描述' }}
          </span>
        </a-col>
      </a-row>
      <a-card :bordered="false" class="my-5">
        <a-row>
          <a-col :span="8">
            <div>
              <a-typography-paragraph :copyable="{ text: info.url }">
                请求地址：{{ info.url }}
              </a-typography-paragraph>
              <p>
                请求方式：{{ info.method }}
              </p>
              <p>
                接口费用：{{ info.reduceBalance > 0 ? `${info.reduceBalance}积分/次` : '免费' }}
              </p>
            </div>
          </a-col>
        </a-row>
      </a-card>
      <a-tabs v-model:activeKey="tabActiveKey" class="mb--7">
        <a-tab-pane key="api-doc" tab="接口文档" />
        <a-tab-pane key="api-debug" tab="在线调试" force-render />
        <a-tab-pane key="api-sdk" tab="SDK下载" force-render />
      </a-tabs>

      <a-card v-show="tabActiveKey === 'api-doc'" :bordered="false" class="my-5">
        <a-card title="请求头">
          <ParamTable v-model="info.requestHeader" :options="requestHeaderOptions" />
        </a-card>
        <a-card title="请求参数">
          <ParamTable v-model="info.requestParams" :options="requestParamOptions" />
        </a-card>
        <a-card title="响应参数">
          <ParamTable v-model="info.responseParams" :options="responseParamOptions" />
        </a-card>
        <a-card title="请求示例">
          <a-textarea :value="info.requestExample" :bordered="false" :auto-size="true" />
        </a-card>
        <a-card title="响应示例">
          <a-textarea :value="info.responseExample" :bordered="false" :auto-size="true" />
        </a-card>
      </a-card>

      <a-card v-show="tabActiveKey === 'api-debug'" :bordered="false" class="my-5">
        <ApiDebug v-if="isLoadFinish" :api-info="info" />
      </a-card>

      <a-card v-show="tabActiveKey === 'api-sdk'" :bordered="false" class="my-5">
        <ApiSdk v-if="isLoadFinish" :sdk-list="info" />
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
