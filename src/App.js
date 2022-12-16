import './App.css';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { FaGithub } from 'react-icons/fa';

const MAX_LENG = 45;
const MAX_NAME = 14;

const socket = io('https://minichat-socket-io.onrender.com/');

function App() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [btnDisabled, setBtnDisabled] = useState(true);
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
        body: cropText(message),
      },
      ...chat,
    ]);
    setMessage('');
    setBtnDisabled(true);
  };

  const cropText = (str) => {
    const arrText = str.split('');
    return arrText.reduce((a, b, i) => {
      if (i <= MAX_LENG) {
        return a + b;
      }
      return a;
    }, '');
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
      <div className='bg-zinc-900 p-7 app-container inputs'>
        <label htmlFor='name'>
          User Name
          <input
            autoComplete='off'
            type='text'
            name='name'
            id='name'
            placeholder='Your name > 2 and < 14'
            value={name}
            onChange={({ target: { value } }) => {
              value.length < MAX_NAME && setName(value);
              setIsDisabled(!(value.length > 2));
              setBtnDisabled(!(value.length > 2 && message.length > 0));
            }}
          />
        </label>
        <label htmlFor='text-ccontent' className='message-container'>
          Message
          <textarea
            disabled={isDisabled}
            autoComplete='off'
            rows='2'
            cols='25'
            value={message}
            onKeyDown={({ key }) => key === 'Enter' && handleClick()}
            type={'text'}
            name='message'
            id='message'
            placeholder='Insert a name to white a message'
            style={{ resize: 'none', padding: '5px', color: 'black' }}
            onChange={({ target: { value } }) => {
              value !== '\n' && value.length <= MAX_LENG && setMessage(value);
              setBtnDisabled(!(value.length > 0 && name.length > 2));
            }}
          />
          <div className='count'>{MAX_LENG - message.length}</div>
        </label>
        <button type='button' onClick={handleClick} disabled={btnDisabled}>
          Enviar
        </button>
        <a
          href='https://github.com/Megas-MDN/chat-react-socketio'
          target={'_blank'}
          rel='noreferrer'
        >
          <FaGithub size={35} className='icon' />
        </a>
      </div>
      <div className='chat-container bg-zinc-900'>
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
