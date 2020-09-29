// 订单模块
const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  orderList: { type: Array, default: [] }
})

module.exports = mongoose.model('orders', orderSchema)
