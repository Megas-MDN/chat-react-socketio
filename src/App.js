import './App.css';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
// import Login from './components/Login';
// import './components/Login.css';
// import SingUp from './components/SingUp';

const socket = io('https://minichat-socket-io.onrender.com/');

function App() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    const receiveData = ({ name: from, message: body, id }) => {
      setChat([
        {
          id,
          from,
          body,
        },
        ...chat,
      ]);
    };
    socket.on('message', receiveData);

    return () => socket.off('message', receiveData);
  }, [chat]);

  const handleClick = () => {
    socket.emit('message', { name, message });
    setChat([
      {
        id: 'Me',
        from: name,
        body: message,
      },
      ...chat,
    ]);
    setMessage('');
  };

  return (
    <div
      className='h-screen
     bg-zinc-800 text-white
      flex items-center justify-center app-container'
    >
      <h1 className=' text-3xl mb-5'>Simple Chat with Socket.io</h1>
      <p className='attention'>
        With two or more screens you can send and receive the text messages.
        Attention: sent messages are not saved.
      </p>
      <div className='bg-zinc-900 p-10 app-container'>
        <label htmlFor='name'>
          User Name
          <input
            autoComplete='off'
            type='text'
            name='name'
            id='name'
            placeholder='Insert your name'
            value={name}
            onChange={({ target: { value } }) => setName(value)}
          />
        </label>
        <label htmlFor='text-ccontent' className='pass-container'>
          Message
          <textarea
            autoComplete='off'
            rows='2'
            cols='25'
            value={message}
            onKeyDown={({ key }) => key === 'Enter' && handleClick()}
            type={'text'}
            name='message'
            id='message'
            placeholder='message'
            style={{ resize: 'none', padding: '5px', color: 'black' }}
            onChange={({ target: { value } }) =>
              value !== '\n' && setMessage(value)
            }
          />
        </label>
        <button type='button' onClick={handleClick}>
          Enviar
        </button>
      </div>
      <div className='chat-container'>
        {chat.map(({ body, from, id }, i) => (
          <div
            key={id + i}
            className='message-container'
          >{`${from}: ${body}`}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
