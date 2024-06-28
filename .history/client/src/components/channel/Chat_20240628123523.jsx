import React, { useEffect, useRef, useState } from 'react';
import ScrollToBottom from "react-scroll-to-bottom";
import style from './Chat.module.css';
import { useChessboardContext } from '../../context/boardContext';
import Picker from 'emoji-picker-react';
import { CursorSend } from '../../svg';
import { useAuth } from '../../context/authContext';


function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 725);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isView,setIsView] = useState(window.innerWidth <= 725);
  const {setView} = useChessboardContext();
  const {auth} = useAuth();

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

 

  // useEffect(() => {
  //   console.log('isMobileView', isMobileView);
  
  // }, [isMobileView]);
  
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
    if(window.innerWidth <= 690){
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
    <div className={style.chatwindow}>
      <div className={style.chatheader}  onClick={()=> mobileView()}>
        <p>Live Chat</p>
      </div>
      <div className={style.chatbody}  style={window.innerWidth <= 725 && isMobileView ? { display: 'none' } : {}}  
       >
        <ScrollToBottom className={style.messagecontainer}>
          {messageList.map((messageContent, index) => {
            return (
              <div
                className={style.message}
                id={username === messageContent.author ? style.you: style.other}
                key={index} // Agregar una clave única
              >
                <div className={style.containerContentMeta}>
                  <div className={style.containerProfileMessage}>
                    { username === messageContent.author && <img className={style.profile} src={messageContent?.photo} alt='' />}                  
                    <div className={style.messagecontent}>
                      <p>{messageContent.message}</p>
                    </div>
                    { username !== messageContent.author && <img className={style.profile} src={messageContent?.photo} alt='' />}                  

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
      <button
          className={style.emojibutton}
          onClick={() => setShowEmoji(!showEmoji)}
        >😀</button>
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
          <CursorSend />
        </button>
      </div>
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
