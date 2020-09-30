const md5 = require('md5')
const jwt = require('jsonwebtoken')
const svgCaptcha = require('svg-captcha')
const sendCode = require('../utils/sendSms.js')
const userModel = require('../models/user')
const { TOKEN_KEY, TOKEN_TIME, svgConfig } = require('../config')

module.exports = router => {
  router.post('/api/login', async (req, res) => {
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
}
