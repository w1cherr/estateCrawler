const mongoose = require('mongoose')

const estateSchema = mongoose.Schema({
  name: String,
  company: String,
  phone: String,
  infoSource: String,
  area: String,
  createTime: Date
}, {collection: 'estateInfo'})
//这里mongoose.Schema要写上第二个参数，明确指定到数据库中的哪个表取数据


const estate = module.exports = mongoose.model('estateInfo', estateSchema);
