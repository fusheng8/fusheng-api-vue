export function sendRegisterCode(params?: any) {
  return useGet('/code/sendRegisterCode', params)
}
