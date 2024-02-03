export function getApiInfoPageList(params?: any) {
  return usePost<any[]>('/api-info/list', params)
}
export function deleteApiInfoByIds(params?: any) {
  return useGet(`/api-info/deleteByIds?ids=${params.join(',')}`)
}
