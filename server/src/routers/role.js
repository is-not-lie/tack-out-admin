const roleModel = require('../models/role')
const userModel = require('../models/user')
const dayjs = require('dayjs')
const { v4: uuidv4 } = require('uuid')

const createRole = (role) => {
  return {
    roleId: uuidv4(),
    roleName: role.roleName,
    creator: role.creator,
    authority: role.authority || 0,
    creationTime: dayjs().format('YYYY-MM-DD')
  }
}

module.exports = router => {
  router.get('/api/roles', async (req, res) => {
    try {
      const roles = await roleModel.find({}, { __v: 0, _id: 0 })
      if (roles.length) res.send({ status: 200, data: roles })
      else res.send({ status: 404, msg: '暂无角色列表' })
    } catch (err) {
      console.log(`查询角色信息异常,错误信息${err}`)
      res.send({ status: 0, msg: '查询角色列表失败' })
    }
  })
  router.post('/api/roles/add', async (req, res) => {
    const { roleName } = req.body
    try {
      const role = await roleModel.findOne({ roleName })
      if (role) res.send({ status: 0, msg: '该角色名称已存在' })
      else {
        const newRole = createRole(req.body)
        await roleModel.create(newRole)
        res.send({ status: 200, data: newRole })
      }
    } catch (err) {
      console.log(`创建角色异常,错误信息${err}`)
      res.send({ status: 0, msg: '创建角色失败' })
    }
  })
  router.post('/api/roles/del', async (req, res) => {
    const { roleId } = req.body
    try {
      await roleModel.deleteOne({ roleId })
      res.send({ status: 200 })
    } catch (err) {
      console.log(`删除角色异常,错误信息${err}`)
      res.send({ status: 0, msg: '删除角色失败' })
    }
  })
  router.post('/api/roles/edit', async (req, res) => {
    const { roleId, roleName, editor, authority } = req.body
    try {
      const role = await roleModel.findOne({ roleId }, { _id: 0, __v: 0 })
      if (!role) return res.send({ status: 0, msg: '没有该角色存在' })
      if (await roleModel.findOne({ $and: [{ roleName }, { roleId: { $ne: roleId } }] })) {
        res.send({ status: 0, msg: '该角色名称已存在' })
      }
      else {
        role._doc.editor = editor
        role._doc.roleName = roleName
        role._doc.authority = authority || 0
        role._doc.editTime = dayjs().format('YYYY-MM-DD')
        await roleModel.findOneAndUpdate({ roleId }, role, { useFindAndModify: false })
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
  // 设置权限
  router.get('/api/user/list', async (req, res) => {
    try {
      res.send({ status: 200, data: await userModel.find({}, { password: 0, __v: 0}) })
    } catch (err) {
      console.error(`查询用户列表异常,错误信息${err}`)
      res.send({ status: 0, msg: '获取用户列表失败' })
    }
  })
  router.get('/api/user/seach', async (req, res) => {
    const { phone } = req.query
    if (!phone) return res.send({ status: 0, msg: '请输入手机号' })

    try {
      const user = await userModel.findOne({ phone }, { password: 0, __v: 0})
      if (!user) res.send({ status: 404, msg: '没有找到该用户' })
      else res.send({ status: 200, data: user })
    } catch (err) {
      console.error(`搜索用户异常,错误信息${err}`)
      res.send({ status: 0, msg: '没有找到用户信息' })
    }
  })
  router.post('/api/user/rule/edit', async (req, res) => {
    const { userId, roleId } = req.body
    try {
      const role = await roleModel.findOne({ roleId })
      if (!role) res.send({ status: 404, msg: '没有找到该角色' })
      else {
        const { authority } = role._doc
        await userModel.findByIdAndUpdate(userId, { $set: { authority } }, { useFindAndModify: false})
        res.send({ status: 200 })
      }
    } catch (err) {
      console.error(`角色权限更改异常,错误信息${err}`)
      res.send({ status: 0, msg: '权限编辑失败' })
    }
  })
}
