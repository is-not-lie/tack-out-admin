import { http } from '@/api'

export const phoneRegExp = new RegExp(/^1[34578]\d{9}$/g)

// 校验手机号
export const phoneVerify = (phone) => new Promise((resolve, reject) => {
  if (phone.trim() === '') reject(new Error('请输入手机号码'))
  else if (!phoneRegExp.test(phone)) reject(new Error('手机号码格式错误'))
  else resolve()
})

// 校验密码
export const pwdVerify = (password) => new Promise((resolve, reject) => {
  if (password.trim() === '') reject(new Error('请输入密码'))
  else resolve()
})

// 请求svg验证码
export const getSvg = async () => {
  const svg = await http.reqCaptcha()
  if (svg) return Promise.resolve(svg)
  else return Promise.reject(new Error(''))
}

// 请求发送短信验证码
export const sendCode = async (phone) => {
  try {
    await phoneVerify(phone)
    const result = await http.reqSendCode(phone)
    if (result) return Promise.resolve()
    else return Promise.reject(new Error('验证码发送失败,请重新发送'))
  } catch (err) {
    return Promise.reject(err)
  }
}
