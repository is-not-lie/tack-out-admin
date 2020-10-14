const { v1 } = require('uuid')
const md5 = require('md5')
const dayjs = require('dayjs')
const { SERVER } = require('../config')
const { mapImg } = require('./map')

const defaultAvatar = `http://${SERVER.host}:${SERVER.port}/images/default.png`
const defaultCateIcon = `http://${SERVER.host}:${SERVER.port}/images/default_cate_icon.png`

// 创建用户
const createUser = (user) => ({
  phone: user.phone, // 手机号
  userName: user.userName || user.phone, // 用户名
  password: user.password ? md5(user.password) : '', // 密码
  email: user.email || '', // 邮箱
  avatar: user.avatar || defaultAvatar, // 头像
  userId: v1().replace(/-/g, ''), // id
  rank: 0, // 权限级别
  shippingAddress: [], // 初始化收货地址
  createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'), // 创建时间
  editTime: dayjs().format('YYYY-MM-DD HH:mm:ss'), // 信息更改时间
  status: 1 // 用户状态, 1为正常启用 2为禁用
})

// 创建分类
const createCategory = (params) => ({
  cateId: v1().replace(/-/g, ''), // 分类 id
  createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'), // 创建时间
  editTime: dayjs().format('YYYY-MM-DD HH:mm:ss'), // 编辑时间
  icon: params.icon ? mapImg(params.icon) : defaultCateIcon, // 分类图片
  desc: params.desc || '', // 描述
  creator: params.userName, // 创建人
  editor: params.userName, // 编辑人
  cateName: params.cateName // 分类名称
})

// 创建商家
const createMerchant = (params) => ({
  userId: params.userId, // 申请人 id
  proposer: params.userName, // 申请人名称
  brandName: params.brandName, // 品牌名称
  brandImg: mapImg(params.brandImg), // 品牌形象
  phone: params.phone, // 联系电话
  email: params.email || '', // 联系邮箱
  license: mapImg(params.license), // 营业执照图片
  licence: mapImg(params.licence), // 餐饮许可证
  merchantId: v1().replace(/-/g, ''), // id
  applyTime: dayjs().format('YYYY-MM-DD HH:mm:ss'), // 申请时间
  auditor: '', // 审核人名称
  passTime: '', // 审核通过时间
  status: 0 // 审核状态
})

// 创建商品
const createGoods = (goods) => ({
  goodsId: v1().replace(/-/g, ''), // 商品id
  imgUrlBig: mapImg(goods.goodsImg), // 商品大图片
  imgUrlSmall: mapImg(goods.goodsImgSmall), // 商品小图片
  goodsName: goods.goodsName, // 商品名称 (必须)
  originalPrice: goods.originalPice, // 商品原价格 (必须)
  discount: 10, // 折扣
  desc: goods.desc || '', // 商品描述
  specification: goods.specification, // 商品规格 (必须)
  monthlySales: 0, // 月售量
  like: 0, // 点赞量
  activity: [], // 活动标签列表
  status: 0, // 商品状态, 0: 停售, 1: 在售
  count: goods.count || 0 // 当前商品库存数量
})

// 创建店铺
const createShop = () => { }

module.exports = { createUser, createCategory, createMerchant, createGoods, createShop }
