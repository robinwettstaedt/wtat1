import { authContext } from './context/authContext';

function App() {
  <authContext.Provider value={token}></authContext.Provider>;
  return <div></div>;
}

export default App;
