<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue'
import { message } from 'ant-design-vue'

import { defineEmits, defineExpose, ref } from 'vue'
import { LockOutlined } from '@ant-design/icons-vue'
import { delayTimer } from '@v-c/utils'
import pageBubble from '~/utils/page-bubble.ts'
import { sendResetSkCode } from '~/api/code.ts'
import { resetSecretKey } from '~/api/user.ts'

const emit = defineEmits(['cancel', 'ok'])

const isUpdate = ref(false)
const visible = ref(false)
const formRef = ref<FormInstance>()
const formData = ref<any>({
  code: '',
})
const codeLoading = shallowRef(false)
const resetCounter = 60
const submitLoading = shallowRef(false)
const { counter, pause, reset, resume, isActive } = useInterval(1000, {
  controls: true,
  immediate: false,
  callback(count) {
    if (count) {
      if (count === resetCounter)
        pause()
    }
  },
})

function open() {
  visible.value = true
}

async function getCode() {
  codeLoading.value = true
  try {
    await formRef.value.validate(['email'])
    await sendResetSkCode()
    reset()
    resume()
    message.success('验证码发送成功')
    codeLoading.value = false
  }
  catch (error) {
    codeLoading.value = false
  }
}

async function handleOk() {
  try {
    await formRef.value?.validate()
    const res = await resetSecretKey({ code: formData.value.code })
    visible.value = false
    emit('ok', res.data)
  }
  catch (error) {
    console.log(error)
  }
}

function handleCancel() {
  formRef.value?.resetFields()
  emit('cancel')
}

onMounted(async () => {
  await delayTimer(300)
})

onBeforeUnmount(() => {
  pageBubble.removeListeners()
})

defineExpose({
  open,
})
</script>

<template>
  <a-modal v-model:open="visible" :destroy-on-close="true" title="请先验证你的邮箱" :width="500" :mask-closable="false" @ok="handleOk" @cancel="handleCancel">
    <a-form ref="formRef" :model="formData" class="w-full">
      <a-form-item name="code" :rules="[{ required: true, message: '请输入验证码' }]">
        <div flex items-center>
          <a-input
            v-model:value="formData.code"
            style="flex: 1 1 0; transition: width 0.3s ease 0s; margin-right: 8px;" allow-clear
            placeholder="请输入验证码" size="large" @press-enter="submit"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input>
          <a-button :loading="codeLoading" :disabled="isActive" size="large" @click="getCode">
            <template v-if="!isActive">
              获取验证码
            </template>
            <template v-else>
              {{ resetCounter - counter }} 秒后重新获取
            </template>
          </a-button>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>
</style>
