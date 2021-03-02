import axios from 'axios'

const sendMessage = (message) => {
  axios.post('https://hooks.slack.com/services/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', {
    text: message
  })
}

export default { sendMessage }
