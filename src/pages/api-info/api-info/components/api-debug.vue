<script setup>
import { requestHeaderOptions } from './options/requestHeaderOptions'
import customRequest from '~/utils/customRequest'

const { apiInfo } = defineProps({
  apiInfo: {
    type: Object,
    default: () => ({}),
  },
})
const form = ref({})
const responseResult = ref({})
const requestTabActiveKey = ref('header')
const responseTabActiveKey = ref('header')

form.value.url = apiInfo.url
form.value.method = apiInfo.method
// 取出请求头
form.value.requestHeader = apiInfo.requestHeader.map((item) => {
  return {
    headerKey: item.name,
    headerValue: item.exampleValue,
  }
})

// 取出请求体
// form.value.requestParams = JSON.stringify(apiInfo.requestHeader.map((item) => {
//   return {
//     key: item.name,
//     value: item.exampleValue,
//   }
// }))

// 发出请求
function sendRequest() {
  const requestConfig = {
    url: form.value.url,
    method: form.value.method,
    headers: buildObjectByKeyValue(form.value.requestHeader, 'headerKey', 'headerValue'),
    data: JSON.parse(form.value.requestParams || '{}'),
  }

  customRequest.request(requestConfig).then((res) => {
    responseResult.value.responseHeader = buildArrayByObject(res.headers, 'headerKey', 'headerValue')
    responseResult.value.responseBody = JSON.stringify(res.data)
  })
}

// 根据key value构造对象
function buildObjectByKeyValue(ob, keyName, valueName) {
  const target = {}
  ob.forEach((item) => {
    target[item[keyName]] = item[valueName]
  })
  return target
}// 根据对象构造key value数组
function buildArrayByObject(arr, keyName, valueName) {
  const target = []
  Object.entries(arr).forEach(([key, value]) => {
    target.push({
      [keyName]: key,
      [valueName]: value,
    })
  })
  return target
}
</script>

<template>
  <a-flex gap="1" horizontal>
    <a-input v-model:value="form.url" flex="4" allow-clear>
      <template #addonBefore>
        <a-select v-model:value="form.method" flex="1">
          <a-select-option value="POST">
            POST
          </a-select-option>
          <a-select-option value="GET">
            GET
          </a-select-option>
        </a-select>
      </template>
    </a-input>
    <a-button type="primary" flex="1" @click="sendRequest">
      发送
    </a-button>
  </a-flex>

  <a-tabs v-model:activeKey="requestTabActiveKey" class="mb--7">
    <a-tab-pane key="header" tab="请求头部" />
    <a-tab-pane key="param" tab="请求参数" force-render />
  </a-tabs>

  <a-card v-show="requestTabActiveKey === 'header'" :bordered="false" class="my-5">
    <param-table v-model="form.requestHeader" :options="requestHeaderOptions" :show-add="true" :show-operate="true" mode="edit" />
  </a-card>
  <a-card v-show="requestTabActiveKey === 'param'" :bordered="false" class="my-5">
    <a-textarea v-model:value="form.requestParams" :rows="8" />
  </a-card>

  <a-tabs v-model:activeKey="responseTabActiveKey" class="mb--7">
    <a-tab-pane key="header" tab="响应头部" />
    <a-tab-pane key="body" tab="响应参数" force-render />
  </a-tabs>

  <a-card v-show="responseTabActiveKey === 'header'" :bordered="false" class="my-5">
    <param-table v-model="responseResult.responseHeader" :options="requestHeaderOptions" />
  </a-card>
  <a-card v-show="responseTabActiveKey === 'body'" :bordered="false" class="my-5">
    <a-textarea v-model:value="responseResult.responseBody" :rows="8" />
  </a-card>
</template>
