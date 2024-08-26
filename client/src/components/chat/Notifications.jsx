import React, { useContext, useEffect, useState } from 'react';
import style from './Notification.module.css';
import { ChatContext } from '../../context/ChatContext';
import { useAuth } from '../../context/authContext';
import { unReadNotifications } from '../../utils/unReadNotifications';
import moment from 'moment';

function Notifications() {
    const [isOpen, setIsOpen] = useState(false);
    const {auth} = useAuth();
    const {user} = auth;
    const {notifications, userChats, allUsers, markAllNotificationsAsRead, markNotificationAsRead} = useContext(ChatContext);

    const unReadNotification = unReadNotifications(notifications);
    const modifiedNotifications = notifications?.map((n) => {
        const sender = allUsers.find(u => u._id === n.senderId)
        return{
            ...n,
            senderName: sender?.name
        }
    })
    return (
    <div className={style.notifications}>
        <div className={style.notificationsIcon} onClick={() => setIsOpen(!isOpen)}>
        <div className={style.div}>
        <svg xmlns="http://www.w3.org/2000/svg"  width='25'  height='25' fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"/>
        </svg>
        </div>
            {
                unReadNotification?.length === 0 ? null : (
                    <span className={style.notificationCount }>
                        <span>{unReadNotification?.length}</span>
                    </span>
                )
            }
        </div>
        {
            isOpen && 
            <div className={style.notificationsBox}>
                <div className={style.notificationsHeader}>
                    <h3>Notifications</h3>
                    <div className={style.markAsRead} onClick={() => markAllNotificationsAsRead(notifications)}>
                       Mark all as read
                    </div>
                </div>
                       {modifiedNotifications?.length === 0 ? 
                         (<span className={style.notification}>No notificaion yet...</span>) : null
                       }
                       {modifiedNotifications &&
                           modifiedNotifications.map((n, index) => {
                            return (
                                <div 
                                  key={index} 
                                  className={`${n.isRead ? `${style.notification}` : `${style.notification} ${style.notRead}`}`}
                                  onClick={()=>{markNotificationAsRead(n, userChats, user, notifications); setIsOpen(false)}}
                                  
                                >
                                   <span>{`${n.senderName} sent you a new message`}</span>
                                   <span className={style.notificationTime}>{moment(n.date).calendar()}</span>
                                </div>
                            )
                           })
                       }
                    
                
            </div>
        }
    
    </div>
  )
}

export default Notifications;