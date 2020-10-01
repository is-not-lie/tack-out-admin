const cateModel = require('../models/category')
const { v4: uuidv4 } = require('uuid')
module.exports = router => {
  // 主分类路由
  router.get('/api/cates', async (req, res) => {
    try {
      const cates = await cateModel.find({})
      if (cates.length) res.send({ status: 200, data: cates })
      else res.send({ status: 404, msg: '暂无分类列表' })
    } catch (err) {
      console.log(`查询分类列表异常,错误信息${err}`)
    }
  })
  router.post('/api/cate/add', async (req, res) => {
    const { cateName, icon } = req.body
    try {
      const cate = await cateModel.findOne({ cateName })
      if (cate) res.send({ status: 0, msg: '该分类已存在' })
      else res.send({ status: 200, data: await cateModel.create({ cateName, icon }) })
    } catch (err) {
      console.error(`添加商品分类异常,错误信息${err}`)
      res.send({ status: 0, msg: '添加分类失败' })
    }
  })
  router.post('/api/cate/edit', async (req, res) => {
    const { _id, cateName, icon } = req.body
    try {
      const cate = await cateModel.findById(_id)
      if (!cate) res.send({ status: 404, msg: '该分类不存在' })
      else {
        const result = await cateModel.findOne({ $and: [{ cateName }, { _id: { $ne: _id } }] })
        if (result) res.send({ status: 0, msg: '该分类名称已存在' })
        else {
          cate._doc.cateName = cateName
          cate._doc.icon = icon || cate._doc.icon
          await cateModel.findByIdAndUpdate(_id, cate, { useFindAndModify: false })
          res.send({ status: 200, data: cate })
        }
      }
    } catch (err) {
      console.error(`更改分类信息失败,错误信息${err}`)
      res.send({ status: 0, msg: '分类编辑失败' })
    }
  })
  router.post('/api/cate/del', async (req, res) => {
    const { _id } = req.body
    try {
      const cate = await cateModel.findById(_id)
      if (!cate) res.send({ status: 404, msg: '该分类不存在' })
      else if (cate._doc.subList.length) res.send({ status: 0, msg: '请先删除该分类下的子分类' })
      else {
        await cateModel.deleteOne({ _id })
        res.send({ status: 200 })
      }
    } catch (err) {
      console.error(`删除分类异常,错误信息${err}`)
      res.send({ status: 0, msg: '删除分类失败' })
    }
  })
  // 子分类路由
  router.get('/api/cate/sub/list', async (req, res) => {
    const { _id } = req.query
    try {
      const cates = await cateModel.findOne({ _id })
      if (!cates) res.send({ status: 0, msg: '尚无该主分类' })
      else res.send({ status: 200, data: cates._doc.subList })
    } catch (err) {
      console.error(`子分类查询异常,错误信息${err}`)
      res.send({ status: 0, msg: '获取分类列表失败' })
    }
  })
  router.post('/api/cate/sub/add', async (req, res) => {
    const { _id, subName } = req.body
    if (!subName) return res.send({ status: 0, msg: '分类名是必须的' })
    try {
      const cates = await cateModel.findById(_id)
      if (!cates) res.send({ status: 404, msg: '暂无该主分类' })
      else {
        const { subList } = cates._doc
        const sub = subList.find(item => item.subName === subName)
        if (sub) res.send({ status: 0, msg: '该子分类名称已存在' })
        else {
          subList.unshift({ subName, subId: uuidv4() })
          await cateModel.findByIdAndUpdate(_id,cates)
          res.send({ status: 200, data: subList })
        }
      }
    } catch (err) {
      console.error(`添加子分类异常,错误信息:${err}`)
      res.send({ status: 0, msg: '新增子分类失败' })
    }
  })
  router.post('/api/cate/sub/del', async (req, res) => {
    const { _id, subId } = req.body
    try {
      const cate = await cateModel.findById({ _id })
      if (!cate) return res.send({ status: 404, msg: '没有找到对应主分类' })
      const { subList } = cate._doc
      const subIndex = subList.findIndex(sub => sub.subId === subId)
      if (subIndex !== -1) subList.splice(subIndex, 1)
      await cateModel.findByIdAndUpdate(_id, cate, { useFindAndModify: false })
      res.send({ status: 200, data: subList })
    } catch (err) {
      console.error(`删除子分类异常,错误信息${err}`)
      res.send({ status: 0, msg: '删除分类失败' })
    }
  })
  router.post('/api/cate/sub/edit', async (req, res) => {
    const { _id, subId, subName } = req.body
    if (!subName) return res.send({ status: 0, msg: '子分类名称是必须的' })
    try {
      const cate = await cateModel.findById(_id)
      if (!cate) return res.send({ status: 404, msg: '没有找到该主分类' })
      const { subList } = cate._doc
      const sub = subList.find(sub => sub.subId === subId)
      if (!sub) res.send({ status: 404, msg: '没有找到该分类' })
      else {
        sub.subName = subName
        await cateModel.findByIdAndUpdate(_id, cate, { useFindAndModify: false })
        res.send({ status: 200, data: subList })
      }
    } catch (err) {
      console.error(`编辑子分类异常,错误信息${err}`)
      res.send({ status: 0, msg: '编辑失败' })
    }
  })
}
