// 商家模块
const mongoose = require('mongoose')
const { SERVER } = require('../config')

const shopDefaultImg = `${SERVER.host}:${SERVER.port}/images/default_shop.png`
const defaultShopDesc = '该商家很懒,暂无描述信息...'
const shopSchema = new mongoose.Schema({
  shopName: { type: String, required: true, unique: true }, // 商家名称
  shopImg: { type: String, default: shopDefaultImg }, // 商家图片
  shopLocation: { type: Object, required: true }, // 商家地理位置坐标
  monthly_sales: { type: Number, default: 0 }, // 月销量
  shopStatus: { type: Number, default: 0 }, // 商家状态, 0为休息, 1为营业
  openingHours: { type: String, required: true }, // 商家营业时间
  shopCate: { type: Array, default: [] }, // 商家所属分类列表
  minFee: { type: Number, required: true }, // 起送价
  disPic: { type: Number, default: 0 }, // 配送价
  isSpe: { type: Boolean, default: false }, // 是否由美团专送
  activity: { type: Array, default: [] }, // 商家活动列表
  shopDesc: { type: String, default: defaultShopDesc }, // 商家描述
  announcement: String, // 商家公告
  contact_way: { type: Array || String, required: true },
  isBrand: { type: Boolean, default: false }, // 是否为品牌用户
  score: { type: Number, default: 0 } // 商家评分星级
})

module.exports = mongoose.model('shops', shopSchema)
