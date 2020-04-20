const puppeteer = require('puppeteer')
const fs = require('fs').promises
const express = require('express')

const line = require('./line')
const slack = require('./slack')

const app = express()
app.get('/', async (req, res) => {
  await main()
  await console.log('app ran')
  await res.send('GET /')
})
app.listen(3000)
console.log('Listening on 3000...')

async function main() {
  const url = 'https://cocorolife.jp.sharp/mask/'

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 1000 })
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'ja'
  })
  await page.goto(url, { waitUntil: 'domcontentloaded' })

  const prevValue = await fs.readFile('value.txt', 'utf8', (err, data) => {
    if (err) console.log(err)
    return data
  })

  const value = await page.$eval('body', elm => elm.textContent.trim())
        .catch(async err => {
          console.log(err)
        })

  // 値が異なる、または要素を見つけられない場合に通知
  if (!(value == prevValue) || !value) {
    const text = `something changed!\ncheck ${url}`
    line.notify(text)
    slack.notify(text)
  } else {
    console.log('nothing to notify')
  }
  await fs.writeFile('value.txt', value, 'utf8', err => {
    if (err) throw err
    console.log('new value set')
  })

  // Close
  await browser.close()
}
