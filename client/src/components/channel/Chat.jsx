import React, { useEffect, useRef, useState } from 'react';
import ScrollToBottom from "react-scroll-to-bottom";
import style from './Chat.module.css';
import { useChessboardContext } from '../../context/boardContext';
import Picker from 'emoji-picker-react';
import { useAuth } from '../../context/authContext';
import soundChat from '../../path/to/sonicChat.mp3'
import {Container, Stack} from 'react-bootstrap';

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 725);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isView,setIsView] = useState(window.innerWidth <= 725);
  const {setView, chessColor} = useChessboardContext();
  const {auth} = useAuth();
  const chatAudio = new Audio(soundChat);
  const scroll = useRef();

  useEffect(()=>{
    scroll?.current?.scrollIntoView({behavior: 'smooth'})
  },[currentMessage]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 725);
      setIsView(window.innerWidth <= 725);
      setView(window.innerWidth <= 725)
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

 

  useEffect(() => {
    console.log('isMobileView', isMobileView);
  
  }, [isMobileView]);
  
  const sendMessage = async () => {
    if(socket === null) return;
    if (currentMessage !== '' ) {
      const messageData = {
        room,
        author: username,
        message: currentMessage,
        photo: auth?.user?.photo,
        times: new Date().getTime(),
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  const mobileView = () => {
    if(window.innerWidth <= 725){
      setIsMobileView(prevState => !prevState);
      setView(prev => !prev);
    }

  }

  useEffect(() => {
    if (socket === null) return;
  
    socket.on("receive_message", (response) => {
      setMessageList((list) => {
        // Verificar si el mensaje ya existe en la lista
        const messageExists = list.some(
          (msg) =>
            msg.author === response.author &&
            msg.message === response.message &&
            msg.times === response.times
        );
  
        // Solo añadir el mensaje si no existe
        if (!messageExists) {
          return [...list, response];
        }
  
        return list;
      });
      chatAudio.play();
      console.log("receive_message", response);
    });
  
    // Limpiar el evento al desmontar el componente
    return () => {
      if (socket) {
        socket.off("receive_message");
      }
    };
  }, [socket]);
  

  return (
    <div gap={4} className={style.chatBox} style={{backgroundImage: `url(${chessColor.fondoChat})`}} >
      <div 
        className={style.chatHeader}
        style={{borderBottom: `1px solid ${chessColor.color}`, color: chessColor.color}}

      >
        <strong>Live Chat</strong>
      </div>
      <div
        className={style.messages} 
      >
          {messageList.map((messageContent, index) => {
            return (
              <div
                className={style.message}
                id={username === messageContent.author ? style.you: style.other}
                key={index} // Agregar una clave única
                ref={scroll}
              >
                <div className={style.containerContentMeta}>
                  <div className={style.containerProfileMessage}>
                    { username === messageContent.author && <img className={style.profile} src={messageContent?.photo} alt='' />}                  
                    <div className={style.messagecontent}>
                      <p>{messageContent.message}</p>
                    </div>
                    { username !== messageContent.author && <img className={style.profile} src={messageContent?.photo} alt='' />}                  

                  </div>
                  <div className={style.messagemeta} >
                    <p id={style.time} style={{color: chessColor.color}}>{messageContent.time}</p>
                    <p id={style.author} style={{color: chessColor.color}}>{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <Stack direction='horizontal' gap={3} className={`${style.chatInput}  flex-grow-0`} >
        <button
            className={style.emojibutton}
            onClick={() => setShowEmoji(!showEmoji)}
        >
          😀
        </button>
        <input
          className={style.inputMessage} 
          type="text"
          value={currentMessage}
          placeholder="Message..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
            
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />

        <button onClick={sendMessage} className={style.sendBtn}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
          </svg>
        </button>
      </Stack>
      <div>
      <div>
     { showEmoji && 
       <div className={style.emojipicker }>
           <Picker onEmojiClick={(emojiObject,event ) => {
            setCurrentMessage(prev =>  prev + emojiObject.emoji);
            setShowEmoji(false);
          }} />
       </div>
     }
    </div>

      </div>
    </div>
  );
}

export default Chat;
