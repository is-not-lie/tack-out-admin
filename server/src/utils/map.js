const jwt = require('jsonwebtoken')
const { get } = require('./request')
const { txKey, ipUrl, TOKEN_KEY, TOKEN_TIME, SERVER } = require('../config')

// 加工一下用户信息, 添加 token 与 当前所在地理位置等
const userMap = (ip, user) => new Promise((resolve, reject) => {
  user.token = jwt.sign({ id: user.userId }, TOKEN_KEY, { expiresIn: TOKEN_TIME })
  get(ipUrl, { ip, key: txKey })
    .then(result => {
      const { location, ad_info } = result
      const { province, city, district } = ad_info
      const currentCity = `${province || ''}${city || ''}${district || ''}`
      user.location = location
      user.currentCity = currentCity
      resolve(user)
    })
    .catch(err => reject({ user, err }))
})

const mapImg = (imgName) => `http://${SERVER.host}:${SERVER.port}/images/${imgName}`

module.exports = { userMap, mapImg }
