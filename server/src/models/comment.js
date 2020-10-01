// 商家评论模块
const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  shopId: { type: String, required: true, unique: true },
  commentList: { type: Array, default: [] },
  typs: { type: Array, default: [] },
  labels: { type: Array, default: [] }
})

module.exports = mongoose.model('comments', commentSchema)
