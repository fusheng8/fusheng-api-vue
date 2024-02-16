export function sendRegisterCode(params?: any) {
  return useGet('/code/sendRegisterCode', params)
}
export function sendResetSkCode() {
  return useGet('/code/sendResetSkCode')
}
