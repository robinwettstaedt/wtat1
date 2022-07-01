import { useState } from 'react';
import axios from 'axios';

function CreateNotebook() {
  const [title, setTitle] = useState();

  const handleCreateNotebook = async () => {
    await axios.post('http://localhost:5000/api/notebook', {
      title: title,
    });
  };

  return (
    <>
      <input
        onChange={(e) => setTitle(e.target.value)}
        type="text"
        placeholder="Title of your new notebook"
      />
      <button onClick={handleCreateNotebook}>Create Notebook</button>
    </>
  );
}

export default CreateNotebook;
