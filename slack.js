const axios = require('axios')
async function notify(text) {
  return axios({
    url: 'https://hooks.slack.com/services/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',
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
