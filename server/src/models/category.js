// 分类模块
const mongoose = require('mongoose')
const { SERVER } = require('../config')

const iconDefault = `http://${SERVER.host}:${SERVER.port}/images/default_icon.png`
const cateSchema = new mongoose.Schema({
  cateName: { type: String, required: true, unique: true },
  subList: { type: Array, default: [] },
  icon: { type: String, default: iconDefault }
})

module.exports = mongoose.model('categorys', cateSchema)
