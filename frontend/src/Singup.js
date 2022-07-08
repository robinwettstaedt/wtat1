import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from './hooks/useAuth';

function Signup() {
  const navigate = useNavigate();
  const { token, setToken } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axios.post('http://localhost:5000/auth/signup', {
      username: username,
      password: password,
    });

    if (response.status === 201) {
      if (response.data.accessToken) {
        setToken(response.data.accessToken);
      }

      setToken(true);
      navigate('/notebooks');
    } else {
      alert('User could not be created! Please try another username.');
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
      <input type="submit" value="Sign Up" />
    </form>
  );
}

export default Signup;
