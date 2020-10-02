import { http } from '@/api'
import { createStorage } from '@/utils/storage'
import { LoginData } from '@/typings/interface/store'

const userStorage = createStorage({ key: 'user' })

export const login = async ({ commit }: any, data: LoginData) => {
  const { phone, password, callback } = data
  const user = password
    ? await http.reqLogin({ phone, password })
    : await http.reqLogin({ phone })
  if (user) {
    commit('COMMIT', { key: 'user', val: user })
    userStorage.set((user as any))
    callback && callback()
  }
}
