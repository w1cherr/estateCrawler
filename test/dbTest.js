const mongoose = require("mongoose");
const EstateModel = require('../models/estateSchema')
var db = mongoose.connect('mongodb://localhost:27017/estateInfo');

async function getPic() {
  const admin = await EstateModel.findOne({phone: '138749117413'})
  if (!admin) {
    console.log('none');
    EstateModel.create({
      name: '我是新来的',
      phone: '110',
      createTime: new Date()
    })
  } else {
    console.log(admin);
  }
}

getPic();

// function randNum(max, min) {
//   return Math.floor(Math.random()*(max-min+1)+min);
// }
// function sleep(s) {
//   console.log('睡：', s)
//   return new Promise(resolve => setTimeout(resolve, s*1000))
// }
// async function test () {
//   for (let i = 0; i<=4; i++ ) {
//     console.log(i)
//     await sleep(randNum(1, 5))
//   }
// }
// test()
