const mongoose = require('mongoose')
const express = require('express')
const { resolve } = require('path')
const cookieParser = require('cookie-parser')
const token = require('./src/utils/token')
const { DB, SERVER } = require('./src/config')
const app = express()

app.use(express.static(resolve(__dirname, './public')))
app.use(express.json())
app.use(cookieParser())
app.use(token)
app.use('/', require('./src/routers'))

mongoose.connect(`mongodb://${DB.host}:${DB.port}/${DB.name}`, {
  useNewUrlParser: true
})
  .then(() => {
    console.log('数据库连接成功')
    app.listen(SERVER.port, () => {
      console.log(`服务器已启动,请访问: http://${SERVER.host}:${SERVER.port}`)
    })
  })
  .catch((err) => {
    console.error(`服务器启动失败,错误信息:${err}`)
  })
