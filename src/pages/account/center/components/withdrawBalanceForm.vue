<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue'
import { notification } from 'ant-design-vue'
import { defineEmits, defineExpose, ref } from 'vue'
import { useUserStore } from '~/stores/user.ts'
import ImageUpload from '~/components/image-upload/image-upload.vue'
import { withdrawBalance } from '~/api/user.ts'

const emit = defineEmits(['cancel', 'ok'])

const visible = ref(false)

const formRef = ref<FormInstance>()

const formData = ref<any>({})

const labelCol = { style: { width: '100px' } }
const wrapperCol = { span: 24 }
let userInfo = useUserStore().getUserInfo()

async function open() {
  visible.value = true
  userInfo = await useUserStore().getUserInfo()
}

async function handleOk() {
  try {
    await formRef.value?.validate()
    console.log(userInfo)
    console.log(Number.parseInt(userInfo.balance))
    console.log(Number.parseInt(formData.value.amount))
    if (Number.parseInt(userInfo.balance) < Number.parseInt(formData.value.amount)) {
      notification.error({
        message: '提现积分数不能大于账户积分数',
        duration: 3,
      })
      return
    }
    await withdrawBalance(formData.value)
    emit('ok')
    notification?.success({
      message: '提现成功',
      duration: 3,
    })
    visible.value = false
  }
  catch (error) {
  }
}

function handleCancel() {
  formRef.value?.resetFields()
  emit('cancel')
}

defineExpose({
  open,
})
</script>

<template>
  <a-modal v-model:open="visible" title="提现" :mask-closable="false" @ok="handleOk" @cancel="handleCancel">
    <a-form ref="formRef" :model="formData" class="w-full" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item name="amount" label="提现积分数" :rules="[{ required: true, message: '请输入提现积分数' }]">
        <a-input-number
          v-model:value="formData.amount"
          class="w-full"
          placeholder="请输入大于0的整数"
          string-mode
        />
      </a-form-item>
      <a-form-item name="method" label="提现方式" :rules="[{ required: true, message: '请选择提现方式' }]">
        <a-select v-model:value="formData.method" placeholder="请选择状态">
          <a-select-option :value="1">
            微信
          </a-select-option>
          <a-select-option :value="2">
            支付宝
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="paymentCode" label="上传收款码" :rules="[{ required: true, message: '请上传收款码' }]">
        <ImageUpload v-model="formData.paymentCode" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>

</style>
