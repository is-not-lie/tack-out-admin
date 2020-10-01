// 商家模块
const mongoose = require('mongoose')

const shopSchema = new mongoose.Schema({
  shopName: { type: String, required: true, unique: true }, // 商家名称
  shopLocation: { type: Object, required: true }, // 商家地理位置坐标
  shopAddress: { type: String, required: true }, // 商家地址
  openingHours: { type: String, required: true }, // 商家营业时间
  serTime: { type: Array || String, required: true }, // 商家配送时间段
  shopCate: { type: Array || Object, required: true }, // 商家所属分类列表
  minFee: { type: Number, required: true }, // 起送价
  contact_way: { type: Array || String, required: true }, // 商家的联系方式
  shopImg: String, // 商家图片
  disPic: Number, // 配送价
  activity: Array || Object, // 商家活动列表
  announcement: String, // 商家公告
  isSpe: { type: Boolean, default: false }, // 是否由美团专送
  monthly_sales: { type: Number, default: 0 }, // 月销量
  shopStatus: { type: Number, default: 0 }, // 商家状态, 0为休息, 1为营业
  auditStatus: { type: Number, default: 0 }, // 商家审核状态, 0为审核中 1为通过审核
  isBrand: { type: Boolean, default: false }, // 是否为品牌用户
  score: { type: Number, default: 0 } // 商家评分星级
})

module.exports = mongoose.model('shops', shopSchema)
