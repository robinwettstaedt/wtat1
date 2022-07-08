import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from './hooks/useAuth';

function Signin() {
  const navigate = useNavigate();
  const { token, setToken } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axios.post('http://localhost:5000/auth/signin', {
      username: username,
      password: password,
    });

    if (response.status === 200) {
      if (response.data.accessToken) {
        setToken(response.data.accessToken);
      }

      navigate('/notebooks');
    } else {
      alert('Wrong Username and Password combination!');
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return token ? (
    <>
      <h1>You are already logged in!</h1>
    </>
  ) : (
    <form onSubmit={handleSubmit}>
      <label>Username : </label>
      <input
        type="text"
        placeholder="Enter Username"
        name="username"
        required
        onChange={handleUsernameChange}
      />
      <label>Password : </label>
      <input
        type="password"
        placeholder="Enter Password"
        name="password"
        required
        onChange={handlePasswordChange}
      />
      <input type="submit" value="Sign In" />
    </form>
  );
}

export default Signin;
