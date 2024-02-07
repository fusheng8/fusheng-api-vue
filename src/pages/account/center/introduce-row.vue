<script setup>
import ChartCard from '~/pages/account/center/components/chart-card.vue'
import Field from '~/pages/account/center/components/field.vue'
import { useUserStore } from '~/stores/user.ts'

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})
const { userInfo } = useUserStore()
const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: '24px' },
}
</script>

<template>
  <a-row :gutter="24">
    <a-col v-bind="{ ...topColResponsiveProps }">
      <ChartCard class="h-[190px]" :bordered="false" title="" :loading="loading" :content-height="46">
        <template #action>
          <a-avatar :src="userInfo.avatar" />
        </template>
        <template #total>
          <span>{{ userInfo.nickName }}</span>
        </template>
        <a-button type="link">
          个人信息
        </a-button>
        <a-button type="link">
          充值积分
        </a-button>
        <template #footer>
          <Field label="剩余积分：" :value="userInfo.balance" />
        </template>
      </ChartCard>
    </a-col>

    <a-col v-bind="{ ...topColResponsiveProps }">
      <ChartCard class="h-[190px]" :bordered="false" title="访问量" :loading="loading" :content-height="46">
        <a-typography-paragraph :copyable="{ text: userInfo.accessKey }">
          AccessKey: {{ userInfo.accessKey }}
        </a-typography-paragraph>
        <a-typography-paragraph :copyable="{ text: userInfo.secretKey }">
          SecretKey: {{ userInfo.secretKey.replace(/./g, '*') }}
        </a-typography-paragraph>
        <template #footer>
          <a-button type="link">
            重置密匙
          </a-button>
        </template>
      </ChartCard>
    </a-col>
  </a-row>
</template>

<style scoped lang="less">

</style>
