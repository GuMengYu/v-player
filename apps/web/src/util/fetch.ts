import type { Options } from './yofetch'
import yofetch from './yofetch'

const service = yofetch.create({
  baseURL: 'http://127.0.0.1:12140',
  credentials: 'include',
})

const localService = yofetch.create({
  baseURL: 'http://127.0.0.1:12141',
})

export function localRequest<T>(url: string | Options, config?: Options) {
  return localService.request<T>(url, config, 'get').then((response) => {
    const { data, ok } = response
    return data;
  })
}

export function localPost<T>(url: string | Options, body: any, config?: Options) {
  return localService.request<T>(url, config, 'post', body).then((response) => {
    const { data, ok } = response
    return data;
  })
}


// direct return response data
export function request<T>(url: string | Options, config?: Options) {
  return service.request<T>(url, config, 'get').then((response) => {
    const { data, ok } = response
    const { code, status, body } = data as any
    // success code is 100 or 200
    if (ok && [100, 200].includes(code))
      return data
    else if (status === 200)
      return body as T
    else
      return Promise.reject(data)
  })
}
export function requestPost<T>(url: string | Options, body: any, config?: Options) {
  return service.request<T>(url, config, 'post', body).then((response) => {
    const { data, ok } = response
    const { code } = data as any
    // success code is 100 or 200
    if (ok && [100, 200].includes(code))
      return data
    else
      return Promise.reject(data)
  })
}



export default service
