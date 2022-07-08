import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

function Notebook(notebook) {
  const [currentNotebookId, setCurrentNotebookId] = useState(
    notebook.notebook._id
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const noteItems = notebook.notebook.notes.map((note) => (
    <li key={note._id}>
      <Link to={`/notebook/${notebook.notebook._id}/note/${note._id}`}>
        {note.title}
      </Link>
    </li>
  ));

  //   const handleDelete = async () => {
  //     await axios.delete(
  //       `http://localhost:5000/api/notebook/${currentNotebookId}`
  //     );
  //   };

  const handleOpenDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
      <div onClick={handleOpenDropdown}>{notebook.notebook.title}</div>
      <StyledAddNoteLink to={`/notebook/${notebook.notebook._id}/note`}>
        Add Note
      </StyledAddNoteLink>
      {dropdownOpen && <ul>{noteItems}</ul>}
    </>
  );
}

const StyledAddNoteLink = styled(Link)``;
export default Notebook;
