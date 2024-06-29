import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Nav.module.css';
import Sidebar from './Sidebar';
import Notifications from '../chat/Notifications';
import { useAuth } from '../../context/authContext';

const colorChess = [
  {id: 1, navbar: 'radial-gradient(circle at 48.7% 44.3%, rgb(30, 144, 231) 0%, rgb(56, 113, 209) 22.9%, rgb(38, 76, 140) 76.7%, rgb(31, 63, 116) 100.2%)'},
  {id: 2, navbar: 'linear-gradient(114.9deg, rgb(34, 34, 34) 8.3%, rgb(0, 40, 60) 41.6%, rgb(0, 143, 213) 93.4%);'}
]

function NavBar() {
   const{ auth } = useAuth();
   const location = useLocation();

   // Verificar si la ruta actual es /chess
   if (location.pathname === "/chess") {
     return null; // No renderiza nada si la ruta es /chess
   }

   const firstName = (auth?.user?.name || "").charAt(0).toUpperCase() + (auth?.user?.name || "").slice(1);
const trimmedFirstName = firstName.substring(0, 8);

const lastName = (auth?.user?.lastName || "").charAt(0).toUpperCase() + (auth?.user?.lastName || "").slice(1);
const trimmedLastName = lastName.substring(0, 8);


return (
  <div className={styles.navbar}>    
    <div className={styles.leftSection}>
      <Sidebar/>
       <div className={styles.img}>
       <p>{`${trimmedFirstName} ${trimmedLastName}`}</p>
      </div> 
    </div>
    <div className={styles.rightSection}>
      <Link to={"/"} className={styles.navLink} >
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-house" viewBox="0 0 16 16">
          <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
        </svg>
        <span style={{ marginLeft: "5px" } } >Inicio</span>
      </Link>  
      {auth?.user ? (<a className={styles.navLink}><Notifications /></a>) : 
      ( 
        <Link className={styles.navLink} to="/login">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"/>
          <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
        </svg>
        <span style={{ marginLeft: "5px" }}>Login</span></Link>
      )}
      
    </div>
  </div>
);
}

export default NavBar;