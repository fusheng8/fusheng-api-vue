<script setup lang="ts">
import { LockOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons-vue'
import { delayTimer } from '@v-c/utils'
import type { Rule } from 'ant-design-vue/es/form'
import pageBubble from '@/utils/page-bubble'
import { sendRegisterCode } from '~/api/code.ts'
import { register } from '~/api/user.ts'

const message = useMessage()
const notification = useNotification()
const appStore = useAppStore()
const { layoutSetting } = storeToRefs(appStore)
const router = useRouter()
const registerModel = reactive({
  username: '',
  password: '',
  email: '',
  code: '',
  password1: '',
})
const formRef = shallowRef()
const codeLoading = shallowRef(false)
const resetCounter = 60
const submitLoading = shallowRef(false)
const bubbleCanvas = ref<HTMLCanvasElement>()
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
async function getCode() {
  codeLoading.value = true
  try {
    await formRef.value.validate(['email'])
    await sendRegisterCode({ email: registerModel.email })
    reset()
    resume()
    message.success('验证码发送成功')
    codeLoading.value = false
  }
  catch (error) {
    codeLoading.value = false
  }
}

async function submit() {
  await formRef.value.validate()
  await register(registerModel)
  notification.success({
    message: '注册成功',
    duration: 3,
  })
  await router.push('/login')
}

onMounted(async () => {
  await delayTimer(300)
  pageBubble.init(unref(bubbleCanvas)!)
})

onBeforeUnmount(() => {
  pageBubble.removeListeners()
})

async function checkPasswordSame(_rule: Rule, value: string) {
  if (value === '')
    return Promise.reject(new Error('请再输入一次密码'))
  else if (value !== registerModel.password)
    return Promise.reject(new Error('两次密码不一致'))
  else
    return Promise.resolve()
}
</script>

<template>
  <div class="login-container">
    <div h-screen w-screen absolute z-10>
      <canvas ref="bubbleCanvas" />
    </div>
    <div class="login-content flex-center">
      <div class="ant-pro-form-login-main rounded">
        <div
          class="flex-between h-15 px-4 mb-[2px]"
        >
          <div class="flex-end">
            <span class="ant-pro-form-login-logo">
              <img w-full h-full object-cover src="/logo.svg">
            </span>
            <span class="ant-pro-form-login-title">
              API聚合平台
            </span>
            <span class="ant-pro-form-login-desc" />
          </div>
          <div class="login-lang flex-center relative z-11">
            <span
              class="flex-center cursor-pointer text-16px"
              @click="appStore.toggleTheme(layoutSetting.theme === 'dark' ? 'light' : 'dark')"
            >
              <!-- 亮色和暗黑模式切换按钮 -->
              <template v-if="layoutSetting.theme === 'light'">
                <carbon-moon />
              </template>
              <template v-else>
                <carbon-sun />
              </template>
            </span>
          </div>
        </div>
        <a-divider m-0 />
        <!-- 登录主体 -->
        <div class="box-border flex min-h-[520px]">
          <div class="ant-pro-form-login-main-right px-5 w-[335px] flex-center flex-col relative z-11">
            <div class="text-center py-6 text-2xl">
              欢迎注册本系统
            </div>
            <a-form ref="formRef" :model="registerModel">
              <a-form-item
                name="username" :rules="[{ required: true, message: '请输入用户名' }]"
              >
                <a-input
                  v-model:value="registerModel.username" allow-clear
                  placeholder="用户名" size="large" @press-enter="submit"
                >
                  <template #prefix>
                    <UserOutlined />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item
                name="password"
                :rules="[{ required: true, message: '请输入密码' }, { min: 6, message: '密码长度至少6位' }, { max: 20, message: '密码长度最多20位' }]"
              >
                <a-input
                  v-model:value="registerModel.password" allow-clear
                  placeholder="密码" size="large" @press-enter="submit"
                >
                  <template #prefix>
                    <LockOutlined />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item
                name="password1"
                :rules="[{ validator: checkPasswordSame, trigger: 'change' }]"
              >
                <a-input
                  v-model:value="registerModel.password1" allow-clear
                  placeholder="再输入一次密码" size="large" @press-enter="submit"
                >
                  <template #prefix>
                    <LockOutlined />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item
                name="email" :rules="[
                  { required: true, message: '请输入正确的邮箱' },
                  {
                    pattern: /^[A-Za-z0-9]+([-._][A-Za-z0-9]+)*@[A-Za-z0-9]+(-[A-Za-z0-9]+)*(\.[A-Za-z]{2,6}|[A-Za-z]{2,4}\.[A-Za-z]{2,3})$/,
                    message: '请输入正确的邮箱',
                  },
                ]"
              >
                <a-input
                  v-model:value="registerModel.email" allow-clear
                  placeholder="邮箱" size="large" @press-enter="submit"
                >
                  <template #prefix>
                    <MobileOutlined />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item name="code" :rules="[{ required: true, message: '请输入验证码' }]">
                <div flex items-center>
                  <a-input
                    v-model:value="registerModel.code"
                    style="flex: 1 1 0%; transition: width 0.3s ease 0s; margin-right: 8px;" allow-clear
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

              <a-button type="primary" block :loading="submitLoading" size="large" @click="submit">
                注册
              </a-button>
              <a-divider>
                <router-link to="/login">
                  <a-button type="link" block>
                    返回登录
                  </a-button>
                </router-link>
              </a-divider>
            </a-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  background: var(--bg-color-container);
}

.login-lang {
  height: 40px;
  line-height: 44px;
}

.login-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.ant-pro-form-login-container {
  display: flex;
  flex: 1 1;
  flex-direction: column;
  height: 100%;
  padding: 32px 0;
  overflow: auto;
  background: inherit
}

.ant-pro-form-login-header a {
  text-decoration: none
}

.ant-pro-form-login-title {
  color: var(--text-color);
  font-weight: 600;
  font-size: 33px;
  line-height: 1;
}

.ant-pro-form-login-logo {
  width: 44px;
  height: 44px;
  margin-right: 16px;
  vertical-align: top
}

.ant-pro-form-login-desc {
  color: var(--text-color-1);
  font-size: 14px;
  margin-left: 16px
}

.ant-pro-form-login-main-right {
  .ant-tabs-nav-list {
    margin: 0 auto;
    font-size: 16px;
  }

  .ant-pro-form-login-other {
    line-height: 22px;
    text-align: center
  }

}

.ant-pro-form-login-main {
  box-shadow: var(--c-shadow);
}

.icon {
  margin-left: 8px;
  color: var(--text-color-2);
  font-size: 24px;
  vertical-align: middle;
  cursor: pointer;
  transition: color .3s;

  &:hover {
    color: var(--pro-ant-color-primary);
  }
}

.login-media(@width:100%) {
  .ant-pro-form-login-main {
    width: @width;
  }
  .ant-pro-form-login-main-left {
    display: none;
  }
  .ant-pro-form-login-main-right {
    width: 100%;
  }
  .ant-pro-form-login-desc {
    display: none;
  }
}

@media (min-width: 992px) {
  .ant-pro-form-login-main-left {
    width: 700px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .ant-pro-login-divider {
    display: none;
  }

  .login-media(400px)
}

@media screen and (max-width: 767px) {
  .login-media(350px);

  .ant-pro-login-divider {
    display: none;
  }
}
</style>
