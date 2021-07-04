import { useState } from 'react';
import { useHistory } from 'react-router';
import styles from './login.module.scss';

export const Login = () => {
  const history = useHistory();

  const [usernameInput, setUernameInput] = useState('');

  const enter = () => {
    const trimmed = usernameInput.trim();

    if (!trimmed) return;

    localStorage.setItem('login', trimmed);

    history.push('/chat');
  }

  return (
    <div>
      <input type="text" placeholder="Enter your login" onChange={(e) => setUernameInput(e.target.value)} />
      <button onClick={enter}>Enter</button>
    </div>
  )
}
