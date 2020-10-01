// 商品模块
const mongoose = require('mongoose')

const goodsSchema = new mongoose.Schema({
  shopId: { type: String, required: true, unique: true },
  goodsList: { type: Array, default: [] },
  cates: { type: Array, default: [] }
})

module.exports = mongoose.model('goods', goodsSchema)
