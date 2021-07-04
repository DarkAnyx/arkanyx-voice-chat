import { useHistory } from 'react-router';

export const LoginChecker = () => {
  const history = useHistory();
  const login = localStorage.getItem('login');

  if (login) history.push('/chat');
  if (!login) history.push('/login');


  return null;
}
