const dayjs = require('dayjs')
const { v4: uuidv4 } = require('uuid')
const commentModel = require('../models/comment')
const userModel = require('../models/user')
const { commentVerify } = require('../utils/verify')
const { SERVER } = require('../config')

const defalutAvatar = `http://${SERVER.host}:${SERVER.port}/images/default.png`

const createComment = async comment => {
  const user = await userModel.findOne({ _id: comment.userId })
  const { userName, avatar_url } = user._doc
  return {
    commentId: uuidv4(),
    userName, // 评论的用户名 (必须)
    avatar_url: avatar_url || defalutAvatar, // 用户头像
    content: comment.content, // 评论内容 (必须)
    create_time: dayjs().format('YYYY-MM-DD hh:mm:ss'), // 评论创建时间
    arrive_time: comment.arrive, // 送达时间 (必须)....虽然是必须的,但是咱也没人送啊!!!
    shop_reply: '', // 商家回复内容
    goods_img: comment.goods_img || [], // 评论的商品图片
    typeId: comment.typeId, // 评论类型, 好评,差评这种 (必须)
    labels: comment.labels || [], // 评论标签, 包含icon与点赞商品列表
    status: 0 // 评论状态, 0: 未回复, 1: 已回复
  }
}

const createType = name => ({
  typeName: name, // 评论类型名称
  typeId: uuidv4(), // id
  count: 0 // 评论量
})

module.exports = router => {
  router.get('/api/shop/comment/labels', async (req, res) => {
    const { shopId } = req.query
    try {
      const shop = await commentModel.findOne({ shopId })
      if (!shop) return res.send({ status: 404, msg: '没有找到该商家' })

      const { labels } = shop._doc
      if (!labels.length) res.send({ status: 404, msg: '暂无商品标签列表' })
      else res.send({ status: 200, data: labels })
    } catch (err) {
      console.error(`查询商品标签列表失败,错误信息${err}`)
      res.send({ status: 0, msg: '获取标签列表失败' })
    }
  })
  router.get('/api/shop/comment/types', async (req, res) => {
    const { shopId } = req.query
    try {
      const shop = await commentModel.findOne({ shopId })
      if (!shop) return res.send({ status: 404, msg: '没有找到该商家' })

      const { types } = shop._doc
      if (!types.length) res.send({ status: 404, msg: '暂无评论类型列表' })
      else res.send({ status: 200, data: types })
    } catch (err) {
      console.error(`查询评论类型列表失败,错误信息${err}`)
      res.send({ status: 0, msg: '获取评论类型列表失败' })
    }
  })
  router.post('/api/shop/comment/type/add', async (req, res) => {
    const { shopId, typeName } = req.body
    try {
      const shop = await commentModel.findOne({ shopId })
      if (!shop) return res.send({ status: 404, msg: '没有找到该商家' })
      if (!typeName) return res.send({ status: 0, msg: '请填写类型名称' })

      const { types } = shop._doc
      const result = types.find(type => type.typeName === typeName)
      if (result) res.send({ status: 0, msg: '该类型名称已存在' })
      else {
        const type = createType(typeName)
        types.push(type)
        await commentModel.findOneAndUpdate({ shopId }, shop, { useFindAndModify: false })
        res.send({ status: 200, data: types })
      }
    } catch (err) {
      console.error(`添加评论类型异常,错误信息${err}`)
      res.send({ status: 0, msg: '添加评论类型失败' })
    }
  })
  router.post('/api/shop/comment/type/edit', async (req, res) => {
    const { shopId, typeName, typeId, count } = req.body
    try {
      const shop = await commentModel.findOne({ shopId })
      if (!shop) return res.send({ status: 404, msg: '没有找到该商家' })
      if (!typeName) return res.send({ status: 0, msg: '请填写类型名称' })

      const { types } = shop._doc
      const type = types.find(item => item.typeId === typeId)
      if (!type) res.send({ status: 404, msg: '没有找到该评论类型' })
      else {
        type.typeName = typeName
        type.count = count
        await commentModel.findOneAndUpdate({ shopId }, shop, { useFindAndModify: false })
        res.send({ status: 200, data: types })
      }
    } catch (err) {
      console.error(`修改评论类型异常,错误信息${err}`)
      res.send({ status: 0, msg: '修改评论类型失败' })
    }
  })
  router.post('/api/shop/comment/type/del', async (req, res) => {
    const { shopId, typeId } = req.body
    try {
      const shop = await commentModel.findOne({ shopId })
      if (!shop) return res.send({ status: 404, msg: '没有找到该商家' })

      const { types } = shop._doc
      const index = types.findIndex(type => type.typeId === typeId)
      if (index !== -1) types.splice(index, 1)
      await commentModel.findOneAndUpdate({ shopId }, shop, { useFindAndModify: false })
      res.send({ status: 200, data: types })
    } catch (err) {
      console.error(`删除评论类型异常,错误信息${err}`)
      res.send({ status: 0, msg: '删除评论类型失败' })
    }
  })
  router.get('/api/shop/comment/info', async (req, res) => {
    const { shopId, commentId } = req.query
    try {
      const shop = await commentModel.findOne({ shopId })
      if (!shop) return res.send({ status: 404, msg: '没有找到该商家' })

      const { commentList } = shop._doc
      const comment = commentList.find(item => item.commentId === commentId)
      if (!comment) res.send({ status: 404, msg: '找不到该评论信息' })
      else res.send({ status: 200, data: comment })
    } catch (err) {
      console.error(`查询评论信息异常,错误信息${err}`)
      res.send({ status: 0, msg: '获取评论信息失败' })
    }
  })
  router.get('/api/shop/comment/list', async (req, res) => {
    const { shopId } = req.query
    try {
      const shop = await commentModel.findOne({ shopId })
      if (!shop) return res.send({ status: 404, msg: '没有找到该商家' })

      const { commentList } = shop._doc
      if (!commentList.length) res.send({ status: 404, msg: '当前还没有评论存在' })
      else res.send({ status: 200, data: commentList })
    } catch (err) {
      console.error(`查询评论列表异常,错误信息${err}`)
      res.send({ status: 0, msg: '获取评论列表失败' })
    }
  })
  router.post('/api/shop/comment/add', async (req, res) => {
    let { shopId, comment } = req.body
    const result = commentVerify(comment)
    if (result.status === false) return res.send({ status: 0, msg: result.msg })

    try {
      const shop = await commentModel.findOne({ shopId })
      if (!shop) return res.send({ status: 404, msg: '没有找到该商家' })

      const { commentList, types, labels } = shop._doc
      if (comment.labels && Array.isArray(comment.labels)) {
        const labelIdList = comment.labels
        comment.labels = labels.filter(label => labelIdList.indexOf(label.labelId) !== -1)
      }
      if (comment.labels && typeof comment.labels === 'string') {
        comment.labels = labels.find(label => label.labelId === comment.labels)
      }
      comment = await createComment(comment)
      commentList.unshift(comment)
      const type = types.find(item => item.typeId === comment.typeId)
      if (type) type.count++
      await commentModel.findOneAndUpdate({ shopId }, shop, { useFindAndModify: false })
      res.send({ status: 200, data: commentList })
    } catch (err) {
      console.error(`添加评论异常,错误信息${err}`)
      res.send({ status: 0, msg: '评论失败' })
    }
  })
  router.post('/api/shop/comment/edit', async (req, res) => {
    const { shopId, commentId, shop_reply } = req.body
    if (!shop_reply) return res.send({ status: 0, msg: '请填写回复内容' })
    try {
      const shop = await commentModel.findOne({ shopId })
      const { commentList } = shop._doc
      const comment = commentList.find(item => item.commentId === commentId)
      comment.shop_reply = shop_reply
      comment.status = 1
      await commentModel.findOneAndUpdate({ shopId }, shop, { useFindAndModify: false })
      res.send({ status: 200, data: commentList })
    } catch (err) {
      console.error(`修改评论信息异常,错误信息${err}`)
      res.send({ status: 0, msg: '回复失败' })
    }
  })
}
