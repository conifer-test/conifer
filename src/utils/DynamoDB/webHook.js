const axios = require('axios');

async function sendWebhooks(data) {
  const webhookURL = 'http://localhost:5001/api/testFileUpdated';
  try {
    await axios.post(webhookURL, data);
  } catch (error) {
    console.log(error);
  }
}

module.exports = sendWebhooks;
