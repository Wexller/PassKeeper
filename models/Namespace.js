const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  name: { type: String, required: true, unique: true },
  projects: [{ type: Types.ObjectId, ref: 'Project' }],
  users: [{ type: Types.ObjectId, ref: 'User' }]
})

module.exports = model('Namespace', schema)