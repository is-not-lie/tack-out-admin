import { http } from '@/api'
import { loginVer } from '@/tsConfig/interface/storeInterface'
// 手机号码校验规则
const phoneRex = /^1[34578]\d{9}$/g
// 储存手机验证码与发送验证码的手机号
let code: string | null
let userPhone = ''
// 储存svg验证码
let svgText = ''
// 手机号码校验失败提示信息
const phoneErrMsg = {
  empty: '手机号不能为空',
  format: '手机号格式错误',
  inconformity: '手机号码不一致'
}
// 验证码校验失败提示信息
const codeErrMsg = '验证码输入错误'
// 密码校验失败提示信息
const pwdErrMsg = {
  empty: '密码不能为空',
  min: '密码长度不能少于6位',
  max: '密码长度不能超过16位'
}

// svg验证码校验函数
const captchaVerify = (captcha: string) => new Promise((resolve, reject) => {
  if (captcha !== svgText) reject(codeErrMsg)
  else resolve(true)
})

// 手机验证码校验函数
const codeVerify = (captcha: string) => new Promise((resolve, reject) => {
  if (captcha !== code) reject(codeErrMsg)
  else resolve(true)
})

// 手机号码校验函数
const phoneVerify = (phone: string) => new Promise((resolve, reject) => {
  if (phone.trim() === '') reject(phoneErrMsg.empty)
  else if (phone !== userPhone) reject(phoneErrMsg.inconformity)
  else if (!phoneRex.test(phone)) reject(phoneErrMsg.format)
  else resolve(true)
})

// 密码校验函数
const pwdVerify = (pwd: string) => new Promise((resolve, reject) => {
  if (pwd.trim() === '') reject(pwdErrMsg.empty)
  else if (pwd.length < 6) reject(pwdErrMsg.min)
  else if (pwd.length > 16) reject(pwdErrMsg.max)
  else resolve(true)
})

// 登录校验函数
export const loginVerify = ({ phone, code, password, captcha }: loginVer): Promise<any> => new Promise((resolve, reject) => {
  if (password) {
    userPhone = phone
    Promise.all([phoneVerify(phone), pwdVerify(password), captchaVerify(captcha)])
      .then(resolve)
      .catch(reject)
  } else {
    Promise.all([phoneVerify(phone), codeVerify(code)])
      .then(resolve)
      .catch(reject)
  }
})

// 获取svg验证码函数
export const getCaptcha = async (): Promise<string> => {
  const svg: any = await http.reqCaptcha()
  if (svg) {
    svgText = svg.text.toLowerCase()
    return Promise.resolve(svg.data)
  }
}

// 发送手机验证码函数
let timeOutKey = null
export const sendCode = async (phone: string, timeOut = 60000): Promise<boolean> => {
  userPhone = phone
  clearTimeout(timeOutKey)
  const captcha: any = await http.reqSendCode(phone)
  if (captcha) {
    code = captcha
    timeOutKey = setTimeout(() => { code = null }, timeOut)
    return Promise.resolve(true)
  } else return Promise.resolve(false)
}
