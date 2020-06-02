const line = require('./line')
const slack = require('./slack')

function main() {
  // const text = 'ヤマダ電機のMagic Trackpad 2 スペースグレイ（ https://www.yamada-denkiweb.com/5724467016 ）の在庫を監視するBotに変更しました'
  const text = 'A test succeeded!'
  line.notify(text)
  slack.notify(text)
}
main()
