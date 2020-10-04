const md5 = require('md5')
const jwt = require('jsonwebtoken')
const dayjs = require('dayjs')
const svgCaptcha = require('svg-captcha')
const sendCode = require('../utils/sendSms.js')
const userModel = require('../models/user')
const orderModel = require('../models/order')
const { TOKEN_KEY, TOKEN_TIME, svgConfig, SERVER } = require('../config')
const pageFile = require('../utils/pageFile')
const avatar_url = `http://${SERVER.host}:${SERVER.port}/images/default.png`

const createUser = (user) => {
  return {
    phone: user.phone,
    userName: user.userName || user.phone,
    password: user.password ? md5(user.password) : '',
    shipping_address: user.shipping_address || [],
    avatar_url: user.avatar_url || avatar_url,
    signinTime: dayjs().format('YYYY-MM-DD')
  }
}

module.exports = router => {
  router.post('/api/user/singin', async (req, res) => {
    const { phone } = req.body
    if (!phone) return res.send({ status: 0, msg: '手机号是必须的' })
    try {
      const user = await userModel.findOne({ phone })
      if (user) res.send({ status: 0, msg: '该手机号码已被注册' })
      else {
        const newUser = createUser(req.body)
        const result = await userModel.create(newUser)
        // 用户注册成功, 初始化用户订单表
        const { _id } = result._doc
        await orderModel.create({ userId: _id })
        result._doc.token = jwt.sign({ id: _id }, TOKEN_KEY, { expiresIn: TOKEN_TIME })
        res.send({ status: 200, data: result })
      }
    } catch (err) {
      console.error(`用户注册异常,错误信息${err}`)
      res.send({ status: 0, msg: '注册失败' })
    }
  })
  router.post('/api/user/login', async (req, res) => {
    const { phone, password } = req.body
    try {
      const user = password
        ? await userModel.findOne({ phone, password: md5(password) }, { password: 0, _v: 0 })
        : await userModel.findOne({ phone }, { password: 0, _v: 0 })
      if (!user) return res.send({ status: 0, msg: '该用户不存在或密码不正确' })
      user._doc.token = jwt.sign({ id: user._id }, TOKEN_KEY, { expiresIn: TOKEN_TIME })
      res.send({ status: 200, data: user })
    } catch (err) {
      console.error(`查询用户信息异常,错误信息:${err}`)
      res.send({ status: 0, msg: '当前网络繁忙,请稍后重新尝试' })
    }
  })
  router.post('/api/user/edit', async (req, res) => {
    const { phone, _id, password } = req.body
    if (!phone) return res.send({ status: 0, msg: '手机号是必须的' })
    if (password) req.body.password = md5(password)
    try {
      const user = await userModel.findOne({ $and: [{ phone }, { _id: { $ne: _id } }] })
      if (user) res.send({ status: 0, msg: '该手机号已被注册' })
      else {
        await userModel.findOneAndUpdate({ _id }, { $set: { ...req.body } }, { useFindAndModify: false })
        res.send({ status: 200 })
      }
    } catch (err) {
      console.error(`编辑用户信息异常,错误信息${err}`)
      res.send({ status: 0, msg: '编辑失败' })
    }
  })
  // svg验证码路由
  router.get('/api/captcha', (req, res) => {
    res.send({ status: 200, data: svgCaptcha.create(svgConfig) })
  })
  // 短信验证码路由
  router.get('/api/sendcode', async (req, res) => {
    const { phone } = req.query
    console.log(phone)
    try {
      const { code, status } = await sendCode({ phone })
      if (status === 200) {
        console.log(`已向${phone}发送验证码短信,验证码为: ${code}`)
        res.send({ status, data: code })
      }
    } catch (err) {
      console.error(`向用户发送手机验证码异常, 错误信息:${err}`)
      res.send({ status: 0, msg: '当前网络繁忙,请稍后重新尝试' })
    }
  })
  // 请求用户列表路由
  router.get('/api/user/list', async (req, res) => {
    const { pageNum, pageSize } = req.query
    try {
      const userList = await userModel.find({ authority: { $ne: 3 } }, { password: 0, __v: 0 })
      if (userList.length) res.send({ status: 200, data: pageFile(userList, pageNum, pageSize) })
      else res.send({ status: 404, msg: '当前暂无用户' })
    } catch (err) {
      console.error(`查询用户列表异常,错误信息${err}`)
      res.send({ status: 0, msg: '获取用户列表失败' })
    }
  })
  // 根据手机号搜索用户列表
  router.get('/api/user/seach', async (req, res) => {
    const { phone } = req.query
    if (!phone) return res.send({ status: 0, msg: '请输入手机号' })

    try {
      const user = await userModel.findOne({ phone, authority: { $ne: 3 } }, { password: 0, __v: 0 })
      if (!user) res.send({ status: 404, msg: '没有找到该用户' })
      else res.send({ status: 200, data: user })
    } catch (err) {
      console.error(`搜索用户异常,错误信息${err}`)
      res.send({ status: 0, msg: '没有找到用户信息' })
    }
  })
  // 更新用户权限
  router.post('/api/user/rule/edit', async (req, res) => {
    const { userId, authority } = req.body
    try {
      const user = await userModel.findById(userId)
      if (!user) res.send({ status: 404, msg: '该用户不存在' })
      else {
        await userModel.findByIdAndUpdate(userId, { $set: { authority } }, { useFindAndModify: false })
        res.send({ status: 200 })
      }
    } catch (err) {
      console.error(`角色权限更改异常,错误信息${err}`)
      res.send({ status: 0, msg: '权限编辑失败' })
    }
  })
}
