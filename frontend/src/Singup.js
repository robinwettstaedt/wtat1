import React from 'react';
import axios from 'axios';

function Signup() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axios.post('http://localhost:5000/auth/signup', {
      username: username,
      password: password,
    });
    console.log(response);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
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
