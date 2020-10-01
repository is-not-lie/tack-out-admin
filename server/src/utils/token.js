const jwt = require('jsonwebtoken')
const { TOKEN_KEY, TOKEN_CHECK } = require('../config')

module.exports = (req, res, next) => {
  const { url } = req
  // 匹配白名单
  if (TOKEN_CHECK.findIndex((path) => new RegExp(path).test(url)) === -1) return next()

  const { authorization } = req.headers
  if (!authorization) return res.status(401).json({ status: 401 })
  const token = authorization.slice(TOKEN_KEY.length)
  jwt.verify(token, TOKEN_KEY, (err, data) => {
    if (!err) {
      req.user = data
      return next()
    } else {
      console.error(`校验失败,错误信息:${err.message}`)
      return res.status(401).json({ status: 401 })
    }
  })
}
