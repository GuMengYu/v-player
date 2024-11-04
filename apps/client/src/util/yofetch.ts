type method =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'options'
  | 'head'
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS'
  | 'HEAD'

type responseType = 'text' | 'json' | 'stream' | 'blob' | 'arrayBuffer' | 'formData' | 'stream'

export interface Response<T> {
  config: Options | undefined
  status: number
  statusText: string
  data: T
  headers: Headers
  ok: boolean
  redirect: boolean
  url: string
  type: ResponseType
  body: ReadableStream<Uint8Array> | null
  bodyUsed: boolean
  [key: string]: any
}

type BodylessMethod = <T = any>(url: string, config?: Options) => Promise<Response<T>>
type BodyMethod = <T = any>(url: string, body?: any, config?: Options) => Promise<Response<T>>

export interface Options {
  baseURL?: string
  url?: string
  method?: method
  headers?: HeadersInit
  body?: FormData | string | object
  responseType?: responseType
  params?: Record<string, any> | URLSearchParams
  paramsSerializer?: (params: Options['params']) => string
  credentials?: 'include' | 'omit' | 'same-origin'
  auth?: string
  xsrfCookieName?: string
  xsrfHeaderName?: string
  validateStatus?: (status: number) => boolean
  transformRequest?: Array<(body: any, headers?: HeadersInit) => any>
  fetch?: typeof window.fetch
  data?: any
}

class YoFetch {
  defaults: Options

  constructor(options: Options = {}) {
    this.defaults = options
  }

  get: BodylessMethod = function (this: YoFetch, url, config) {
    return this.request(url, config, 'get')
  }

  delete: BodylessMethod = function (this: YoFetch, url, config) {
    return this.request(url, config, 'delete')
  }

  head: BodylessMethod = function (this: YoFetch, url, config) {
    return this.request(url, config, 'head')
  }

  options: BodylessMethod = function (this: YoFetch, url, config) {
    return this.request(url, config, 'options')
  }

  post: BodyMethod = function (this: YoFetch, url, data, config) {
    return this.request(url, config, 'post', data)
  }

  put: BodyMethod = function (this: YoFetch, url, data, config) {
    return this.request(url, config, 'put', data)
  }

  patch: BodyMethod = function (this: YoFetch, url, data, config) {
    return this.request(url, config, 'patch', data)
  }

  request<T>(urlOrConfig: string | Options, config?: Options, _method?: method, data?: any): Promise<Response<T>> {
    let url = ''
    if (typeof urlOrConfig !== 'string')
      config = urlOrConfig
    else
      url = urlOrConfig

    const response: Response<any> = { config } as Response<any>
    const customHeaders: HeadersInit = {}

    const options = deepMerge(this.defaults, config)

    data = data ?? options.data

    options.transformRequest?.forEach((f) => {
      data = f(data, options.headers) ?? data
    })

    if (options.auth)
      customHeaders.authorization = options.auth

    if (data && typeof data === 'object' && typeof data.append !== 'function' && typeof data.text !== 'function') {
      data = JSON.stringify(data)
      customHeaders['content-type'] = 'application/json'
    }

    try {
      customHeaders[options.xsrfHeaderName] = decodeURIComponent(
        document.cookie.match(RegExp(`(^|; )${options.xsrfCookieName}=([^;]*)`))[2],
      )
    }
    catch (e) {}

    // append baseURL to url
    if (options.baseURL)
      url = url.replace(/^(?!.*\/\/)\/?/, `${options.baseURL}/`)

    // serialize params to query string
    if (options.params) {
      url
        += (~url.indexOf('?') ? '&' : '?')
        + (options.paramsSerializer ? options.paramsSerializer(options.params) : new URLSearchParams(options.params))
    }

    // use customer fetch function if provided
    const fetchFunc = options.fetch || fetch

    return fetchFunc(url, {
      method: (_method || options.method || 'get').toUpperCase(),
      body: data,
      headers: deepMerge(options.headers, customHeaders),
      credentials: options.credentials,
    }).then((res) => {
      for (const i in res) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (typeof res[i] !== 'function') {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          response[i] = res[i]
        }
      }

      if (options.responseType === 'stream') {
        response.data = res.body
        return response
      }
      return res[options.responseType || 'text']()
        .then((data) => {
          response.data = data
          // its okay if this fails: response.data will be the unparsed value:
          response.data = JSON.parse(data)
        })
        .catch(Object)
        .then(() => {
          const ok = options.validateStatus ? options.validateStatus(res.status) : res.ok
          return ok ? response : Promise.reject(response)
        })
    })
  }

  all = Promise.all.bind(Promise)
  create(config: Options) {
    return createInstance(config)
  }
}

function deepMerge<T, U>(opts: T, overrides: U, lowerCase = false): Record<string, any> & (T | U) {
  const out: Record<string, any> = {}
  for (const i in opts) {
    const key = lowerCase ? i.toLowerCase() : i
    out[key] = opts[i]
  }
  for (const i in overrides) {
    const key = lowerCase ? i.toLowerCase() : i
    const value = overrides[i]
    out[key] = key in out && typeof value == 'object' ? deepMerge(out[key], value, key === 'headers') : value
  }
  return out as Record<string, any> & (T | U)
}

function createInstance(defaults: Options = {}) {
  // create default yofetch instance
  return new YoFetch(defaults)
}

const yofetch = createInstance()
export default yofetch
