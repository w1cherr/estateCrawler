const puppeteer = require('puppeteer');
const mongoose = require("mongoose");
const EstateModel = require('./models/estateSchema')
const db = mongoose.connect('mongodb://localhost:27017/estateInfo')
const area = '芙蓉区'
const infoSource = '58同城'
const requstUrl = 'https://cs.58.com/furong/zhaozu/?key=%E5%86%99%E5%AD%97%E6%A5%BC&cmcskey=%E5%86%99%E5%AD%97%E6%A5%BC&final=1&specialtype=gls&classpolicy=main_A,house_A,job_A,service_A,car_A,sale_A'
const startPage = 1
const endPage = 10

// 随机生成max~min之间整数
function randNum(max, min) {
  return Math.floor(Math.random()*(max-min+1)+min);
}
// sleep函数，避免请求速度太快
function sleep(s) {
  return new Promise(resolve => setTimeout(resolve, s*1000))
}

const openOnePage = async (url) => {

  // 启动浏览器
  const browser = await puppeteer.launch({
    // 关闭无头模式，方便我们看到这个无头浏览器执行的过程
    headless: false,
  });
  // 打开页面
  const page = await browser.newPage();
  // 设置浏览器视窗
  page.setViewport({
    width: 1376,
    height: 768,
  });
  // 地址栏输入网页地址
  await page.goto(url);
  console.log('enter');

  // await getOnePageInfo(page)
  // // 关闭浏览器
  // await browser.close();
};

const getOnePageInfo = async (page) => {
  // await page.waitForSelector('.list-content');
  // let urls = await page.$eval('.list-content', element => {
  //   let HTMLCollection = element.querySelectorAll('a.list-item');
  //   let urlsArray = Array.prototype.slice.call(HTMLCollection);
  //   let links = urlsArray.map(item => {
  //     return item.getAttribute('href')
  //   });
  //   return links;
  // })
  // for (let i in urls) {
  //   await getEstateInfo(urls[i]);
  //   await sleep(randNum(3, 10))
  // }
  await sleep(8)
  page.click('.next')
  getOnePageInfo(page)
}

const getEstateInfo = async (url) => {
  // 启动浏览器
  const browser = await puppeteer.launch({
    // 关闭无头模式，方便我们看到这个无头浏览器执行的过程
    // headless: false,
  });
  const estatePage = await browser.newPage();
  // 设置浏览器视窗
  estatePage.setViewport({
    width: 1376,
    height: 768,
  });
  // 地址栏输入网页地址
  await estatePage.goto(url);
  await estatePage.waitForSelector('.basicinfo-wrapper');
  let estateInfo = await estatePage.$eval('.basicinfo-wrapper', element => {
    let name = element.querySelector('.name').innerText
    let company = element.querySelector('.company a').innerText
    let phone = element.querySelector('.tell-number').innerText.replace(/\s/ig,'')
    return {
      name,
      company,
      phone
    }
  })
  const estate = await EstateModel.findOne({phone: estateInfo.phone})
  if (!estate) {
    estateInfo.area = area
    estateInfo.infoSource = infoSource
    console.log('新增数据', estateInfo);
    EstateModel.create(estateInfo)
  } else {
    console.log('重复数据');
  }
  await browser.close();
}

const main = async function () {
  for (let i = startPage; i < endPage; i++) {
    console.log(`开始第${i}页`)
    let link = requstUrl + i + '/'
    await openOnePage(link);
  }
}
// main()
openOnePage(requstUrl)
