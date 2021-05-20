import axios from 'axios';
import Cookie from 'universal-cookie';
import {
  speechTokenUrl,
} from './constants';

export const getSpeechToken = async () => {
  const cookie = new Cookie();
  const speechToken = cookie.get('speech-token');

  if (!speechToken) {
    try {
      const res = await axios.get(speechTokenUrl);
      const { token, region } = res.data;
      cookie.set('speech-token', `${region}:${token}`, { maxAge: 540, path: '/' });
      return { token, region };
    } catch (err) {
      throw new Error(err.message ?? err);
    }
  } else {
    const idx = speechToken.indexOf(':');
    return { token: speechToken.slice(idx + 1), region: speechToken.slice(0, idx) };
  }
};
