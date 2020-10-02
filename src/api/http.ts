import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { createStorage } from '@/utils/storage'
// import { BASE_URL } from '@/config'

const userStorage = createStorage({ key: 'user' })

axios.defaults.timeout = 6000
axios.defaults.baseURL = '/api'

axios.interceptors.request.use(
  (config) => {
    NProgress.start()
    const { method } = config
    if (method && method.toLowerCase() === 'post') {
      config.headers.authorization = `take_out_shop${userStorage.val}`
    }
    return config
  },
  (): void => {
  NProgress.done()
  // Message.error('请求发送失败')
  }
)

axios.interceptors.response.use(
  (response): any => {
    NProgress.done()
    const { data, status, msg } = response.data
    return status >= 200 && status < 300
      ? data || true
      : console.log(msg)
  },
  (): void => {
  NProgress.done()
  // Message.error('服务器没有响应')
  }
)

export default axios
