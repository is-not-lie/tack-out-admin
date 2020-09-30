const cateModel = require('../models/category')

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
    const { _id } = req.body
    try {
      const cate = await cateModel.findOne({ _id })
      if (!cate) res.send({ status: 404, msg: '该分类不存在' })
      else {
        const result = await cateModel.findOneAndUpdate({ _id }, { ...req.body })
        result && res.send({ status: 200 })
      }
    } catch (err) {
      console.error(`更改分类信息失败,错误信息${err}`)
      res.send({ status: 0, msg: '分类编辑失败' })
    }
  })
  router.post('/api/cate/del', async (req, res) => {
    const { _id } = req.body
    try {
      const cate = await cateModel.findOne({ _id })
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
  router.get('/api/cate/sublist', async (req, res) => {
    try {
      const cates = await cateModel.find({})
      const subList = cates.map(cate => {
        if (cate.subList.length) return cate.subList
      })
      if (subList.length) res.send({ status: 200, data: subList })
      else res.send({ status: 0, msg: '当前暂无子分类列表' })
    } catch (err) {
      console.error(`查询子分类列表失败,错误信息${err}`)
      res.send({ status: 0, msg: '获取分类列表失败' })
    }
  })
  router.get('/api/cate/sub', async (req, res) => {
    const { _id } = req.query
    try {
      const subCate = await cateModel.findOne({ _id }, { _id: 0, icon: 0, cateName: 0 })
      if (!subCate.length) res.send({ status: 0, msg: '该分类尚无子分类' })
      else res.send({ status: 200, data: subCate })
    } catch (err) {
      console.error(`子分类查询异常,错误信息${err}`)
      res.send({ status: 0, msg: '获取分类列表失败' })
    }
  })
  router.post('/api/cate/sub/add', async (req, res) => {
    const { _id, subName, subId } = req.body
    try {
      const cates = cateModel.findOne({ _id })
      if (!cates) res.send({ status: 404, msg: '暂无该主分类' })
      else {
        cates._doc.subList.push({ subName, subId })
        res.send({ status: 200, data: await cateModel.findOneAndUpdate({ _id }, { ...cates }) })
      }
    } catch (err) {
      console.error(`添加子分类异常,错误信息:${err}`)
      res.send({ status: 0, msg: '新增子分类失败' })
    }
  })
  router.post('/api/cate/sub/del', async (req, res) => {
    const { _id, subId } = req.body
    try {
      const cate = await cateModel.findOne({ _id })
      const subIndex = cate._doc.subList.findIndex(sub => sub.subId === subId)
      if (subIndex !== -1) cates._doc.subList.splice(subIndex, 1)
      await cateModel.findOneAndUpdate({ _id }, { ...cate })
      res.send({ status: 200 })
    } catch (err) {
      console.error(`删除子分类异常,错误信息${err}`)
      res.send({ status: 0, msg: '删除分类失败' })
    }
  })
  router.post('/api/cate/sub/edit', async (req, res) => {
    const { _id, subId, subName } = req.body
    try {
      const cate = await cateModel.findOne({ _id })
      const subIndex = cate._doc.subList.findIndex(sub => sub.subId === subId)
      if (subIndex === -1) res.send({ status: 404, msg: '没有找到该分类' })
      else {
        cate._doc.subList[subIndex].subName = subName
        res.send({ status: 200, data: await cateModel.findOneAndUpdate({ _id }, { ...cate }) })
      }
    } catch (err) {
      console.error(`编辑子分类异常,错误信息${err}`)
      res.send({ status: 0, msg: '编辑失败' })
    }
  })
}
