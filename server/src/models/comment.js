// 商家评论模块
const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  merchantId: { type: String, required: true, unique: true },
  commentList: { type: Array, default: [] },
  commentTypes: { type: Array, default: [] }
})

commentSchema.statics.initCommentList = function (merchantId) {
  return new Promise((resolve, reject) => {
    this.create({ merchantId })
      .then(resolve)
      .catch(err => {
        console.error(`初始化商家评论列表异常,错误信息${err}`)
        reject('初始化评论列表失败...')
      })
  })
}

module.exports = mongoose.model('comments', commentSchema)
