import { createContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  axios.defaults.withCredentials = true;

  //   useEffect(() => {
  //     // set the current token as the auth header for every request made with axios
  //     // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  //   }, [token]);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
