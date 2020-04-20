const axios = require('axios')
const dotenv = require('dotenv').config()
async function notify(text) {
  return axios({
    url: process.env.SLACK_URL,
    method: 'POST',
    data: {
      text: text,
      username: 'sharp mask',
      icon_emoji: 'mask'
    }
  }).then(res => Promise.resolve('Successfully Notified to Slack'))
    .catch(err => {
      console.log(err.response.data)
      Promise.reject('Notify to Slack error')
    })
}
module.exports.notify = notify
