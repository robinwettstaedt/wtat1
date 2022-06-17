import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Notes() {
  const [notes, setNotes] = useState([]);

  const noteItems = notes.map((note) => (
    <li key={note._id}>
      <Link to={`/note/${note._id}`}>{note.title}</Link>
    </li>
  ));

  useEffect(() => {
    const fetchNotes = async () => {
      const response = await axios.get('http://localhost:5000/api/note');

      setNotes(response.data);
    };

    fetchNotes();
  }, []);

  return <>{noteItems}</>;
}

export default Notes;
