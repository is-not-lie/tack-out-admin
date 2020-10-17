// 商家模块
const mongoose = require('mongoose')
const { createShop } = require('../utils/create')

const shopSchema = new mongoose.Schema({
  merchantId: { type: String, required: true },
  shopId: { type: String, required: true, unique: true },
  shopCate: { type: String, required: true, unique: true },
  shopName: { type: String, required: true, unique: true },
  goodsList: { type: Array, required: true },
  location: { type: Object, required: true },
  address: { type: String, required: true },
  openingHours: { type: Array, required: true },
  serTime: { type: Array, required: true },
  subCate: { type: Array, required: true },
  minFee: { type: Number, required: true },
  phone: { type: Array, required: true },
  disPic: Number,
  activity: Array,
  announcement: String,
  isSpe: Boolean,
  isBrand: Boolean,
  createTime: String,
  turnover: Number,
  shopStatus: Number,
  auditStatus: Number,
  score: Number
})

shopSchema.statics.addShop = function (params) {
  return new Promise((resolve, reject) => {
    const shop = createShop(params)
    this.create(shop)
      .then(resolve)
      .catch(err => {
        console.error(`新增店铺异常,错误信息:${err}`)
        reject('新增店铺失败,服务器崩溃了...')
      })
  })
}

shopSchema.statics.findList = function (merchantId) {
  return new Promise((resolve, reject) => {
    this.find({ merchantId })
      .then(resolve)
      .catch(err => {
        console.error(`查找商家店铺列表异常, 错误信息${err}`)
        reject('抱歉,服务器奔溃了,没有找到您的店铺...')
      })
  })
}

module.exports = mongoose.model('shops', shopSchema)
