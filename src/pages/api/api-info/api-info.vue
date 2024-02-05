<script setup lang="ts">
import ApiDoc from '~/pages/api/api-info/components/api-doc.vue'
import ApiDebug from '~/pages/api/api-info/components/api-debug.vue'

defineOptions({
  name: 'ApiInfo',
})
const activeKey = ref('api-doc')
</script>

<template>
  <page-container>
    <template #title>
      接口名称
    </template>
    <template #content>
      <a-row>
        <a-col :span="19">
          <span class="text-20px font-medium">
            接口介绍
          </span>
        </a-col>
      </a-row>
      <a-card :bordered="false" class="my-5">
        <a-row>
          <a-col :span="8">
            <div>
              <a-typography-paragraph :copyable="{ text: '复制文本' }">
                请求地址：https://www.baidu.com
              </a-typography-paragraph>
              <p>
                请求方式：GET
              </p>
              <p>
                接口费用：免费
              </p>
            </div>
          </a-col>
        </a-row>
      </a-card>
      <a-tabs v-model:activeKey="activeKey" class="mb--7">
        <a-tab-pane key="api-doc" tab="接口文档" />
        <a-tab-pane key="api-sdk" tab="在线调试" force-render />
      </a-tabs>
      <a-card v-show="activeKey === 'api-doc'" :bordered="false" class="my-5">
        <ApiDoc />
      </a-card>
      <a-card v-show="activeKey === 'api-sdk'" :bordered="false" class="my-5">
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
