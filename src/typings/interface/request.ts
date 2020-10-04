import { AxiosResponse } from 'axios'
// 登录接口参数
export interface LoginParams {
  phone: string;
  password?: string;
  callback?: (params?: AxiosResponse) => void;
}
// 注册接口参数
export interface SigninParams {
  phone: string;
  userName?: string;
  password?: string;
  avatar_url?: string;
  shipping_address?: string;
  callback?: (params?: AxiosResponse) => void;
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

// 设置权限等级接口参数
export interface EditRuleParams {
  userId: string;
  authority: number;
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
  callback?: (params?: AxiosResponse) => void;
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
  callback?: (params?: AxiosResponse) => void;
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
  callback?: (params?: AxiosResponse) => void;
}
// 删除订单接口参数
export interface DelOrderParams {
  userId: string;
  orderId: string;
  callback?: (params?: AxiosResponse) => void;
}
// 修改订单状态接口参数
export interface EditOrderParams {
  userId: string;
  orderId: string;
  status: number;
  callback?: (params?: AxiosResponse) => void;
}
// 获取指定商品信息接口参数
export interface GoodsInfoParams {
  shopId: string;
  goodsId: string;
  callback?: (params?: AxiosResponse) => void;
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
  callback?: (params?: AxiosResponse) => void;
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
  callback?: (params?: AxiosResponse) => void;
}
// 删除商品接口参数
export interface DelGoodsParams {
  shopId: string;
  goodsId: string;
  callback?: (params?: AxiosResponse) => void;
}
// 新增商品分类接口参数
export interface AddGoodsCateParams {
  shopId: string;
  cateName: string;
  icon?: string;
  callback?: (params?: AxiosResponse) => void;
}
// 编辑分类接口参数
export interface EditGoodsCateParams extends AddGoodsCateParams {
}
// 删除分类接口参数
export interface DelGoodsCateParams {
  shopId: string;
  cateId: string;
  callback?: (params?: AxiosResponse) => void;
}

// 新增评论类型标签接口参数
export interface AddCommentCateParams {
  shopId: string;
  typeName: string;
  callback?: (params?: AxiosResponse) => void;
}
// 编辑评论类型接口参数
export interface EditCommentCateParams {
  shopId: string;
  typeName: string;
  typeId: string;
  count?: number;
  callback?: (params?: AxiosResponse) => void;
}
// 删除评论类型标签接口参数
export interface DelCommentCateParams {
  shopId: string;
  typeId: string;
  callback?: (params?: AxiosResponse) => void;
}
// 获取评论信息接口参数
export interface CommentInfoParams {
  shopId: string;
  commentId: string;
  callback?: (params?: AxiosResponse) => void;
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
  callback?: (params?: AxiosResponse) => void;
}
// 编辑评论接口参数
export interface EditCommentParams {
  shopId: string;
  commentId: string;
  shop_reply: string;
  callback?: (params?: AxiosResponse) => void;
}
// 新增主分类接口参数
export interface AddCateParams {
  cateName: string;
  icon?: string;
  callback?: (params?: AxiosResponse) => void;
}
// 编辑主分类接口参数
export interface EditCateParams extends AddCateParams {
  _id: string;
}

// 新增子分类接口参数
export interface AddSubCateParams {
  _id: string;
  subName: string;
  callback?: (params?: AxiosResponse) => void;
}
// 编辑子分类接口参数
export interface EditSubCateParams {
  _id: string;
  subId: string;
  subName: string;
  callback?: (params?: AxiosResponse) => void;
}
// 删除子分类接口参数
export interface DelSubCateParams {
  _id: string;
  subId: string;
  callback?: (params?: AxiosResponse) => void;
}

// 获取区县信息接口参数
export interface CountyParams {
  province: string;
  city: string;
  callback?: (params?: AxiosResponse) => void;
}
