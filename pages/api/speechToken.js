const speechsdk = require('microsoft-cognitiveservices-speech-sdk')
const axios = require('axios')


const tokenUrl = `https://${process.env.SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`;

const speechToken = async (_, res) => {
  const { data } = await axios.post(tokenUrl, null, {
    headers: {
      'Ocp-Apim-Subscription-Key': process.env.SPEECH_KEY,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  res.status(200).json({ token: data, region: process.env.SPEECH_REGION });
};

export default speechToken;