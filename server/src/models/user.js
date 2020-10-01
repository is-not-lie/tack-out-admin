// 用户模块
const md5 = require('md5')
const mongoose = require('mongoose')
const { SERVER } = require('../config')

const avatar_url = `http://${SERVER.host}:${SERVER.port}/images/default.png`
const userSchema = new mongoose.Schema({
  userName: String,
  password: String,
  phone: { type: String, required: true, unique: true },
  avatar_url: { type: String, default: avatar_url },
  authority: { type: Number, default: 0 }, // 用户权限, 0为普通用户 1为商家 2为管理员 3为admin
  shipping_address: String,
  orderList: { type: Array, default: [] }
})

const userModel = mongoose.model('users', userSchema)

  ; (async () => {
    try {
      const user = await userModel.findOne({ userName: 'admin' })
      if (!user) {
        const admin = await userModel.create({
          userName: 'admin',
          password: md5('123456'),
          phone: '13333333333',
          authority: 3
        })
        admin && console.log(`初始化超级管理员账户成功,账号为:${admin.phone},密码:${123456}`)
      }
    } catch (err) {
      console.error(`初始化超级管理员用户失败,错误信息:${err}`)
    }
  })()

module.exports = userModel
