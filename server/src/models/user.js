const mongoose = require('mongoose')
const { createUser } = require('../utils/create')
const pageFile = require('../utils/pageFile')

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  userName: String,
  password: String,
  email: String,
  avatar: String,
  userId: { type: String, required: true, unique: true },
  rank: Number,
  createTime: String,
  editTime: String,
  shippingAddress: Array,
  merchantId: String,
  status: Number,
  editDesc: String
})

// 根据手机号搜索用户
userSchema.statics.search = function (phone) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await this.findOne({ phone }, { __v: 0, password: 0, _id: 0 })
      if (user) resolve(user)
      else reject('该用户不存在')
    } catch (err) {
      console.log(`搜索用户异常,错误信息${err}`)
      reject('该用户不存在')
    }
  })
}

// 根据用户 id 搜索用户
userSchema.statics.searchId = function (userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await this.findOne({ userId }, { __v: 0, password: 0, _id: 0 })
      if (user) resolve(user)
      else reject('该用户尚未注册')
    } catch (err) {
      console.log(`搜索用户异常,错误信息${err}`)
      reject('该用户尚未注册')
    }
  })
}

// 更新用户信息
userSchema.statics.update = function (userId, user) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await this.findOneAndUpdate({ userId }, user, { useFindAndModify: false })
      if (result) resolve()
      else reject('编辑资料失败')
    } catch (err) {
      console.error(`更新用户信息异常,错误信息${err}`)
      reject('编辑资料失败')
    }
  })
}

// 获取用户列表
userSchema.statics.userList = function (pageNum, pageSize) {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await this.find({ rank: { $ne: 3 } }, { password: 0, __v: 0, _id: 0 })
      if (users && users.length) resolve(pageFile(users, pageNum, pageSize))
      else reject('暂无用户信息')
    } catch (err) {
      console.log(`查询用户列表异常,错误信息${err}`)
      reject('暂无用户信息')
    }
  })
}

// 新增用户
userSchema.statics.addUser = function (user) {
  return new Promise((resolve, reject) => {
    this.create(user)
      .then(result => result && resolve(user))
      .catch(err => {
        console.error(`新增用户异常,错误信息${err}`)
        reject('注册失败...')
      })
  })
}

// 删除用户
userSchema.statics.delUser = function (userId) {
  return new Promise((resolve, reject) => {
    this.findOneAndRemove({ userId }, { useFindAndModify: false })
      .then(resolve)
      .catch(err => {
        console.error(`删除用户异常,错误信息${err}`)
        reject('注销失败')
      })
  })
}

const userModel = mongoose.model('users', userSchema)

// 初始化超级管理员
  ; (async () => {
    try {
      const result = await userModel.findOne({ rank: 3 })
      if (result) return
      const admin = await userModel.addUser(createUser({
        phone: '13333333333',
        userName: '超级管理员',
        password: '666666',
        email: 'test@qq.com',
        avatar: 'http://localhost:4000/images/admin.jpg'
      }))
      const { userId, phone } = admin
      await userModel.findOneAndUpdate({ userId }, { $set: { rank: 3 } }, { useFindAndModify: false })
      console.log(`初始化管理员成功, 手机号为: ${phone}, 密码为: 666666`)
    } catch (err) { }
  })()

module.exports = userModel
