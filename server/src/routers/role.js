const roleModel = require('../models/role')
const dayjs = require('dayjs')

module.exports = router => {
  router.get('/api/roles', async (req, res) => {
    try {
      const roles = await roleModel.find({})
      if (roles.length) res.send({ status: 200, data: roles })
      else res.send({ status: 404, msg: '暂无角色列表' })
    } catch (err) {
      console.log(`查询角色信息异常,错误信息${err}`)
      res.send({ status: 0, msg: '查询角色列表失败' })
    }
  })
  router.post('/api/roles/add', async (req, res) => {
    const { roleName, creator } = req.body
    try {
      const role = await roleModel.findOne({ roleName })
      if (role) res.send({ status: 0, msg: '该角色名称已存在' })
      else res.send({ status: 200, data: await roleModel.create({ roleName, creator }) })
    } catch (err) {
      console.log(`创建角色异常,错误信息${err}`)
      res.send({ status: 0, msg: '创建角色失败' })
    }
  })
  router.post('/api/roles/del', async (req, res) => {
    const { _id } = req.body
    try {
      await roleModel.deleteOne({ _id })
      res.send({ status: 200 })
    } catch (err) {
      console.log(`删除角色异常,错误信息${err}`)
      res.send({ status: 0, msg: '删除角色失败' })
    }
  })
  router.post('/api/roles/edit', async (req, res) => {
    const { _id, roleName, editor } = req.body
    try {
      const role = await roleModel.findById(_id)
      if (!role) res.send({ status: 0, msg: '没有该角色存在' })
      else {
        role._doc.editor = editor
        role._doc.roleName = roleName
        role._doc.editTime = dayjs().format('YYYY-MM-DD')
        await roleModel.findByIdAndUpdate(_id, role, { useFindAndModify: false })
        res.send({
          status: 200,
          data: role
        })
      }
    } catch (err) {
      console.log(`修改角色信息异常,错误信息${err}`)
      res.send({ status: 0, msg: '修改角色信息失败' })
    }
  })
}
