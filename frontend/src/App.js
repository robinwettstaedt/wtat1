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
import Chat from './Chat';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="chat" element={<Chat />} />
        <Route path="signup" element={<Signup />} />
        <Route path="signin" element={<Signin />} />
        <Route path="/" element={<Home />} />
        <Route element={<RequireAuth />}>
          <Route path="notebooks" element={<Notebooks />} />
          <Route path="create-notebook" element={<CreateNotebook />} />
          <Route path="notebook">
            <Route path=":notebookId">
              <Route index element={<Notebook />} />
              <Route path="notes" element={<Notes />} />
              <Route path="note" element={<Note />}>
                <Route path=":noteId" element={<Note />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
