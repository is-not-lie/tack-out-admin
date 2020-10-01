const DB = {
  port: 27017,
  host: 'localhost',
  name: 'take_out_admin'
}

const SERVER = {
  port: 4000,
  host: 'localhost'
}
// token校验白名单
// const TOKEN_CHECK = ['/images', '/login', '/', '/api/captcha', '/api/global_imgs']
const TOKEN_CHECK = []
// token签名密钥
const TOKEN_KEY = 'take_out_shop'
// token过期事件
const TOKEN_TIME = '30 days'
// 一次性svg验证码配置
const svgConfig = {
  ignoreChars: '0o1i',
  noise: 1,
  background: '#FFD161',
  width: 100,
  height: 40,
  fontSize: 40
}

module.exports = { DB, SERVER, TOKEN_CHECK, TOKEN_KEY, TOKEN_TIME, svgConfig }
