



const puppeteer = require('puppeteer');

const saveScreenshot = async (url) => {

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

  await page.waitForSelector('#house-list-wrap');
  let urls = await page.$eval('#house-list-wrap', element => {
    let HTMLCollection = element.querySelectorAll('li > h2 > a');
    let urlsArray = Array.prototype.slice.call(HTMLCollection);
    let links = urlsArray.map(item => {
      return item.getAttribute('href')
    });
    return links;
  })
  console.log(`书架上共找到${urls.length}本书`);

  // let aTagerList = await page.$('body > div.list-page > div.layout > div.list-content' > a.list-item)
  // console.log(aTagerList);
  // let urlList = aTagerList.map(a => {
  //   return a.href
  // })
  // console.log(urlList);


  // 截图: https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagescreenshotoptions
  // await page.screenshot({ path });
  // 关闭浏览器
  // await browser.close();
};

module.exports = saveScreenshot;


if (require.main === module) {
  // for test
  saveScreenshot('https://cs.58.com/furong/zhaozu/pn5');
}
