import { http } from '@/api'
import { AddRoleParams, EditRoleParams } from '@/typings/interface/request'

const { reverse } = Array.prototype

export const getRoles = async ({ commit }: any) => {
  const roles = await http.reqRoles()
  if (roles) {
    commit('COMMIT', { key: 'roles', val: reverse.call(roles) })
  }
}

export const delRole = async ({ state }: any, roleId: string) => {
  const result = await http.reqDelRole(roleId)
  if (result) {
    const { roles } = state
    const index = roles.findIndex((role: { roleId: string }) => role.roleId === roleId)
    roles.splice(index, 1)
    return Promise.resolve()
  } else return Promise.reject('删除角色失败')
}

export const addRole = async ({ state }: any, params: AddRoleParams) => {
  const { roleName, creator, authority } = params
  const role = await http.reqAddRole({ roleName, creator, authority })
  if (role) {
    const { roles } = state
    roles.unshift(role)
  }
}

export const editRole = async ({ state }: any, params: EditRoleParams) => {
  const { roleId, roleName, editor, authority } = params
  const role = await http.reqEditRole({ roleId, roleName, editor, authority })
  if (role) {
    const { roles } = state
    const index = roles.findIndex((item: { roleId: string }) => item.roleId === roleId)
    roles.splice(index, 1, role)
  }
}
