// 商品模块
const mongoose = require('mongoose')

const goodsSchema = new mongoose.Schema({
  merchantId: { type: String, required: true, unique: true }, // 商家 id
  goodsList: { type: Array, default: [] } // 商品列表
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

module.exports = mongoose.model('goods', goodsSchema)
