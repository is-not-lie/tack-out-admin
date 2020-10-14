const md5 = require('md5')
const dayjs = require('dayjs')
const sendCode = require('../utils/sendSms.js')
const { createUser } = require('../utils/create')
const { userMap } = require('../utils/map')
const getSvg = require('../utils/svg')
const userModel = require('../models/user')

let svgText = '' // 保存svg验证码
let phoneCode = '' // 保存手机验证码
let userPhone = '' // 保存发送手机验证码的手机号

// 获取用户 ip
const getIp = (req) => {
  let ip = ''
  const defalutIp = '119.120.228.52'
  if (process.env.NODE_ENV === 'development') return defalutIp
  try {
    ip = req.headers['x-forwarded-for'] ||
         req.connection.remoteAddress ||
         req.socket.remoteAddress ||
         req.connection.socket.remoteAddress
    const ipArr = ip.split(':')
    ip = ipArr[ipArr.length - 1] || defaultIp
  } catch (err) {
    ip = defaultIp
  }
  return ip
}

// 处理密码登录函数
const pwdLogin = async (req, res) => {
  const { phone, password, captcha } = req.body

  if (captcha.toLowerCase() !== svgText) return res.send({ status: 0, msg: '验证码错误' })
  try {
    const result = await userModel.findOne({ phone, password: md5(password) }, { __v: 0, _id: 0, password: 0 })
    if (!result) res.send({ status: 404, msg: '手机号或密码不正确' })
    else {
      const user = await userMap(getIp(req), { ...result._doc })
      res.send({ status: 200, data: user })
    }
  } catch (err) {
    console.error(`用户登录异常,错误信息:${err}`)
    res.send({ status: 500, msg: '登录失败' })
  }
}

// 处理用户注册函数
const userSignin = async (req, res) => {
  const user = createUser(req.body)
  try {
    await userModel.create(user)
    res.send({ status: 200, data: await userMap(getIp(req), user) })
  } catch (err) {
    console.error(`用户登录异常,错误信息:${err}`)
    res.send({ status: 500, msg: '登录失败' })
  }
}

module.exports = router => {
  // 登录路由
  router.post('/api/login', async (req, res) => {
    const { phone, code, password } = req.body
    if (!/^1[34578]\d{9}/g.test(phone)) return res.send({ status: 0, msg: '手机号码格式错误' })
    if (password) return pwdLogin(req, res)
    // 校验验证码和手机号
    if (code !== phoneCode) return res.send({ status: 0, msg: '验证码错误' })
    if (phone !== userPhone) return res.send({ status: 0, msg: '两次的手机号码不一致' })

    try {
      const user = await userModel.findOne({ phone })
      // 若用户未注册则注册
      if (!user) userSignin(req, res)
      else res.send({ status: 200, data: await userMap(getIp(req), { ...user._doc }) })
    } catch (err) {
      console.error(`用户登录异常,错误信息:${err}`)
      res.send({ status: 500, msg: '登录失败' })
    }
  })
  // 更新用户信息路由
  router.post('/api/user/edit', async (req, res) => {
    const { userId } = req.body
    try {
      const user = await userModel.searchId(userId)
      Object.keys(req.body).forEach(key => {
        if (key === 'userId') return
        if (key === 'createTime') return
        if (key === 'token') return
        if (key === 'editTime') {
          user._doc[key] = dayjs().format('YYYY-MM-DD HH:mm:ss')
        } else {
          user._doc[key] = req.body[key]
        }
      })
      await userModel.update(userId, user)
      res.send({ status: 200, data: user })
    } catch (err) { res.send({ status: 0, msg: err }) }
  })
  // 根据手机号码搜索用户
  router.get('/api/user/search', async (req, res) => {
    const { phone } = req.query
    try { res.send({ status: 200, data: await userModel.search(phone) }) }
    catch (err) { res.send({ status: 0, msg: err }) }
  })
  // 获取用户列表
  router.get('/api/user/list', async (req, res) => {
    const { pageNum, pageSize } = req.query
    try { res.send({ status: 200, data: await userModel.userList(pageNum, pageSize) }) }
    catch (err) { res.send({ status: 0, msg: err }) }
  })
  // 删除用户路由
  router.post('/api/user/del', async (req, res) => {
    const { userId } = req.body
    try {
      await userModel.delUser(userId)
      res.send({ status: 200 })
    } catch (err) { res.send({ status: 0, msg: err }) }
  })
  // svg验证码路由
  router.get('/api/captcha', (req, res) => {
    const { data, text } = getSvg()
    // 保存验证码
    svgText = text.toLowerCase()
    res.send({ status: 200, data })
  })
  // 短信验证码路由
  router.get('/api/sendcode', async (req, res) => {
    const { phone } = req.query
    if (!/^1[34578]\d{9}$/g.test(phone)) return res.send({ status: 0, msg: '手机号码格式错误' })
    try {
      const { code, status } = await sendCode({ phone })
      if (status === 200) {
        console.log(`已向${phone}发送验证码短信,验证码为: ${code}`)
        // 保存验证码和接收验证码的手机号
        phoneCode = code
        userPhone = phone
        // 设置验证码过期时间..session存储不熟悉, 只能这样了
        setTimeout(() => {
          phoneCode = ''
          userPhone = ''
        }, 180000)
        res.send({ status })
      }
    } catch (err) {
      console.error(`向用户发送手机验证码异常, 错误信息:${err}`)
      res.send({ status: 0, msg: '当前网络繁忙,请稍后重新尝试' })
    }
  })
}
