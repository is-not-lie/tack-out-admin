import { http } from '@/api'
import { login } from './user'
import { getRoles, addRole, delRole, editRole } from './role'

const getGlobalImgs = async ({ commit }): Promise<void> => {
  const result = await http.reqGlobalImgs()
  if (result && Array.isArray(result)) {
    const globalImgs = {}
    result.forEach(item => { globalImgs[item.name] = item.imgs })
    commit('COMMIT', { key: 'globalImgs', val: globalImgs })
  }
}

export default { login, getGlobalImgs, getRoles, addRole, delRole, editRole }
