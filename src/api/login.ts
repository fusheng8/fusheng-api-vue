export interface LoginParams {
  username: string
  password: string
  type?: 'account'
}

export interface LoginEmailParams {
  mobile: string
  code: string
  type: 'mobile'
}

export interface LoginResultModel {
  token: string
}

export function loginApi(params: LoginParams | LoginEmailParams) {
  return usePost<LoginResultModel, LoginParams | LoginEmailParams>('/user/login', params, {
    // 设置为false的时候不会携带token
    token: false,
    // 开发模式下使用自定义的接口
    customDev: true,
    // 是否开启全局请求loading
    loading: true,
  })
}

export function logoutApi() {
  return useGet('/user/logout')
}
