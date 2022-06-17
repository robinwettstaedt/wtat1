import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Note() {
  let params = useParams();

  const [noteContent, setNoteContent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');

  const saveNote = async (event) => {
    event.preventDefault();
    await axios.post('http://localhost:5000/api/note', {
      title: noteTitle,
      content: noteContent,
    });
  };

  useEffect(() => {
    const fetchNote = async () => {
      const response = await axios.get(
        `http://localhost:5000/api/note/${params.noteID}`
      );

      setNoteTitle(response.data.title);
      setNoteContent(response.data.content);
    };
    if (params.noteID) {
      fetchNote();
    }
  }, []);

  const handleTitleChange = (event) => {
    setNoteTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setNoteContent(event.target.value);
  };

  return (
    <form onSubmit={saveNote}>
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
      <input type="submit" value="Save" />
    </form>
  );
}

export default Note;
