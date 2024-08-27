import { createContext, useCallback, useEffect, useState } from "react";
import { getRequest, baseUrl, postRequest } from "../utils/services";
import  io  from 'socket.io-client';

export const ChatContext = createContext();

export const ChatContextProvider = ({children, user}) => {
    const [userChats, setUserchats] = useState(null);
    console.log('chatcontex', userChats);
    const [allUsers, setAllUsers] = useState([]);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotencialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessagesLoading, setMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
      const newSocket = io.connect('https://chessknigth-22fe0ebf751e.herokuapp.com');
   
        setSocket(newSocket);

        return () =>{
         newSocket.disconnect();
        }
    },[user]);

    useEffect(() => {
      if(socket === null) return;
      socket.emit('addNewUser', user?._id);
      socket.on('getOnlineUsers', (data) => {
        setOnlineUsers(data);
      });
      return () => {
         socket.off('getOnlineUsers');
      }
    },[socket]);

    //send Message
    useEffect(() => {
      if(socket === null) return;
       const recipientId = currentChat?.members.find((id) => id !== user?._id);
       socket.emit('sendMessage', {...newMessage, recipientId})
    },[newMessage]);
   
    //receive message and notifications
    useEffect(() => {
      if(socket === null) return;
       socket.on('getMessage', (res )=> {
           if(currentChat?._id !== res.chatId) return;
           setMessages((prev) => [...prev, res])
       });

       socket.on('getNotifications', (res )=> {
         const isChatOpen = currentChat?.members.some(id => id._id === res.senderId);
         if(isChatOpen){
            setNotifications(prev => [{...res, isRead: true}, ...prev])
         }else{
            setNotifications(prev => [res, ...prev]);
         }
     });

       return () => {
         socket.off('getMessage');
         socket.off('getNotifications');
       }
    },[socket, currentChat]);

   useEffect(() => {
       const getUsers = async() =>{
        
         const response = await getRequest(`${baseUrl}/users`);
          if(response.error){
             return console.log('Error fetching users', response);
          }
         
         const pChats = response.filter((u) => {
            let isChatCreated = false;
             if(user?._id === u._id) return false;

              if(userChats){
                 isChatCreated = userChats?.some((chat) =>{
                    return chat.members[0] === u._id || chat.members[1] === u._id
                  })
              }
              return !isChatCreated;
          });

           setPotencialChats(pChats);
           setAllUsers(response);
        }

       getUsers();

    }, [userChats]);

    useEffect(()=>{
        const getUserChats = async() => {
            if(user?._id){

                setIsUserChatsLoading(true);
                setUserChatsError(null);
                const response = await getRequest(`${baseUrl}/chat/${user?._id}`);
                setIsUserChatsLoading(false);
                if(response.error){
                    return setUserChatsError(response);
                }

                setUserchats(response);
            }
        }

        getUserChats();
    },[user,notifications]);

    useEffect(()=>{
      const getMessages = async() => {

         setMessagesLoading(true);
         setMessagesError(null);
         const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);
         setMessagesLoading(false);
         if(response.error){
            return setMessagesError(response);
         }

         setMessages(response);
      }
      getMessages();
  },[currentChat]);

    const sendTextMessage = useCallback(async(textMessage, sender, currentChatId, setTextMessage) => {
       if(!textMessage) return console.log('you must type something...');
       const response = await postRequest(`${baseUrl}/messages`, JSON.stringify({
         chatId: currentChatId,
         senderId: sender,
         text: textMessage
       }));

       if(response.error){
         return setSendTextMessageError(response);
       }

       setNewMessage(response);
       setMessages((prev) => [...prev, response]);
       setTextMessage('');

    },[]);
    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat)
    },[]);

    const createChat = useCallback(async (firstId, secondId) => {
      const response = await postRequest(`${baseUrl}/chat`, 
        JSON.stringify({
          firstId,
          secondId
        })
      );

      console.log('createChat', response);
    
      if (response.error) {
        return console.log('Error creating chat', response);
      }
    
      setUserchats((prev) => {
         // Verificar si el chat ya existe
         const chatExists = prev.some(chat => chat.members[0] === firstId || chat.members[0] === secondId && chat.members[1] === firstId || chat.members[1] === secondId); 
         
         if (chatExists) {
           // Eliminar el chat existente y agregar el nuevo
           const updatedChats = prev.filter(chat => chat.members[0] !== firstId || chat.members[0] !== secondId && chat.members[1] !== firstId || chat.members[1] !== secondId);
           return [...updatedChats, response];
         } else {
           // Si no existe, simplemente agregar el nuevo
           return [...prev, response];
         }
       });
       
    }, []);

    const markAllNotificationsAsRead = useCallback((notifications) => {
       const mNotifications = notifications.map(n => {
         return {...n, isRead: true}
      });
      setNotifications(mNotifications);
    },[]);

    const markNotificationAsRead = useCallback((n, userChats, user, notifications)=>{
       //find chat to open
       const desiredChat = userChats.find(chat=>{
         const chatMembers = [user._id, n.senderId];
         const isDesiredChat = chat?.members.every((member) => {
            return chatMembers.includes(member);
         });

         return isDesiredChat;
       });
       //mark notification as read
       const mNotifications = notifications.map(el =>{
         if(n.senderId === el.senderId){
            return {...n, isRead: true}
         }else{
            return el
         }
       })
       updateCurrentChat(desiredChat);
       setNotifications(mNotifications);

    },[]);

    const markThisUserNotificationsAsRead = useCallback((thisUserNotifications, notificacions) => {
      const mNotifications = notificacions?.map((el) => {
         let notification;

         thisUserNotifications?.forEach(n => {
            if(n.senderId === el.senderId){
               notification = {...n, isRead: true}
            }else{
               notification = el;
            }
         });
         return notification;
      });
      setNotifications(mNotifications);
    },[]);

    return <ChatContext.Provider 
         value={{
            userChats,
            isUserChatsLoading,
            userChatsError,
            potentialChats, 
            createChat,
            updateCurrentChat,
            currentChat,
            messages,
            isMessagesLoading,
            messagesError,
            sendTextMessage,
            onlineUsers,
            notifications,
            allUsers,
            markAllNotificationsAsRead,
            markNotificationAsRead,
            markThisUserNotificationsAsRead
         }}
      >
         {children}
      </ChatContext.Provider>
    
}