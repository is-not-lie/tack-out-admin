const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
  roleId: { type: String, required: true, unique: true },
  roleName: { type: String, required: true, unique: true },
  creator: { type: String, required: true },
  creationTime: String || Number,
  editor: String,
  editTime: String || Number,
  authority: Number
})

module.exports = mongoose.model('roles', roleSchema)
