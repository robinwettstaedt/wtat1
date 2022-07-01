import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Notebook(notebook) {
  const [currentNotebookId, setCurrentNotebookId] = useState(notebook._id);
  const [dropdownOpen, setDropdownOpen] = useState('');

  const noteItems = notebook.notes.map((note) => (
    <li key={note._id}>
      <Link to={`/note/${note._id}`}>{note.title}</Link>
    </li>
  ));

  const handleDelete = async () => {
    await axios.delete(
      `http://localhost:5000/api/notebook/${currentNotebookId}`
    );
  };

  const handleOpenDropdown = () => {
    setDropdownOpen(true);
  };

  return (
    <>
      <div onClick={handleOpenDropdown}></div>
      {dropdownOpen && noteItems}
    </>
  );
}

export default Notebook;
