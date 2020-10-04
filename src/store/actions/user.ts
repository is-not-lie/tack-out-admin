import { http } from '@/api'
import { createStorage } from '@/utils/storage'
import { LoginParams, EditRuleParams } from '@/typings/interface/request'

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

export const getUsers = async ({ commit }: any, pageNum: number) => {
  const userList = await http.reqUsers(pageNum)
  if (userList) commit('COMMIT', { key: 'userList', val: userList })
}

export const searchUser = async ({ state }: any, phone: string) => {
  const user: any = await http.reqSeachUser(phone)
  if (user.phone) {
    const { list } = state.userList
    const index = list.findIndex((item: { _id: any }) => item._id === user._id)
    if (index !== -1) list.splice(index, 1)
    else list.pop()
    list.unshift(user)
  }
}

export const editUser = async ({ state }: any, params: EditRuleParams) => {
  const { userId, authority } = params
  const result = await http.reqEditRule({ userId, authority })
  if (result) {
    const { list } = state.userList
    const user = list.find((item: { _id: string }) => item._id === userId)
    if (user) {
      user.authority = authority
    }
  }
}
