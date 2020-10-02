// 登录接口参数
export interface LoginParams {
  phone: string;
  password?: string;
}
// 注册接口参数
export interface SigninParams {
  phone: string;
  userName?: string;
  password?: string;
  avatar_url?: string;
  shipping_address?: string;
}
// 修改用户信息接口参数
export interface UserEditParams {
  phone: string;
  _id: string;
  userName?: string;
  password?: string;
  avatar_url?: string;
  shipping_address?: string;
}
// 添加角色接口参数
export interface AddRoleParams {
  roleName: string;
  creator: string;
  authority?: number;
}

// 更新角色接口参数
export interface EditRoleParams {
  roleId: string;
  roleName: string;
  editor: string;
  authority?: number;
}

// 设置权限等级接口参数
export interface EditRuleParams {
  userId: string;
  roleId: string;
}

// 新增商家接口参数
export interface AddShopParams {
  shopName: string;
  shopLocation: Object;
  shopAddress: string;
  openingHours: string;
  serTime: string | Array<string>;
  minFee: number;
  shopCate: Array<object> | Object;
  contact_way: Array<string> | string;
  shopImg?: string;
  disPic?: number;
  activity?: Array<string|object>;
  announcement?: string;
}
// 编辑商家接口参数
export interface EditShopParams {
  _id: string;
  shopName: string;
  shopLocation: Object;
  shopAddress: string;
  openingHours: string;
  serTime: string | Array<string>;
  minFee: number;
  shopCate: Array<object> | Object;
  contact_way: Array<string> | string;
  shopImg?: string;
  disPic?: number;
  activity?: Array<string | object>;
  announcement?: string;
  score?: number;
  isBrand?: boolean;
  isSpe?: boolean;
  shopStatus?: number;
  monthly_sales?: number;
  auditStatus?: number;
}
// 新增订单接口参数
interface GoodsObj {
  goodsId: string;
  name: number;
  count: number;
}
interface OrderObj {
  shopId: string;
  goods: GoodsObj[];
  price: number;
}
export interface AddOrderParams {
  userId: string;
  order: OrderObj;
}
// 删除订单接口参数
export interface DelOrderParams {
  userId: string;
  orderId: string;
}
// 修改订单状态接口参数
export interface EditOrderParams {
  userId: string;
  orderId: string;
  status: number;
}
// 获取指定商品信息接口参数
export interface GoodsInfoParams {
  shopId: string;
  goodsId: string;
}

// 新增商品接口参数
interface AddGoodsObj {
  cateId: string;
  name: string;
  originalPice: number;
  deal: string;
  ImgUrlBig?: string;
  ImgUrlSmall?: string;
  desc?: string;
  discount?: number;
  count?: number;
  tags?: string | string[];
}
export interface AddGoodsParams {
  shopId: string;
  goods: AddGoodsObj;
}
// 编辑商品接口参数
interface EditGoodsObj{
  goodsId: string;
  cateId: string;
  name: string;
  originalPice: number;
  deal: string;
  ImgUrlBig?: string;
  ImgUrlSmall?: string;
  desc?: string;
  discount?: number;
  count?: number;
  tags?: string | string[];
  monthlySales?: number;
  like?: number;
  status?: number;
}
export interface EditGoodsParams {
  shopId: string;
  goods: EditGoodsObj;
}
// 删除商品接口参数
export interface DelGoodsParams {
  shopId: string;
  goodsId: string;
}
// 新增商品分类接口参数
export interface AddGoodsCateParams {
  shopId: string;
  cateName: string;
  icon?: string;
}
// 编辑分类接口参数
export interface EditGoodsCateParams extends AddGoodsCateParams {
}
// 删除分类接口参数
export interface DelGoodsCateParams {
  shopId: string;
  cateId: string;
}

// 新增评论类型标签接口参数
export interface AddCommentCateParams {
  shopId: string;
  typeName: string;
}
// 编辑评论类型接口参数
export interface EditCommentCateParams {
  shopId: string;
  typeName: string;
  typeId: string;
  count?: number;
}
// 删除评论类型标签接口参数
export interface DelCommentCateParams {
  shopId: string;
  typeId: string;
}
// 获取评论信息接口参数
export interface CommentInfoParams {
  shopId: string;
  commentId: string;
}

// 新增评论接口参数
interface AddCommentObj {
  userId: string;
  content: string;
  typeId: string;
  arrive_time: string;
  goods_img?: string | string[]
  labels?: string | string[]
}
export interface AddCommentParams {
  shopId: string;
  comment: AddCommentObj;
}
// 编辑评论接口参数
export interface EditCommentParams {
  shopId: string;
  commentId: string;
  shop_reply: string;
}
// 新增主分类接口参数
export interface AddCateParams {
  cateName: string;
  icon?: string;
}
// 编辑主分类接口参数
export interface EditCateParams extends AddCateParams {
  _id: string;
}

// 新增子分类接口参数
export interface AddSubCateParams {
  _id: string;
  subName: string;
}
// 编辑子分类接口参数
export interface EditSubCateParams {
  _id: string;
  subId: string;
  subName: string;
}
// 删除子分类接口参数
export interface DelSubCateParams {
  _id: string;
  subId: string;
}

// 获取区县信息接口参数
export interface CountyParams {
  province: string;
  city: string;
}