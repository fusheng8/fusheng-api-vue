<script setup>
import WithdrawBalanceForm from './components/withdrawBalanceForm.vue'
import ChartCard from '~/pages/account/center/components/chart-card.vue'
import Field from '~/pages/account/center/components/field.vue'
import { useUserStore } from '~/stores/user.ts'
import ResetSecretKey from '~/pages/account/center/components/resetSecretKey.vue'
import { addOrUpdateUser, payBalance } from '~/api/user.ts'

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})

const resetSecretKeyModel = ref()
const notification = useNotification()
const userInfo = ref(useUserStore().userInfo)
const withdrawBalanceForm = ref()
const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: '24px' },
}
const payBalanceModel = ref(false)
const payBalanceData = ref({
  count: '',
})

const balanceNoticeOpen = ref(false)
const balanceNoticeFormModel = ref({})
function resetSK() {
  resetSecretKeyModel.value?.open()
}

function resetSkSuccess(res) {
  userInfo.value.secretKey = res
  notification.success({
    message: '重置成功',
    duration: 3,
  })
}
function toUpdateBalanceNotice() {
  addOrUpdateUser({
    id: userInfo.value.id,
    balanceLimitNotice: balanceNoticeFormModel.value.balanceNotice,
  })
  balanceNoticeOpen.value = false
  balanceNoticeFormModel.value = ''
  notification.success({
    message: '设置成功',
    duration: 3,
  })
}

async function toPayBalance() {
  // 生成订单
  const { data } = await payBalance({ count: payBalanceData.value.count })
  // 当前页面地址
  const url = window.location.href
  // 跳转支付
  window.location.href = `${import.meta.env.VITE_APP_BASE_API}/user/payBalancePage?orderId=${data}&returnUrl=${url}`
}

// 整数转换
function numberRep(value) {
  if (typeof value === 'string')
    return !Number.isNaN(Number(value)) ? value.replace(/\D/g, '') : ''
  else if (typeof value === 'number')
    return !Number.isNaN(value) ? String(value).replace(/\D/g, '') : ''
  else
    return ''
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
          <span>{{ userInfo.username }}</span>
        </template>
        <a-button type="link" @click="notification.warning({ message: '暂未开发', duration: 3 })">
          个人信息
        </a-button>
        <a-button type="link" @click="payBalanceModel = true">
          充值积分
        </a-button>
        <a-button type="link" @click="withdrawBalanceForm.open()">
          提现
        </a-button>
        <template #footer>
          <a-flex :vertical="value === 'vertical'" align="center">
            <Field label="剩余积分：" :value="userInfo.balance" />
            <a-button type="link" @click="balanceNoticeOpen = true">
              设置积分不足提醒
            </a-button>
          </a-flex>
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
          <a-button type="link" @click="resetSK()">
            重置密匙
          </a-button>
        </template>
      </ChartCard>
    </a-col>
  </a-row>
  <ResetSecretKey ref="resetSecretKeyModel" @ok="resetSkSuccess" />
  <a-modal v-model:open="payBalanceModel" title="充值积分" @ok="toPayBalance">
    <a-form :model="payBalanceData" class="w-full">
      <a-form-item name="count" label="充值积分数" :rules="[{ required: true, message: '请输入扣除积分数' }]">
        <a-input-number
          v-model:value="payBalanceData.count"
          class="w-full" placeholder="请输入大于0的整数"
          :formatter="numberRep" :parser="numberRep" :min="0"
        />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal v-model:open="balanceNoticeOpen" title="积分不足警告" @ok="toUpdateBalanceNotice">
    <a-form :model="balanceNoticeFormModel" class="w-full">
      <a-form-item name="balanceNotice" label="积分" :rules="[{ required: true, message: '请输入当积分低于多少发出通知' }]">
        <a-input-number
          v-model:value="balanceNoticeFormModel.balanceNotice"
          class="w-full" placeholder="请输入大于0的整数"
          :formatter="numberRep" :parser="numberRep" :min="0"
        />
      </a-form-item>
    </a-form>
  </a-modal>
  <WithdrawBalanceForm ref="withdrawBalanceForm" />
</template>

<style scoped lang="less">

</style>
