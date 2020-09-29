const dayjs = require('dayjs')
const md5 = require('md5')
const { Base64 } = require('js-base64')
const request = require('request')
// 生成指定长度验证码
const randomCode = length => {
  let code = ''
  for (let i = 0; i < length; i++) {
    code += Math.ceil(Math.random() * 9)
  }
  return code
}
// 向指定号码发送验证码
module.exports = ({ phone, length = 6 }) => new Promise((resolve, reject) => {
  /**
   * 该功能使用容联云通讯的api,网址:https://www.yuntongxun.com/
   * 运行时请把下面4个变量替换为自己的
   * 备注: 首次注册会赠送8块钱,能发不少短信了,记得在号码管理里添加测试号码
   */
  const ACCOUNT_SID = '8a216da873cec1320174262d08b320a0'
  const AUTH_TOKEN = '46a301fcffe24bf3809fec17bf6e25ee'
  const REST_URL = 'https://app.cloopen.com:8883'
  const appId = '8a216da873cec1320174262d09ad20a6'
  // 准备请求url
  const time = dayjs().format('YYYYMMDDHHmmss')
  const sig = md5(ACCOUNT_SID + AUTH_TOKEN + time)
  const url = `${REST_URL}/2013-12-26/Accounts/${ACCOUNT_SID}/SMS/TemplateSMS?sig=${sig}`
  // 准备请求体
  const code = randomCode(length)
  const body = {
    to: phone,
    appId,
    templateId: '1',
    datas: [code, '1']
  }
  // 准备请求头
  const Authorization = Base64.encode(`${ACCOUNT_SID}:${time}`)
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
    'Content-Length': JSON.stringify(body).length + '',
    Authorization
  }
  // 发送请求
  request(
    {
      method: 'POST',
      url,
      headers,
      body,
      json: true
    },
    (error, response, body) => {
      if (!error) resolve({ code, status: response.statusCode })
      else reject(error)
    }
  )
})
