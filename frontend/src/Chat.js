import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const newSocket = io.connect(`http://localhost:5000`);
    setSocket(newSocket);
    console.log('connected to socket');
    return () => newSocket.close();
  }, []);

  const handleChange = (event) => {
    setMessage(event.target.value);

    console.log('value is:', event.target.value);
  };

  const handleSubmit = () => {
    console.log(message);
    socket.emit('message', message);
  };

  return (
    <>
      {socket ? (
        <div className="chat-container">
          <input onChange={handleChange} type="text" value={message} />
          <button onClick={handleSubmit}>Click</button>
        </div>
      ) : (
        <div>Not Connected</div>
      )}
    </>
  );
};

export default Chat;
