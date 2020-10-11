// 商家模块
const mongoose = require('mongoose')

const shopSchema = new mongoose.Schema({
  merchantId: { type: String, required: true, unique: true }, // 店铺所属商家 id
  shopId: { type: String, required: true, unique: true }, // 店铺 id
  cateId: { type: String, required: true, unique: true }, // 店铺所属分类 id
  shopName: { type: String, required: true, unique: true }, // 店铺名称
  shopLocation: { type: Object, required: true }, // 店铺地理位置坐标
  shopAddress: { type: String, required: true }, // 店铺地址
  openingHours: { type: String, required: true }, // 店铺营业时间
  serTime: { type: Array || String, required: true }, // 店铺配送时间段
  shopCate: { type: Array || Object, required: true }, // 店铺所属分类列表
  minFee: { type: Number, required: true }, // 起送价
  contact_way: { type: Array || String, required: true }, // 店铺的联系方式
  disPic: Number, // 配送价
  activity: Array, // 店铺活动列表
  announcement: String, // 店铺公告
  isSpe: { type: Boolean, default: false }, // 是否由美团专送
  monthly_sales: { type: Number, default: 0 }, // 月销量
  shopStatus: { type: Number, default: 0 }, // 店铺状态, 0为休息, 1为营业
  auditStatus: { type: Number, default: 0 }, // 店铺审核状态, 0为审核中 1为通过审核
  isBrand: { type: Boolean, default: Math.random() * 10 >= 5 }, // 是否为品牌用户 (随机吧..)
  score: { type: Number, default: 0 } // 商家评分星级
})

module.exports = mongoose.model('shops', shopSchema)
