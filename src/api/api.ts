export function getApiInfoPageList(params?: any) {
  return new Promise((resolve) => {
    usePost<any>('/api-info/list', params).then((res) => {
      // 转换数据
      if (res.data.list && res?.data.list.length > 0) {
        res.data.list.forEach((item: any) => {
          if (item.requestHeader)
            item.requestHeader = JSON.parse(item.requestHeader)
          else
            item.requestHeader = []

          if (item.requestParams)
            item.requestParams = JSON.parse(item.requestParams)
          else item.requestParams = []

          if (item.responseParams)
            item.responseParams = JSON.parse(item.responseParams)
          else item.responseParams = []
        })
      }
      resolve(res)
    }).catch((err) => {
      Promise.reject(err)
    },
    )
  })
}
export function saveOrUpdateApiInfo(params?: any) {
  return usePost('/api-info/saveOrUpdate', params)
}
export function deleteApiInfoByIds(params?: any) {
  return useGet(`/api-info/deleteByIds?ids=${params.join(',')}`)
}
