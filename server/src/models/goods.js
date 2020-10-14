// 商品模块
const mongoose = require('mongoose')
const { createGoods } = require('../utils/create')

const goodsSchema = new mongoose.Schema({
  merchantId: { type: String, required: true, unique: true }, // 商家 id
  goodsList: { type: Array, default: [] }, // 商品列表,
  tables: { type: Array, default: [] }
})

goodsSchema.statics.initGoodsList = function (merchantId) {
  return new Promise((resolve, reject) => {
    this.create({ merchantId })
      .then(() => resolve())
      .catch(err => {
        console.error(`初始化商家商品列表异常,错误信息${err}`)
        reject('初始化商品列表失败...')
      })
  })
}

goodsSchema.statics.findMerchant = function (merchantId) {
  return new Promise((resolve, reject) => {
    this.findOne({ merchantId })
      .then(resolve)
      .catch(err => {
        console.error(`查找商家商品列表异常,错误信息${err}`)
        reject('抱歉,没有找到该商家')
      })
  })
}

goodsSchema.statics.addGoods = function (params) {
  const { merchantId } = params
  return new Promise((resolve, reject) => {
    this.findMerchant(merchantId)
      .then((merchant) => {
        if (merchant) {
          const { goodsList, tables } = merchant._doc
          const goods = createGoods(params)
          const { goodsId, goodsName } = goods
          tables.push({ goodsId, goodsName })
          goodsList.push(goods)
          return this.updateMerchant(merchant)
        } else reject('抱歉,没有找到该商家')
      })
      .then(resolve)
      .catch(err => {
        console.error(`新增商品异常,错误信息${err}`)
        reject('新增商品失败')
      })
  })
}

goodsSchema.statics.updateMerchant = function (merchant) {
  return new Promise((resolve, reject) => {
    const { merchantId } = merchant._doc
    this.findOneAndUpdate({ merchantId }, merchant, { useFindAndModify: false })
      .then(() => resolve(merchant))
      .catch(err => {
        console.error(`更新商家信息异常, 错误信息${err}`)
        reject('抱歉,更新信息时服务器崩溃了...')
      })
  })
}

module.exports = mongoose.model('goods', goodsSchema)
