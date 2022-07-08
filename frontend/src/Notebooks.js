import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Notebook from './Notebook';
import styled from 'styled-components';

function Notebooks() {
  const [notebooks, setNotebooks] = useState([]);

  const notebookItems = notebooks.map((notebook) => (
    <StyledListEntry key={notebook._id}>
      <Notebook notebook={notebook} />
    </StyledListEntry>
  ));

  useEffect(() => {
    const fetchNotebooks = async () => {
      const response = await axios.get('http://localhost:5000/api/notebook');
      setNotebooks(response.data);
    };

    fetchNotebooks();
  }, []);

  return (
    <>
      <StyledLink to="/create-notebook">Create new Notebook</StyledLink>
      {notebookItems}
    </>
  );
}

const StyledLink = styled(Link)``;

const StyledListEntry = styled.li`
  list-style-type: none;
`;
export default Notebooks;
