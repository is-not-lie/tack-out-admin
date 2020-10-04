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

export const getUsers = async ({ commit }: any) => {
  const userList = await http.reqUsers()
  if (userList) commit('COMMIT', { key: 'userList', val: userList })
}

export const searchUser = async ({ state, commit }: any, phone: string) => {
  const user: any = await http.reqSeachUser(phone)
  if (user) {
    const { userList } = state
    const index = userList.findIndex((item: { _id: any }) => item._id === user._id)
    if (index !== -1) userList.splice(index, 1)
    else userList.pop()
    userList.unshift(user)
    commit('COMMIT', { key: 'userList', val: userList })
  }
}

export const editUser = async ({ state }: any, params: EditRuleParams) => {
  const { userId, roleId } = params
  const result = await http.reqEditRule({ userId, roleId })
  if (result) {
    const { userList, roles } = state
    const user = userList.find((item: { _id: string }) => item._id === userId)
    const role = roles.find((item: { roleId: string }) => item.roleId === roleId)
    if (user && role) {
      user.authority = role.authority
    }
  }
}
