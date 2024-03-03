export function getApiInfoPageList(params?: any) {
  return new Promise((resolve, reject) => {
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
      reject(err)
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
export function reviewApi(params?: any) {
  return useGet('/api-info/reviewApi', params)
}

export function updateApiSdk(params?: any) {
  return usePost('/api-info/updateApiSdk', params)
}

export function queryApiInfoById(params?: any) {
  return new Promise((resolve, reject) => {
    return useGet('/api-info/queryById', params).then((res) => {
      if (res.data) {
        const data = res.data
        if (data.requestHeader)
          data.requestHeader = JSON.parse(data.requestHeader)
        else
          data.requestHeader = []

        if (data.requestParams)
          data.requestParams = JSON.parse(data.requestParams)
        else data.requestParams = []

        if (data.responseParams)
          data.responseParams = JSON.parse(data.responseParams)
        else data.responseParams = []

        if (data.sdk)
          data.sdk = JSON.parse(data.sdk)
        else data.sdk = []
        resolve(res)
      }
    }).catch((err) => {
      reject(err)
    })
  })
}
