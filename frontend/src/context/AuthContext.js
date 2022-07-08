import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState('');

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const refreshAccess = async () => {
      const response = await axios.post(
        'http://localhost:5000/auth/refreshaccess'
      );

      if (response.status === 201) {
        if (response.data.accessToken) {
          setToken(response.data.accessToken);
          // set the current token as the auth header for every request made with axios
          axios.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${response.data.accessToken}`;
        }
      }
    };

    refreshAccess();
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
