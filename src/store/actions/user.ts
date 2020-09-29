import { http } from '@/api'
import { createStorage } from '@/utils/storage'
import { loginData } from '@/tsConfig/interface/storeInterface'

const userStorage = createStorage({ key: 'user' })

export const login = async ({ commit }, data: loginData) => {
  const { phone, password, callback } = data
  const user: any = password
    ? await http.reqLogin({ phone, password })
    : await http.reqLogin({ phone })
  if (user) {
    commit('COMMIT', { key: 'user', val: user })
    userStorage.set(user)
    callback && callback()
  }
}
