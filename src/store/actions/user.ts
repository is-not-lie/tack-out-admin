import { http } from '@/api'
import { createStorage } from '@/utils/storage'
import { LoginParams } from '@/typings/interface/request'

const userStorage = createStorage({ key: 'user' })

export const login = async ({ commit }: any, data: LoginParams) => {
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
