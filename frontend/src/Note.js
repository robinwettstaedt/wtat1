import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Note() {
  let params = useParams();
  const navigate = useNavigate();

  const [currentNoteID, setCurrentNoteID] = useState(params.noteID);

  const [noteContent, setNoteContent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');

  const [editing, setEditing] = useState(false);
  const [isExistingNote, setIsExistingNote] = useState(false);

  const saveNote = async (event) => {
    event.preventDefault();

    // if the note is one that already existed, send a put request to update the note, otherwise create it
    if (isExistingNote) {
      await axios.put(`http://localhost:5000/api/note/${currentNoteID}`, {
        title: noteTitle,
        content: noteContent,
      });
    } else {
      const response = await axios.post('http://localhost:5000/api/note', {
        title: noteTitle,
        content: noteContent,
      });
      setIsExistingNote(true);
      setCurrentNoteID(response.data._id);
      navigate(`${currentNoteID}`);
    }
  };

  useEffect(() => {
    const fetchNote = async () => {
      const response = await axios.get(
        `http://localhost:5000/api/note/${currentNoteID}`
      );
      if (response.status === 200) {
        setIsExistingNote(true);
        setNoteTitle(response.data.title);
        setNoteContent(response.data.content);
      }
    };

    // if the accessed page is the page of an already existing note, the parameter will be the id of that note
    if (currentNoteID) {
      fetchNote();
    }
  }, [currentNoteID]);

  const handleTitleChange = (event) => {
    setNoteTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setNoteContent(event.target.value);
  };

  const handleEditChange = () => {
    setEditing(!editing);
  };

  const handleDelete = async () => {
    await axios.delete(`http://localhost:5000/api/note/${currentNoteID}`);
    navigate('/notebooks');
  };

  return (
    <>
      <form onSubmit={saveNote}>
        <fieldset disabled={!editing}>
          <label>Title : </label>
          <input
            type="text"
            placeholder="Your note's title..."
            name="title"
            required
            onChange={handleTitleChange}
            value={noteTitle}
          />
          <label>Content : </label>
          <textarea
            placeholder="write something..."
            name="content"
            required
            onChange={handleContentChange}
            value={noteContent}
          />
        </fieldset>
        <input type="submit" value="Save" />
      </form>
      {editing ? (
        <button onClick={handleEditChange}>Stop Editing</button>
      ) : (
        <button onClick={handleEditChange}>Edit</button>
      )}
      {isExistingNote && <button onClick={handleDelete}>Delete</button>}
    </>
  );
}

export default Note;
