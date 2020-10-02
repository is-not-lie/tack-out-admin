const mongoose = require('mongoose')
const { model } = require('../models/shop')

const citiesSchema = new mongoose.Schema({})

const citiesModel = mongoose.model('cities', citiesSchema)

module.exports = router => {
  // 获取省级
  router.get('/api/citys', async (req, res) => {
    try {
      res.send({ status: 200, data: await citiesModel.find({ level: 1 }) })
    } catch (err) {
      console.error(`查询城市信息异常,错误信息${err}`)
      res.send({ status: 0, msg: '获取城市信息失败' })
    }
  })
  // 获取市级
  router.get('/api/citys/city', async (req, res) => {
    const { province } = req.query
    try {
      const citys = await citiesModel.find({ province, level: 2 })
      res.send({ status: 200, data: citys })
    } catch (err) {
      console.error(`查询城市信息异常,错误信息${err}`)
      res.send({ status: 0, msg: '获取城市信息失败' })
    }
  })
  // 获取区县
  router.get('/api/citys/county', async (req, res) => {
    const { province, city } = req.query
    try {
      res.send({ status: 200, data: await citiesModel.find({ province, city, level: 3 }) })
    } catch (err) {
      console.error(`查询城市信息异常,错误信息${err}`)
      res.send({ status: 0, msg: '获取城市信息失败' })
    }
  })
}