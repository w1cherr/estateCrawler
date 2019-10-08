const puppeteer = require('puppeteer');
const mongoose = require("mongoose");
const EstateModel = require('./models/estateSchema')
const db = mongoose.connect('mongodb://localhost:27017/estateInfo')
const area = '天心区'
const infoSource = '58同城'
const requstUrl = 'https://cs.58.com/tianxinqu/zhaozu/pn'
const startPage = 1
const endPage = 14
let nowPage = startPage

// 随机生成max~min之间整数
function randNum(max, min) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// sleep函数，避免请求速度太快
function sleep(s) {
  return new Promise(resolve => setTimeout(resolve, s * 1000))
}

const openOnePage = async (url) => {

  // 启动浏览器
  const browser = await puppeteer.launch({
    // 关闭无头模式，方便我们看到这个无头浏览器执行的过程
    // headless: false,
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

  await getOnePageInfo(page)
  // // 关闭浏览器
  // await browser.close();
};

const getOnePageInfo = async (page) => {
  await page.waitForSelector('#house-list-wrap');
  let urls = []
  try {
    urls = await page.$eval('#house-list-wrap', element => {
      let HTMLCollection = element.querySelectorAll('li > h2 > a');
      let urlsArray = Array.prototype.slice.call(HTMLCollection);
      let links = urlsArray.map(item => {
        return item.getAttribute('href')
      });
      return links;
    })
  } catch (e) {
    console.log(e);
  }
  for (let i in urls) {
    await getEstateInfo(urls[i]);
    await sleep(randNum(3, 10))
  }
  page.click('.next')
  nowPage++
  console.log(`开始第${nowPage}页`)
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
  await estatePage.waitForSelector('.house-basic-right');
  let estateInfo = {}
  try {
    estateInfo = await estatePage.$eval('.house-basic-right', element => {
      let name = element.querySelector('.poster-name').innerText
      let company = element.querySelector('.poster-company-4').innerText
      let phone = element.querySelector('.phone-num').innerText.replace(/\s/ig, '')
      return {
        name,
        company,
        phone
      }
    })
  } catch (e) {
    console.log(e);
  }
  if (estateInfo !== {}) {
    const estate = await EstateModel.findOne({phone: estateInfo.phone})
    if (!estate) {
      estateInfo.area = area
      estateInfo.infoSource = infoSource
      console.log('新增数据', estateInfo);
      estateInfo.createTime = new Date()
      EstateModel.create(estateInfo)
    } else {
      console.log('重复数据', estateInfo.phone);
    }
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
openOnePage(requstUrl + startPage)
