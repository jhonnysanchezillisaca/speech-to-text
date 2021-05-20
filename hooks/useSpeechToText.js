// import {
//     SpeechConfig, AudioConfig, SpeechRecognizer,
//   } from 'microsoft-cognitiveservices-speech-sdk';
//   import { useRef, useState } from 'react';
//   import { getSpeechToken } from '../services/agent';
  
//   const useSpeechToText = () => {
//     const [displayText, setDisplayText] = useState('Upload an audio file or speak into your microphone');
//     const [tempDisplayText, setTempDisplayText] = useState('');
//     const [isRecognizingFile, setIsRecognizingFile] = useState(false);
//     const fileRecognizerInstance = useRef(null);
  
//     const stopFileTranscription = () => {
//       setIsRecognizingFile(false);
//       fileRecognizerInstance.current = null;
//     };
  
//     const fetchTextFromFile = async (audioFile) => {
//       if (audioFile.name.split('.').pop() !== 'wav') {
//         setDisplayText('ERROR: File must be .wav sound file.');
//         return;
//       }
//       const { token, region } = await getSpeechToken();
//       const speechConfig = SpeechConfig.fromAuthorizationToken(token, region);
//       speechConfig.speechRecognitionLanguage = 'es-ES';
//       speechConfig.enableDictation();
//       const audioConfig = AudioConfig.fromWavFileInput(audioFile);
//       const recognizer = new SpeechRecognizer(speechConfig, audioConfig);
//       fileRecognizerInstance.current = recognizer;
//       if (fileRecognizerInstance.current) {
//         setDisplayText(`${audioFile.name} size=${audioFile.size} bytes`);
//         fileRecognizerInstance.current.recognizing = (_, event) => {
//           setTempDisplayText(event.result.text);
//         };
//         fileRecognizerInstance.current.recognized = (_, event) => {
//           setDisplayText((prev) => prev + event.result.text);
//           setTempDisplayText('');
//         };
//         fileRecognizerInstance.current.sessionStopped = () => {
//           setIsRecognizingFile(false);
//         };
//         fileRecognizerInstance.current.startContinuousRecognitionAsync(
//           () => { setIsRecognizingFile(true); },
//           () => {
//             setDisplayText('ERROR: Speech was cancelled or could not be recognized.');
//             setIsRecognizingFile(false);
//           },
//         );
//       }
//     };
  
//     return {
//       displayText,
//       tempDisplayText,
//       fetchTextFromFile,
//       stopFileTranscription,
//       isRecognizingFile,
//     };
//   };
  
//   export default useSpeechToText;
  