const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

const LINE_ROOM_TOKEN = process.env.LINE_ROOM_TOKEN
async function notify(text) {
  let params = new URLSearchParams()
  params.append('message', text)
  return axios({
    url: 'https://notify-api.line.me/api/notify',
    headers: {
      "Authorization": `Bearer ${LINE_ROOM_TOKEN}`,
      "Content-Type": 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    data: params
  })
    .then(res => Promise.resolve('Successfully Notified to LINE'))
    .catch(err => {
      console.log(err.response.data)
      Promise.reject('Notify to LINE error')
    })
}
module.exports.notify = notify
