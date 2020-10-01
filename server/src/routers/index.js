const express = require('express')
const router = express.Router()
const globalImgsModel = require('../models/globalImgs')

router.get('/api/global_imgs', async (req, res) => {
  try {
    res.send({ status: 200, data: await globalImgsModel.find({}, { _id: 0, _v: 0 }) })
  } catch (err) {
    console.log(err)
    res.send({ status: 0, msg: '暂无图片资源' })
  }
})

require('./user')(router) // ok
require('./shop')(router) // ok
require('./order')(router) // ok
require('./goods')(router) // ok
require('./comment')(router)
require('./category')(router) // ok
require('./role')(router) // ok
require('./upload')(router)
require('./cities')(router)

module.exports = router
