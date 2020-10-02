import axios from './http'
import {
  LoginParams,
  SigninParams,
  UserEditParams,
  AddRoleParams,
  EditRoleParams,
  EditRuleParams,
  AddShopParams,
  EditShopParams,
  AddOrderParams,
  DelOrderParams,
  EditOrderParams,
  GoodsInfoParams,
  AddGoodsParams,
  EditGoodsParams,
  DelGoodsParams,
  AddGoodsCateParams,
  EditGoodsCateParams,
  DelGoodsCateParams,
  AddCommentCateParams,
  EditCommentCateParams,
  DelCommentCateParams,
  CommentInfoParams,
  AddCommentParams,
  EditCommentParams,
  AddCateParams,
  EditCateParams,
  AddSubCateParams,
  EditSubCateParams,
  DelSubCateParams,
  CountyParams
} from '@/typings/interface/request'

export const http = {
  // 请求登录
  reqLogin: (reqParams: LoginParams) => axios.post('/user/login', reqParams),
  // 用户注册
  reqSignin: (reqParams: SigninParams) => axios.post('/user/singin', reqParams),
  // 请求一次性svg验证码
  reqCaptcha: () => axios.get('/captcha'),
  // 请求发送短信验证码
  reqSendCode: (phone: string) => axios.get('/sendcode', { params: { phone } }),
  // 请求修改用户信息
  reqEditUser: (reqParams: UserEditParams) => axios.post('/user/edit', reqParams),
  // 请求新增角色
  reqAddRole: (reqParams: AddRoleParams) => axios.post('/roles/add', reqParams),
  // 请求删除角色
  reqDelRole: (roleId: string) => axios.post('/roles/del', { roleId }),
  // 请求更新角色信息
  reqEditRole: (reqParams: EditRoleParams) => axios.post('/roles/edit', reqParams),
  // 请求角色列表
  reqRoles: () => axios.get('/roles'),
  // 请求用户列表
  reqUsers: () => axios.get('/user/list'),
  // 请求搜索用户
  reqSeachUser: (phone: string) => axios.get('/user/seach', { params: { phone } }),
  // 请求设置用户权限等级
  reqEditRule: (reqParams: EditRuleParams) => axios.post('/user/rule/edit', reqParams),
  // 请求商家列表
  reqShops: () => axios.get('/shop/list'),
  // 请求指定商家信息
  reqShop: (_id: string) => axios.get('/shop', { params: { _id } }),
  // 请求新增商家
  reqAddShop: (reqParams: AddShopParams) => axios.post('/shop/add', reqParams),
  // 请求修改商家信息
  reqEditShop: (reqParams: EditShopParams) => axios.post('/shop/edit', reqParams),
  // 请求注销商家
  reqDelShop: (_id: string) => axios.post('/shop/del', { _id }),
  // 请求用户订单列表
  reqUserOrders: (userId: string) => axios.get('/user/order/list', { params: { userId } }),
  // 请求新增订单
  reqAddOrder: (reqParams: AddOrderParams) => axios.post('/user/order/add', reqParams),
  // 请求删除订单
  reqDelOrder: (reqParams: DelOrderParams) => axios.post('/user/order/del', reqParams),
  // 请求修改订单状态
  reqEditOrder: (reqParams: EditOrderParams) => axios.post('/user/order/edit', reqParams),
  // 请求指定商品信息
  reqGoods: (reqParams: GoodsInfoParams) => axios.get('/shop/goods', { params: reqParams }),
  // 请求商家商品列表
  reqGoodsList: (shopId: string) => axios.get('/shop/goods/list', { params: { shopId } }),
  // 请求新增商品
  reqAddGoods: (reqParams: AddGoodsParams) => axios.post('/shop/goods/add', reqParams),
  // 请求修改商品信息
  reqEditGoods: (reqParams: EditGoodsParams) => axios.post('/shop/goods/edit', reqParams),
  // 请求删除商品
  reqDelGoods: (reqParams: DelGoodsParams) => axios.post('/shop/goods/del', reqParams),
  // 请求商家商品分类列表
  reqGoodsCates: (shopId: string) => axios.get('/shop/cate/list', { params: { shopId } }),
  // 请求新增商品分类
  reqAddGoodsCate: (reqParams: AddGoodsCateParams) => axios.post('/shop/cate/add', reqParams),
  // 请求编辑商品分类
  reqEditGoodsCate: (reqParams: EditGoodsCateParams) => axios.post('/shop/cate/edit', reqParams),
  // 请求删除商品分类
  reqDelGoodsCate: (reqParams: DelGoodsCateParams) => axios.post('/shop/cate/del', reqParams),
  // 请求商家商品标签列表
  reqGoodsLabels: (shopId: string) => axios.get('/shop/comment/labels', { params: { shopId } }),
  // 请求评论类型标签列表
  reqCommentTypes: (shopId: string) => axios.get('/shop/comment/types', { params: { shopId } }),
  // 请求新增评论类型标签
  reqAddCommentTypes: (reqParams: AddCommentCateParams) => axios.post('/shop/comment/type/add', reqParams),
  // 请求编辑评论类型标签
  reqEditCommentTypes: (reqParams: EditCommentCateParams) => axios.post('/shop/comment/type/edit', reqParams),
  // 请求删除评论类型标签
  reqDelCommentTypes: (reqParams: DelCommentCateParams) => axios.post('/shop/comment/type/del', reqParams),
  // 请求评论详细信息
  reqCommentInfo: (reqParams: CommentInfoParams) => axios.get('/shop/comment/info', { params: reqParams }),
  // 请求评论列表
  reqComments: (shopId: string) => axios.get('/shop/comment/list', { params: { shopId } }),
  // 请求新增评论
  reqAddComment: (reqParams: AddCommentParams) => axios.post('/shop/comment/add', reqParams),
  // 请求修改评论
  reqEditComment: (reqParams: EditCommentParams) => axios.post('/shop/comment/edit', reqParams),
  // 请求主分类列表
  reqCates: () => axios.get('/cates'),
  // 请求新增主分类
  reqAddCate: (reqParams: AddCateParams) => axios.post('/cate/add', reqParams),
  // 请求编辑主分类
  reqEditCate: (reqParams: EditCateParams) => axios.post('/cate/edit', reqParams),
  // 请求删除主分类
  reqDelCate: (_id: string) => axios.post('/cate/del', { _id }),
  // 请求子分类列表
  reqSubCates: (_id: string) => axios.get('/cate/sub/list', { params: { _id } }),
  // 请求新增子分类
  reqAddSubCate: (reqParams: AddSubCateParams) => axios.post('/cate/sub/add', reqParams),
  // 请求编辑子分类
  reqEditSubCate: (reqParams: EditSubCateParams) => axios.post('/cate/sub/edit', reqParams),
  // 请求删除子分类
  reqDelSubCate: (reqParams: DelSubCateParams) => axios.post('/cate/sub/del', reqParams),
  // 请求省级城市信息
  reqProvince: () => axios.get('/citys'),
  // 请求市级城市信息
  reqCitys: (province: string) => axios.get('/citys/city', { params: { province } }),
  // 请求区县城市信息
  reqCounty: (reqParams: CountyParams) => axios.get('/citys/county', { params: reqParams }),
  // 请求删除图片
  reqDelFile: (filename: string) => axios.post('/img/del', { filename })
}
