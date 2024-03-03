<script setup lang="ts">
import { ref } from 'vue'
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { useAuthorization } from '~/composables/authorization.ts'

const { type } = defineProps<{
  type?: string
}>()
const FILE_UPLOAD_URL = import.meta.env.VITE_APP_FILE_UPLOAD_URL
const FileLoding = ref(false)

const fileUrl = defineModel()
function onFileStatusChange(res: any) {
  switch (res.file.status) {
    case 'uploading':
      FileLoding.value = true
      break
    case 'done':
      fileUrl.value = res.file.response.data
      FileLoding.value = false
      break
    case 'error':
      FileLoding.value = false
      break
  }
}
</script>

<template>
  <a-upload
    name="file"
    list-type="picture-card"
    :show-upload-list="false"
    :action="FILE_UPLOAD_URL"
    :headers="{ token: useAuthorization().value || '' }"
    :max-count="1"
    @change="onFileStatusChange"
  >
    <template v-if="type === 'image' ">
      <img v-if="!FileLoding && fileUrl" class="avatar-img" :src="fileUrl" alt="avatar">
      <div v-else>
        <LoadingOutlined v-if="FileLoding" />
        <PlusOutlined v-else />
        <div class="ant-upload-text">
          上传图片
        </div>
      </div>
    </template>
    <template v-else>
      <UploadOutlined />
      上传文件
    </template>
  </a-upload>
</template>

<style scoped lang="less">
.avatar-img {
  object-fit: fill;
  height: 100%;
  width: 100%;
}
</style>
