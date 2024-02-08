<script setup>
import IntroduceRow from '~/pages/account/center/introduce-row.vue'

defineOptions({
  name: 'Analysis',
})

const loading = ref(false)

const visitData = ref([])
</script>

<template>
  <page-container title="">
    <Suspense :fallback="null">
      <IntroduceRow :loading="loading" :visit-data="visitData" />
    </Suspense>
  </page-container>
</template>
