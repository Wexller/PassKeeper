const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  cases: [{ type: Types.ObjectId, ref: 'Case' }],
  namespace: { type: Types.ObjectId, ref: 'Namespace' }
})

module.exports = model('Project', schema)