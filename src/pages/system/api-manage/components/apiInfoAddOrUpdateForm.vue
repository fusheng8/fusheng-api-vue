<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue'
import { notification } from 'ant-design-vue'
import { cloneDeep } from 'lodash'
import { computed, defineEmits, defineExpose, ref } from 'vue'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { useAuthorization } from '/src/composables/authorization.ts'
import ParamTable from '~/components/param-table/param-table.vue'
import { requestHeaderOptions } from '~/param-table-options/requestHeaderOptions.ts'
import { requestParamOptions } from '~/param-table-options/RequestParamOptions.ts'
import { responseParamOptions } from '~/param-table-options/responseParamOptions.ts'
import { saveOrUpdateApiInfo } from '~/api/api.ts'

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
  if (!isUpdate.value)
    formData.value = {}
  else
    formData.value = cloneDeep(record) ?? {}
}

async function handleOk() {
  try {
    await formRef.value?.validate()

    await saveOrUpdateApiInfo(formData.value)

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
    return !Number.isNaN(Number(value)) ? value.replace(/[^\d]/g, '') : ''
  else if (typeof value === 'number')
    return !Number.isNaN(value) ? String(value).replace(/[^\d]/g, '') : ''
  else
    return ''
}
</script>

<template>
  <a-modal v-model:open="visible" :destroy-on-close="true" :width="800" :mask-closable="false" :title="title" @ok="handleOk" @cancel="handleCancel">
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
        <a-input v-model:value="formData.name" :maxlength="50" placeholder="请输入接口名称" />
      </a-form-item>
      <a-form-item name="url" label="接口地址" :rules="[{ required: true, message: '请输入接口地址' }]">
        <a-input v-model:value="formData.url" :maxlength="200" placeholder="请输入接口地址" />
      </a-form-item>
      <a-space>
        <a-form-item name="method" label="请求方法" :rules="[{ required: true, message: '请选择接口方法' }]">
          <a-select v-model:value="formData.method" placeholder="请选择请求方法">
            <a-select-option value="GET">
              GET
            </a-select-option>
            <a-select-option value="POST">
              POST
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="status" label="接口状态" :rules="[{ required: true, message: '请选择接口状态' }]">
          <a-select v-model:value="formData.status" placeholder="请选择接口状态">
            <a-select-option :value="1">
              开启
            </a-select-option>
            <a-select-option :value="0">
              关闭
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-space>
      <a-form-item name="reduceBalance" label="扣除积分数" :rules="[{ required: true, message: '请输入扣除积分数' }]">
        <a-input-number
          v-model:value="formData.reduceBalance"
          class="w-full" placeholder="请输入0-100的数字"
          :formatter="numberRep" :parser="numberRep" :min="0" :max="100"
        />
      </a-form-item>
      <a-form-item name="description" label="接口描述">
        <a-textarea
          v-model:value="formData.description"
          show-count auto-size="true" allow-clear
          :maxlength="200" placeholder="请输入接口描述"
        />
      </a-form-item>
      <a-form-item name="requestHeader" label="请求头">
        <ParamTable v-model="formData.requestHeader" :options="requestHeaderOptions" />
      </a-form-item>
      <a-form-item name="requestParams" label="请求参数">
        <ParamTable v-model="formData.requestParams" :options="requestParamOptions" />
      </a-form-item>
      <a-form-item name="requestExample" label="请求示例">
        <a-textarea
          v-model:value="formData.requestExample"
          allow-clear :rows="8"
          :maxlength="2000" placeholder="请输入请求示例"
        />
      </a-form-item>
      <a-form-item name="responseHeader" label="响应参数">
        <ParamTable v-model="formData.responseParams" :options="responseParamOptions" />
      </a-form-item>
      <a-form-item name="responseExample" label="响应示例">
        <a-textarea
          v-model:value="formData.responseExample"
          allow-clear :rows="8"
          :maxlength="2000" placeholder="请输入响应示例"
        />
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
