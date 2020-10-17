import axios from './http'
import { PAGESIZE } from '@/config'

export const http = {
  // 请求登录
  reqLogin: (reqParams) => axios.post('/login', reqParams),
  // 请求一次性svg验证码
  reqCaptcha: () => axios.get('/captcha'),
  // 请求发送短信验证码
  reqSendCode: (phone) => axios.get('/sendcode', { params: { phone } }),
  // 请求修改用户信息
  reqEditUser: (reqParams) => axios.post('/user/edit', reqParams),
  // 请求用户列表
  reqUsers: (pageNum) => axios.get('/user/list', { params: { pageNum, pageSize: PAGESIZE } }),
  // 请求手机号搜索用户
  reqSeachUser: (phone) => axios.get('/user/search', { params: { phone } }),
  // 请求删除用户
  reqDelUser: (userId) => axios.post('/user/del', { userId }),
  // 请求删除图片
  reqRemoveImg: (filename) => axios.post('/img/del', { filename }),
  // 请求新增分类
  reqAddCate: (params) => axios.post('/cate/add', params),
  // 请求分类列表
  reqCateList: () => axios.get('/cate/list'),
  // 请求删除分类
  reqDelCate: (cateId) => axios.post('/cate/del', { cateId }),
  // 请求商家注册
  reqShopSignin: (params) => axios.post('/shop/signin', params),
  // 查询用户是否已提交商家注册
  verifyIsRegistered: (userId) => axios.get('/shop/verify', { params: { userId } }),
  // 请求商家列表
  reqMerchantList: (pageNum) => axios.get('/shop/list', { params: { pageNum, pageSize: PAGESIZE } }),
  // 请求更改商家审核状态
  reqSetAudit: (params) => axios.post('/shop/audit', params),
  // 请求指定商家
  reqMerchant: (merchantId) => axios.get('/shop/find', { params: { merchantId } }),
  // 搜索商家
  reqSearchMerchant: (params) => axios.get('/shop/search', { params }),
  // 根据状态过滤商家列表
  reqSearchStatus: (params) => axios.get('/shop/search/status', { params: { ...params, pageSize: PAGESIZE } }),
  // 请求新增商品
  reqGoodsAdd: (params) => axios.post('/shop/goods/add', params),
  // 请求商品列表
  reqGoodsList: (merchantId) => axios.get('/shop/goods/list', { params: { merchantId } }),
  // 请求修改商品信息
  reqGoodsEdit: (params) => axios.post('/shop/goods/edit', params),
  // 请求删除商品
  reqRemoveGoods: (params) => axios.post('/shop/goods/del', params),
  // 请求商家店铺列表
  reqShopList: (merchantId) => axios.get('/shop/list', { params: { merchantId } })
}
