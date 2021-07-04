import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './chat.module.scss';
import moment from 'moment';

export const Chat = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const [audioBlob, setAudioBlob] = useState<Blob>();

  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    const response = await axios.get('http://arkanyx.com:3333/api/messages');
    const sorted = response.data.messages.sort((a: any, b: any) => +a.date - +b.date);

    setMessages(sorted);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const startRecording = async () => {
    setIsRecording(true);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    const audioChunks: Blob[] = [];

    mediaRecorder.start();

    mediaRecorder.addEventListener('dataavailable', (event) => {
      console.log(event.data);
      audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener('stop', () => {
      console.log(audioChunks);
      const audioBlob = new Blob(audioChunks);
      setAudioBlob(audioBlob);
    });

    setMediaRecorder(mediaRecorder);
  };

  const stopRecording = () => {
    setIsRecording(false);

    mediaRecorder?.stop();
  }

  const toggleRecord = () => {
    if (!isRecording) return startRecording();
    if (isRecording) return stopRecording();
  }

  const play = () => {
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    audio.play();
  }

  const send = async () => {
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append('username', localStorage.getItem('login') || 'Пидор без логина');
    formData.append('message', audioBlob);

    await axios.post('http://arkanyx.com:3333/api/messages/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    setAudioBlob(undefined);

    await fetchMessages();
  };

  return (
    <div>
      <div>
        {messages.map(({ login, url, date }) => (
          <div>
            <div>{login} {moment(+date).fromNow()}</div>
            <audio src={`http://arkanyx.com:3333${url}`} controls />
          </div>
        ))}
      </div>
      <div>
        <button onClick={toggleRecord}>{isRecording ? 'Stop' : 'Record'}</button>
        <button onClick={play} disabled={isRecording}>Play</button>
        <button onClick={send} disabled={!audioBlob || isRecording}>Send</button>
      </div>
    </div>

  );
}


