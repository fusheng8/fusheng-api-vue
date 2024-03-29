<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue'
import { notification } from 'ant-design-vue'
import { cloneDeep } from 'lodash'
import { computed, defineEmits, defineExpose, ref } from 'vue'
import { addOrUpdateUser } from '~/api/user.ts'

const emit = defineEmits(['cancel', 'ok'])

const isUpdate = ref(false)
const avatarLoding = ref(false)

const token = useAuthorization().value || ''

const FILE_UPLOAD_URL = import.meta.env.VITE_APP_FILE_UPLOAD_URL

const visible = ref(false)

const title = computed(() => {
  return isUpdate.value ? '编辑' : '新增'
})

const formRef = ref<FormInstance>()

const formData = ref<any>({})
const allRoles = ref<any[]>()

const labelCol = { style: { width: '100px' } }
const wrapperCol = { span: 24 }

function open(record?: any, allRolesList?: any[]) {
  visible.value = true
  isUpdate.value = !!record?.id
  allRoles.value = allRolesList
  if (!isUpdate.value) {
    formData.value = {}
    return
  }
  formData.value = cloneDeep(record) ?? {}
  formData.value.roles = JSON.parse(formData.value.roles)
}

async function handleOk() {
  try {
    await formRef.value?.validate()

    await addOrUpdateUser(formData.value)

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
      formData.value.avatar = res.file.response.data
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
</script>

<template>
  <a-modal v-model:open="visible" :title="title" :mask-closable="false" @ok="handleOk" @cancel="handleCancel">
    <a-form ref="formRef" :model="formData" class="w-full" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item name="avatar" label="头像">
        <FileUpload v-model="formData.avatarUrl" type="image" />
      </a-form-item>
      <a-form-item name="username" label="用户名" :rules="[{ required: true, message: '请输入用户名' }]">
        <a-input v-model:value="formData.username" :maxlength="50" placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item name="password" label="密码" :rules="[{ required: !isUpdate, message: '请输入密码' }]">
        <a-input-password v-model:value="formData.password" :maxlength="50" placeholder="请输入密码" />
      </a-form-item>
      <a-form-item name="email" label="邮箱">
        <a-input v-model:value="formData.email" :maxlength="50" placeholder="请输入邮箱" />
      </a-form-item>
      <a-form-item name="phone" label="手机号">
        <a-input v-model:value="formData.phone" :maxlength="50" placeholder="请输入手机号" />
      </a-form-item>
      <a-form-item name="userStatus" label="状态" :rules="[{ required: true, message: '请选择状态' }]">
        <a-select
          v-model:value="formData.userStatus"
        >
          <a-select-option :value="1">
            开启
          </a-select-option>
          <a-select-option :value="0">
            关闭
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="roles" label="角色">
        <a-select
          v-model:value="formData.roles"
          mode="multiple"
        >
          <template v-if="!allRoles || allRoles.length > 0">
            <a-select-option v-for="item in allRoles" :key="item" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </template>
        </a-select>
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
