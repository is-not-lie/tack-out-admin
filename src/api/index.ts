import axios from './http'
import { loginData } from '@/tsConfig/interface/storeInterface'
import { AddRoleData, EditRoleData } from '@/tsConfig/interface/roleInter'

export const http = {
  reqLogin: (userData: loginData) => axios.post('/login', userData),
  reqSendCode: (phone: string) => axios.get('/sendcode', { params: { phone } }),
  reqCaptcha: () => axios.get('/captcha'),
  reqGlobalImgs: () => axios.get('/global_imgs'),
  reqRoles: () => axios.get('/roles'),
  reqAddRole: (roleData: AddRoleData) => axios.post('/roles/add', roleData),
  reqDelRole: (roleName: string) => axios.post('/roles/del', { roleName }),
  reqEditRole: (roleData: EditRoleData) => axios.post('/roles/edit', roleData)
}
