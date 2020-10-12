// 商家模块
const mongoose = require('mongoose')
const { createMerchant } = require('../utils/create')

const merchantSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // 申请人 id
  proposer: { type: String, required: true, unique: true }, // 申请人名称
  brandName: { type: String, required: true, unique: true }, // 品牌名称
  brandImg: { type: String, required: true }, // 品牌形象
  phone: { type: String, required: true }, // 联系电话
  email: String, // 联系邮箱
  license: { type: String, required: true }, // 营业执照图片
  licence: { type: String, required: true }, // 餐饮许可证
  merchantId: { type: String, required: true, unique: true }, // id
  auditor: String, // 审核人名称
  applyTime: String, // 申请时间
  passTime: String, // 审核通过时间
  status: Number, // 审核状态
  desc: String // 审核驳回的说明
})

// 新增商家
merchantSchema.statics.add = function (params) {
  return new Promise((resolve, reject) => {
    this.create(createMerchant(params))
      .then(merchant => merchant && resolve(merchant))
      .catch(err => {
        console.error(`新增商家异常,错误信息${err}`)
        reject('当前网络繁忙,请稍后重新提交申请...')
      })
  })
}

// 获取商家列表
merchantSchema.statics.list = function () {
  return new Promise((resolve, reject) => {
    this.find({}, { _id: 0, __v: 0 })
      .then(merchants => {
        if (!merchants.length) reject('暂无商家信息')
        else resolve(merchants)
      })
      .catch(err => {
        console.error(`查询商家列表异常,错误信息${err}`)
        reject('获取商家列表失败...')
      })
  })
}

// 根据 id 获取商家信息
merchantSchema.statics.findId = function (merchantId) {
  return new Promise((resolve, reject) => {
    this.findOne({ merchantId }, { __v: 0, _id: 0 })
      .then(merchant => {
        if (!merchant) reject('找不到该商家用户')
        else resolve(merchant)
      })
      .catch(err => {
        console.error(`根据ID查找商家异常,错误信息${err}`)
        reject('抱歉,服务器忙不过来了...')
      })
  })
}

// 更新商家状态
merchantSchema.statics.setStatus = function (merchantId, updateData) {
  return new Promise((resolve, reject) => {
    this.findOneAndUpdate({ merchantId }, { $set: updateData }, { useFindAndModify: false })
      .then((merchant) => resolve(merchant))
      .catch(err => {
        console.error(`更新商家审核状态异常,错误信息${err}`)
        reject('服务器繁忙,审核提交失败...')
      })
  })
}

// 根据品牌名称搜索商家
merchantSchema.statics.searchName = function (brandName) {
  return new Promise((resolve, reject) => {
    this.findOne({ brandName }, { __v: 0, _id: 0 })
      .then(resolve)
      .catch(err => {
        console.error(`根据名称搜索商家异常,错误信息${err}`)
        reject('服务器繁忙,暂时无法提供搜索服务...')
      })
  })
}

// 根据手机号码搜索商家
merchantSchema.statics.searchPhone = function (phone) {
  return new Promise((resolve, reject) => {
    this.findOne({ phone }, { __v: 0, _id: 0 })
      .then(resolve)
      .catch(err => {
        console.error(`根据手机号码搜索商家异常,错误信息${err}`)
        reject('服务器繁忙,暂时无法提供搜索服务...')
      })
  })
}

// 根据审核状态搜索商家
merchantSchema.statics.searchStatus = function (params) {
  return new Promise((resolve, reject) => {
    const { status, lte, not } = params
    const result = lte === false
      ? this.find({ status }, { __v: 0, _id: 0 })
      : (
        not === false
          ? this.find({ status: { $lte: status } }, { __v: 0, _id: 0 })
          : this.find({ $and: [{ status: { $lte: status } }, { status: { $ne: not } }] })
      )
    result
      .then(resolve)
      .catch(err => {
        console.error(`根据审核状态搜索商家异常,错误信息${err}`)
        reject('服务器繁忙,暂时无法提供搜索服务...')
      })
  })
}

module.exports = mongoose.model('merchants', merchantSchema)
