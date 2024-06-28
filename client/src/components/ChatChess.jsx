import React, { useEffect, useRef, useState } from 'react';
import ScrollToBottom from "react-scroll-to-bottom";

import style from './ChatChess.module.css';
import { useChessboardContext } from '../context/boardContext';

function ChatChess({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 690);
  const [isView,setIsView] = useState(window.innerWidth <= 690);
  const {setView, boardColor} = useChessboardContext();
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 690);
      setIsView(window.innerWidth <= 690);
      setView(window.innerWidth <= 690)
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

 

  useEffect(() => {
    
  }, [isMobileView]);
  
  const sendMessage = async () => {
    if(socket === null) return;
    if (currentMessage !== '') {
      const messageData = {
        room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  const mobileView = () => {
    if(window.innerWidth <= 690){
      setIsMobileView(prevState => !prevState);
      setView(prev => !prev);
    }

  }

  useEffect(() => {
    if(socket === null) return;
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className={style.chatwindow} style={isMobileView ? {height: '3.2rem', marginLeft: '0'}: {}}>
      <div className={style.chatheader}  onClick={()=> mobileView()}>
        <p>Live Chat</p>
      </div>
      <div className={style.chatbody}  style={window.innerWidth <= 690 && isMobileView ? { display: 'none', background: boardColor?.register } : {background: boardColor?.register}}  
       >
        <ScrollToBottom className={style.messagecontainer}>
          {messageList.map((messageContent, index) => {
            return (
              <div
                className={style.message}
                id={username === messageContent.author ? style.you: style.other}
                key={index} // Agregar una clave única
              >
                <div>
                  <div className={style.messagecontent} style = {username === messageContent.author ? {background: boardColor?.blackRow} : {background: boardColor?.whiteRow, color: boardColor?.blackRow}}>
                    <p style = {username === messageContent.author ? {} : { color: boardColor?.blackRow}}>{messageContent.message}</p>
                  </div>
                  <div className={style.messagemeta}>
                    <p id={style.time}>{messageContent.time}</p>
                    <p id={style.author}>{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className={style.chatfooter} style={window.innerWidth <= 690 && isMobileView ? { display: 'none' } : {}}>
        <input
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
        <button onClick={sendMessage} className={style.send}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cursor-fill" viewBox="0 0 16 16">
            <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ChatChess;
