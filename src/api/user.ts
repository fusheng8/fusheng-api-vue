export interface UserInfo {
  id: number | string
  username: string
  avatar: string
  roles: (string | number)[]
}

export function register(params?: any) {
  return usePost<UserInfo>('/user/register', params)
}
export function getUserInfoApi() {
  return useGet<UserInfo>('/user/info')
}
export async function getUserPageList(params?: any) {
  return usePost<UserInfo[]>('/user/list', params)
}
export async function deleteUserByIds(params?: any) {
  return useGet(`/user/deleteByIds?ids=${params.join(',')}`)
}

export async function addOrUpdateUser(params?: any) {
  return usePost('/user/save', params)
}
export async function resetSecretKey(params?: any) {
  return useGet('/user/resetSecretKey', params)
}
export async function resetPassword(params?: any) {
  return usePost('/user/resetPassword', params)
}
export async function payBalance(params?: any) {
  return useGet('/user/payBalance', params)
}

export async function getPayBalanceStatus(params?: any) {
  return useGet('/user/payBalanceStatus', params)
}

export async function withdrawBalance(params?: any) {
  return usePost('/user/withdrawBalance', params)
}
