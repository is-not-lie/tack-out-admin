const request = require('request')

const get = (url, params) => new Promise((resolve, reject) => {
  if (params) {
    let str = ''
    Object.keys(params).forEach(key => {
      str += `${key}=${params[key]}&`
    })
    str = str.replace(/&$/g, '')
    url += `?${str}`
  }
  request(url, (err, res, body) => {
    if (!err && res.statusCode === 200) {
      const { status, result, message } = JSON.parse(body)
      if (status === 0) resolve(result)
      else reject({ status, message })
    } else reject(res.statusCode)
  })
})

module.exports = { get }
