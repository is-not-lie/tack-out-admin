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
const TOKEN_CHECK = ['/images', '/login', '/', '/api/captcha', '/api/global_imgs']
// token签名密钥
const TOKEN_KEY = 'take_out_shop'
// token过期事件
const TOKEN_TIME = '30 days'

// 腾讯 api 的 key
const txKey = 'JK2BZ-USG3W-UFFRI-RL4UD-FFHQ2-ZNBBP'
// ip 定位 url
const ipUrl = 'https://apis.map.qq.com/ws/location/v1/ip'

module.exports = { DB, SERVER, TOKEN_CHECK, TOKEN_KEY, TOKEN_TIME, txKey, ipUrl }
