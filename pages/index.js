import { MoonIcon } from '@heroicons/react/outline'
import Head from 'next/head'
import Image from 'next/image'
import { useState, useRef } from 'react'
import Layout from '../components/Layout'
import {
  SpeechConfig, AudioConfig, SpeechRecognizer,
} from 'microsoft-cognitiveservices-speech-sdk';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getSpeechToken } from '../services/agent';

export default function Home() {
  const [displayText, setDisplayText] = useState('');
  const [tempDisplayText, setTempDisplayText] = useState('');
  const [isRecognizingFile, setIsRecognizingFile] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const fileRecognizerInstance = useRef(null);


  const stopFileTranscription = () => {
    console.log('stopping')
    fileRecognizerInstance.current.stopContinuousRecognitionAsync(() => setIsRecognizingFile(false));
    fileRecognizerInstance.current = null;
  };

  const secondsToTime = (s) => new Date(s * 1000).toISOString().substr(11, 8)

  async function fileChange(e) {
    const audioFile = e.target.files[0];

    if (audioFile.name.split('.').pop() !== 'wav') {
      setDisplayText('ERROR: File must be .wav sound file.');
      return;
    }

    const { token, region } = await getSpeechToken();
    console.log({ token, region })
    const speechConfig = SpeechConfig.fromAuthorizationToken(token, region);
    speechConfig.speechRecognitionLanguage = 'es-ES';
    speechConfig.enableDictation();
    const audioConfig = AudioConfig.fromWavFileInput(audioFile);
    const recognizer = new SpeechRecognizer(speechConfig, audioConfig);
    fileRecognizerInstance.current = recognizer;
    if (fileRecognizerInstance.current) {
      // setDisplayText(`${audioFile.name} size=${audioFile.size} bytes`);
      fileRecognizerInstance.current.recognizing = (_, event) => {
        setTempDisplayText(event.result.text);
      };
      fileRecognizerInstance.current.recognized = (_, event) => {
        const textToAdd = `[${secondsToTime(event.result.privOffset / 10000000)}] - ${event.result.text}\n`
        setDisplayText((prev) => prev + textToAdd);
        console.log(event.result)
        setTempDisplayText('');
      };
      fileRecognizerInstance.current.sessionStopped = () => {
        setIsRecognizingFile(false);
      };
      fileRecognizerInstance.current.startContinuousRecognitionAsync(
        () => { setIsRecognizingFile(true); },
        () => {
          setDisplayText('ERROR: Speech was cancelled or could not be recognized.');
          setIsRecognizingFile(false);
        },
      );
    }

    // console.log(audioFile);
    // const fileInfo = audioFile.name + ` size=${audioFile.size} bytes `;

    // setDisplayText(fileInfo);

    // const result = await postFile(audioFile);

    // setDisplayText(result);
  }

  return (
    <>
      <Head>
        <title>Trancribe audios</title>
        <meta name="description" content="App to transcribe audios" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <h2 className='text-2xl'>Convert speech to text from an audio file.</h2>
        <div className="flex mt-8 text-lg">
          <label className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" htmlFor="audio-file">
            <svg class={`${isRecognizingFile ? 'animate-spin' : 'hidden'} -ml-1 mr-3 h-5 w-5 text-white`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <MoonIcon className="h-6 w-6 mr-2 inline-flex" />
            {isRecognizingFile ? 'Processing file' : 'Click to select a .wav audio file'}
          </label>
          <input
            type="file"
            id="audio-file"
            onChange={(e) => fileChange(e)}
            style={{ display: "none" }}
          />
          <div className="mx-8">
            {
              isRecognizingFile &&
              <button
                type="button"
                onClick={() => stopFileTranscription()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Stop
            </button>
            }
          </div>
          {
            displayText &&
            <CopyToClipboard text={displayText}
              onCopy={() => setIsCopied(true)}>
              <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Copy to clipboard</button>
            </CopyToClipboard>
          }

          {isCopied ? <span style={{ color: 'red' }}>Copied.</span> : null}

        </div>

        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8 overflow-scroll" style={{whiteSpace: 'pre-wrap'}} >
            <p dangerouslySetInnerHTML={{ __html: displayText || 'Ready' }}></p>
            {/* <p>display temp text: {tempDisplayText}</p> */}
          </div>
          <div className="bg-gray-200 font-light w-4/5 mx-auto">
            <p>{tempDisplayText}</p>
          </div>
        </div>
      </Layout>
    </>
  )
}
