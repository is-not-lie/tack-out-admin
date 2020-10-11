import axios from 'axios'
import NProgress from 'nprogress'
import { message } from 'ant-design-vue'
import { createStorage } from '@/utils/storage'
import { BASE_URL } from '@/config'
import 'nprogress/nprogress.css'

const userStorage = createStorage({ key: 'user' })

axios.defaults.timeout = 6000
axios.defaults.baseURL = BASE_URL

axios.interceptors.request.use(
  config => {
    NProgress.start()
    const { method } = config
    if (method && method.toLowerCase() === 'post') {
      config.headers.authorization = `take_out_shop${userStorage.val}`
    }
    return config
  },
  () => {
    NProgress.done()
    message.error('请求发送失败')
  }
)

axios.interceptors.response.use(
  response => {
    NProgress.done()
    const { data, status, msg } = response.data
    if (status === 200) return data || true
    else {
      message.error(msg)
      return false
    }
  },
  () => {
    NProgress.done()
    message.error('服务器没有响应')
  }
)

export default axios
