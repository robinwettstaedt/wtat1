import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';

import './index.css';
import App from './App';
import Note from './Note';
import Signup from './Singup';
import Signin from './Signin';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="signup" element={<Signup />} />
      <Route path="signin" element={<Signin />} />
      <Route path="note" element={<Note />}>
        <Route path=":noteID" element={<Note />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
