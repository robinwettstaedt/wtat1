import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Notebook from './Notebook';

function Notebooks() {
  const [notebooks, setNotebooks] = useState([]);

  const notebookItems = notebooks.map((notebook) => (
    <li key={notebook._id}>
      <Notebook notebook={notebook} />
    </li>
  ));

  useEffect(() => {
    const fetchNotebooks = async () => {
      const response = await axios.get('http://localhost:5000/api/notebook');

      setNotebooks(response.data);
    };

    fetchNotebooks();
  }, []);

  const handleCreateNotebook = async () => {
    const response = await axios.post('http://localhost:5000/api/notebook');

    setNotebooks(response.data);
  };
  return (
    <>
      <button onClick={handleCreateNotebook}>Create new Notebook</button>
      {notebookItems}
    </>
  );
}

export default Notebooks;
