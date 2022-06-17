import { Routes, Route } from 'react-router-dom';
import RequireAuth from './RequireAuth';

import Layout from './Layout';
import Note from './Note';
import Signup from './Singup';
import Signin from './Signin';
import Home from './Home';
import Notes from './Notes';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="signup" element={<Signup />} />
        <Route path="signin" element={<Signin />} />
        <Route path="/" element={<Home />} />
        <Route element={<RequireAuth />}>
          <Route path="notes" element={<Notes />} />
          <Route path="note" element={<Note />}>
            <Route path=":noteID" element={<Note />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
