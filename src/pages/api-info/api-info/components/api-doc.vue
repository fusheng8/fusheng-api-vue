<script setup>
import { requestHeaderOptions } from '~/param-table-options/requestHeaderOptions.ts'
import ParamTable from '~/components/param-table/param-table.vue'

const { info } = defineProps({
  info: {
    type: Object,
    default: () => ({}),
  },
})
const apiInfo = ref({})
onMounted(() => {
  apiInfo.value = info
})
</script>

<template>
  {{ apiInfo }}
  <ParamTable v-model="apiInfo.headerData" :options="requestHeaderOptions" />
</template>

<style scoped lang="less">

</style>
