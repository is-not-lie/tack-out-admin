const cateModel = require('../models/category')
const { v4: uuidv4 } = require('uuid')
module.exports = router => {
  // 获取分类列表理由
  router.get('/api/cate/list', async (req, res) => {
    try { res.send({ status: 200, data: await cateModel.getCates() }) }
    catch (msg) { res.send({ status: 0, msg }) }
  })

  // 添加分类路由与更新分类路由 (功能差不多,合一起算了)
  router.post('/api/cate/add', async (req, res) => {
    const { cateName, cateId } = req.body
    if (!cateName) return res.send({ status: 0, msg: '请输入分类名称' })
    try {
      if (!cateId) {
        await cateModel.findCateName(cateName)
        res.send({ status: 200, data: await cateModel.addCate(req.body) })
      } else {
        res.send({ status: 200, data: await cateModel.updateCate(req.body) })
      }
    } catch (msg) { res.send({ status: 0, msg }) }
  })

  // 删除分类路由
  router.post('/api/cate/del', async (req, res) => {
    const { cateId } = req.body
    try {
      await cateModel.delCate(cateId)
      res.send({ status: 200 })
    } catch (msg) { res.send({ status: 0, msg }) }
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
