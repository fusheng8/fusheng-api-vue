<script setup lang="ts">
import { ref } from 'vue'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { useAuthorization } from '~/composables/authorization.ts'

const FILE_UPLOAD_URL = import.meta.env.VITE_APP_FILE_UPLOAD_URL
const imageLoding = ref(false)

const imageUrl = defineModel()
function onFileStatusChange(res: any) {
  switch (res.file.status) {
    case 'uploading':
      imageLoding.value = true
      break
    case 'done':
      imageUrl.value = res.file.response.data
      imageLoding.value = false
      break
    case 'error':
      imageLoding.value = false
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
    <img v-if="!imageLoding && imageUrl" class="avatar-img" :src="imageUrl" alt="avatar">
    <div v-else>
      <LoadingOutlined v-if="imageLoding" />
      <PlusOutlined v-else />
      <div class="ant-upload-text">
        上传
      </div>
    </div>
  </a-upload>
</template>

<style scoped lang="less">
.avatar-img {
  object-fit: fill;
  height: 100%;
  width: 100%;
}
</style>
