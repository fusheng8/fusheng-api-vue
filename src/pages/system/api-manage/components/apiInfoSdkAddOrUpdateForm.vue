<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue'
import { Modal } from 'ant-design-vue'
import { defineEmits, defineExpose, ref } from 'vue'
import { queryApiInfoById, updateApiSdk } from '~/api/api.ts'
import { sdkInfoOptions } from '~/param-table-options/sdkInfoOptions'
import ParamTable from '~/components/param-table/param-table.vue'

const emit = defineEmits(['cancel', 'ok'])

const editSdkModelVisable = ref(false)
const addLanguageModelVisable = ref(false)
const sdkInfo = ref<any>({})
const formRef = ref<FormInstance>()
const apiId = ref()
const panes = ref<{ title: string, key: string, closable?: boolean }[]>([])
const addLanguageValue = ref('')

const activeKey = ref()

function addLanguage(e: any) {
  if (e) {
    // 添加
    if (!addLanguageValue.value) {
      Modal.error({
        title: '错误',
        content: `请输入语言`,
      })
      return
    }
    panes.value.push({ title: addLanguageValue.value, key: addLanguageValue.value, closable: true })
    addLanguageValue.value = ''
    addLanguageModelVisable.value = false
  }
  else {
    // 打开弹窗
    addLanguageModelVisable.value = true
  }
}

function remove(targetKey: string) {
  panes.value = panes.value.filter(pane => pane.key !== targetKey)
  delete sdkInfo.value[targetKey]
}

function onEdit(targetKey: any, action: any) {
  if (action === 'add')
    addLanguage(null)
  else
    remove(targetKey as string)
}

async function open(id: any) {
  editSdkModelVisable.value = true
  panes.value = []
  sdkInfo.value = {}
  // 获取api信息
  const res = await queryApiInfoById({ 'id': id })
  apiId.value = id
  parseSdkData((res as any).data.sdk)
}

// 根据sdk解析视图数据
function parseSdkData(sdkData: any[]) {
  const sdkDataObj: any = {}
  sdkData.forEach((item: any) => {
    // 生成tab
    panes.value.push({ title: item.language, key: item.language })
    sdkDataObj[item.language] = []
    item.list.forEach((listItem: any) => {
      sdkDataObj[item.language].push(listItem)
    })
  })
  sdkInfo.value = sdkDataObj
}

async function handleOk() {
  const model = []
  for (const key in sdkInfo.value)
    model.push({ language: key, list: sdkInfo.value[key] })

  await updateApiSdk({ id: apiId.value, sdk: model })
  useNotification().success({
    message: '成功',
    description: '修改成功',
    duration: 3,
  })

  editSdkModelVisable.value = false
}

async function handleCancel() {
  formRef.value?.resetFields()
  emit('cancel')
}

defineExpose({
  open,
})
</script>

<template>
  <a-modal
    v-model:open="editSdkModelVisable"
    cancel-text="取消" ok-text="确定"
    :destroy-on-close="true" :width="800" :mask-closable="false" title="编辑SDK" @ok="handleOk" @cancel="handleCancel"
  >
    <a-tabs v-model:activeKey="activeKey" type="editable-card" @edit="onEdit">
      <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable">
        <ParamTable v-model="sdkInfo[pane.key]" :options="sdkInfoOptions" :show-operate="true" :show-add="true" />
      </a-tab-pane>
    </a-tabs>
  </a-modal>
  <a-modal v-model:open="addLanguageModelVisable" title="新增语言" @ok="addLanguage">
    <a-form-item-rest title="语言">
      <a-input v-model:value="addLanguageValue" />
    </a-form-item-rest>
  </a-modal>
</template>

<style scoped>

</style>
