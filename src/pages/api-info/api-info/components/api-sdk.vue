<script setup>
const { sdkList } = defineProps({
  apiInfo: {
    type: Array,
    default: () => ([]),
  },
})
</script>

<template>
  <template v-if="!sdkList || sdkList.length == 0">
    <a-empty />
  </template>
  <template v-else>
    <a-card v-for="(sdkItem, index) in sdkList" :key="index" :title="sdkItem.language">
      <a-typography-text :href="sdkItem.downloadUrl" target="_blank">
        {{ sdkItem.title }}
      </a-typography-text>
    </a-card>
  </template>
</template>
