const mongoose = require('mongoose')
const { model } = require('../models/shop')

const citiesSchema = new mongoose.Schema({})

const citiesModel = mongoose.model('cities', citiesSchema)

module.exports = router => {
  router.get('/api/citys', async (req, res) => {
    try {
      res.send({ status: 200, data: await citiesModel.find({}) })
    } catch (err) {
      console.error(`查询城市信息异常,错误信息${err}`)
      res.send({ status: 0, msg: '获取城市信息失败' })
    }
  })
}