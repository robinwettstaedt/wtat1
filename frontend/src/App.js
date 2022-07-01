import { Routes, Route } from 'react-router-dom';
import RequireAuth from './RequireAuth';

import Layout from './Layout';
import Note from './Note';
import Signup from './Singup';
import Signin from './Signin';
import Home from './Home';
import Notes from './Notes';
import Notebook from './Notebook';
import Notebooks from './Notebooks';
import CreateNotebook from './CreateNotebook';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="signup" element={<Signup />} />s
        <Route path="signin" element={<Signin />} />
        <Route path="/" element={<Home />} />
        <Route element={<RequireAuth />}>
          <Route path="notebooks" element={<Notebooks />} />
          <Route path="notebook" element={<CreateNotebook />}>
            <Route path=":notebookId" element={<Notebook />} />
          </Route>
          <Route path="notes" element={<Notes />} />
          <Route path="note" element={<Note />}>
            <Route path=":noteId" element={<Note />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
