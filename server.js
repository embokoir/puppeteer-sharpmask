const puppeteer = require('puppeteer')
const fs = require('fs').promises
const express = require('express')
const line = require('./line')

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

  const prevValue1 = await fs.readFile('value1.txt', 'utf8', (err, data) => {
    if (err) console.log(err)
    return data
  })
  const prevValue2 = await fs.readFile('value2.txt', 'utf8', (err, data) => {
    if (err) console.log(err)
    return data
  })

  const value1 = await page.$eval('#top1 > div > main > article > div.text', elm => elm.textContent.trim())
        .catch(async err => {
          console.log(err)
          process.exit(1)
        })

  const value2 = await page.$eval('#top1 > div > main > article > div:nth-child(4) > span:nth-child(1)', elm => elm.textContent.trim())
        .catch(async err => {
          console.log(err)
          process.exit(1)
        })

  if (!(value1 == prevValue1 && value2 === prevValue2)) {
    line.notify(`something changed!\ncheck ${url}`)
  }
  await fs.writeFile('value1.txt', new Uint8Array(Buffer.from(value1)), 'utf8', err => {
    if (err) throw err
    console.log('new value1 set')
  })
  await fs.writeFile('value2.txt', new Uint8Array(Buffer.from(value2)), 'utf8', err => {
    if (err) throw err
    console.log('new value2 set')
  })

  // Close
  await browser.close()
}
