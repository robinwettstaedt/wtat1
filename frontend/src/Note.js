import React from 'react';
import { useParams } from 'react-router-dom';

function Note() {
  let params = useParams();

  return (
    <>
      <h1>Note {params.noteID}</h1>
      <input type="text"></input>
    </>
  );
}

export default Note;
