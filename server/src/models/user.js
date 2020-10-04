// 用户模块
const md5 = require('md5')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  userName: String,
  password: String,
  signinTime: String,
  shopId: String,
  auditStatus: Number, // 审核状态
  phone: { type: String, required: true, unique: true },
  avatar_url: String,
  authority: { type: Number, default: 0 }, // 用户权限, 0为普通用户 1为商家 2为管理员 3为admin
  shipping_address: Array
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
