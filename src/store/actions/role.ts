import { Message } from 'element-ui'
import dayjs from 'dayjs'
import { http } from '@/api'
import { AddRoleData, EditRoleData } from '@/tsConfig/interface/roleInter'

export const getRoles = async ({ commit }, callback: (roles: any) => void) => {
  const roles: any = await http.reqRoles()
  if (roles) {
    callback(roles)
    commit('COMMIT', { key: 'roles', val: roles })
  }
}

export const addRole = async ({ state }, roleData: AddRoleData) => {
  const { roleName, callback, creator } = roleData
  const result = await http.reqAddRole({ roleName, creator })
  if (result) {
    state.roles.unshift(result)
    callback(state.roles)
  }
}

export const delRole = async ({ state, commit }, roleName: string) => {
  const result = await http.reqDelRole(roleName)
  if (result) {
    const { roles } = state
    roles.splice(roles.findIndex(role => role.roleName === roleName), 1)
    commit('COMMIT', { key: 'roles', val: roles })
    Message.success('删除角色成功')
  }
}

export const editRole = async ({ state, commit }, roleData: EditRoleData) => {
  const { roleName, editor, callback } = roleData
  const result: any = await http.reqEditRole({ roleName, editor })
  if (result) {
    const roles = state.roles.map(role => {
      if (role._id === result._id) role = result
      return role
    })
    commit('COMMIT', { key: 'roles', val: roles })
    callback(roles)
    Message.success('角色编辑成功')
  }
}
