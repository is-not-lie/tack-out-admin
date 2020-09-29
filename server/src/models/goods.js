// 商品模块
const mongoose = require('mongoose')

const goodsSchema = new mongoose.Schema({
  shopId: { type: String, required: true, unique: true },
  goodsList: { type: String, required: true },
  goodsStatus: { type: Number, default: 0 }, // 商品状态, 0为停售, 1为在售
  goodsCates: { type: Array, required: true }
})

module.exports = mongoose.model('goods', goodsSchema)
