const svgCaptcha = require('svg-captcha')

// 一次性svg验证码配置
const svgConfig = {
  ignoreChars: '0o1i',
  noise: 1,
  background: '#FFD161',
  width: 100,
  height: 40,
  fontSize: 40
}

module.exports = () => svgCaptcha.create(svgConfig)
