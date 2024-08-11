import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Nav.module.css';
import Sidebar from './Sidebar';
import Notifications from '../chat/Notifications';
import { useAuth } from '../../context/authContext';
import { useChessboardContext } from '../../context/boardContext';

const colorChess = [
  { 
    id: 1, 
    navbar: 'radial-gradient(circle at 48.7% 44.3%, rgb(30, 144, 231) 0%, rgb(56, 113, 209) 22.9%, rgb(38, 76, 140) 76.7%, rgb(31, 63, 116) 100.2%)',
    boxShadow: '0 5px 15px rgba(7, 7, 235, 0.2), -5px 0 20px rgba(1, 36, 141, 0.2)',
    border: 'solid 2px #fff',
    border2: 'solid 1px #1565C0',
    fondo: 'linear-gradient(to top, #dfe9f3 0%, white 100%)',
    fondo2: 'linear-gradient(109.6deg, rgb(204, 228, 247) 11.2%, rgb(237, 246, 250) 100.2%)',
    fondo_3: 'linear-gradient(-225deg, #5D9FFF 0%, #B8DCFF 48%, #6BBBFF 100%)',
    titulo: '#3949AB',
    color: '#273746',
    spinner: '4px solid rgba(23, 21, 21, 0.5)',
    colorBorder: '#fff'
  },
  { 
    id: 2, 
    navbar: 'linear-gradient(to right, #434343 0%, black 100%)',
    boxShadow: '0 5px 15px rgba(124, 124, 160, 0.2), -5px 0 20px rgba(249, 250, 252, 0.2)',
    border: 'solid 2px #1565C0',
    border2: 'solid 1px #fff',
    fondo: 'linear-gradient(109.6deg, rgb(36, 45, 57) 11.2%, rgb(16, 37, 60) 51.2%, rgb(0, 0, 0) 98.6%)',
    fondo_3: 'linear-gradient(109.6deg, rgb(36, 45, 57) 11.2%, rgb(16, 37, 60) 51.2%, rgb(0, 0, 0) 98.6%)',
    fondo2: 'linear-gradient(109.6deg, rgb(36, 45, 57) 11.2%, rgb(16, 37, 60) 51.2%, rgb(0, 0, 0) 98.6%)',
    titulo: '#85C1E9 ',
    color: '#fff',
    spinner: '4px solid rgba(255, 255, 255, 0.9)',
    colorBorder: '#85C1E9'
  }
]

function NavBar() {
   const{ auth } = useAuth();
   const location = useLocation();
   const [theme, setTheme] = useState(0); 
   const {chessColor, setChessColor} = useChessboardContext();
   const [isMobileView, setIsMobileView] = useState(0);
   console.log('ismovovile',isMobileView)

   useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    console.log('isMobileView', isMobileView);
  
  }, [isMobileView]);

   useEffect(()=>{
    setChessColor({
      navbar: colorChess[theme].navbar,
      boxShadow: colorChess[theme].boxShadow,
      border: colorChess[theme].border,
      border2: colorChess[theme].border2,
      fondo: colorChess[theme].fondo,
      fondo2: colorChess[theme].fondo2,
      fondo3: colorChess[theme].fondo3,
      titulo: colorChess[theme].titulo,
      color: colorChess[theme].color,
      spinner: colorChess[theme].spinner,
      colorBorder: colorChess[theme].colorBorder
    });
   
   },[theme, setChessColor])

   // Verificar si la ruta actual es /chess
   if (location.pathname === "/chess") {
     return null; // No renderiza nada si la ruta es /chess
   }

   const firstName = (auth?.user?.name || "").charAt(0).toUpperCase() + (auth?.user?.name || "").slice(1);
const trimmedFirstName = firstName.substring(0, 8);

const lastName = (auth?.user?.lastName || "").charAt(0).toUpperCase() + (auth?.user?.lastName || "").slice(1);
const trimmedLastName = lastName.substring(0, 8);

const handleThemeToggle = () => {
  setTheme((prevTheme) => (prevTheme === 0 ? 1 : 0));
  console.log(theme, colorChess[theme].navbar)

};

return (
  <div className={styles.navbar} style={{background: chessColor.navbar, boxShadow: chessColor.boxShadow}}>    
    <div className={styles.leftSection}>
      <Sidebar/>
       <div className={styles.img}>
         <p>{`${trimmedFirstName} ${trimmedLastName}`}</p>
       </div> 
    </div>
    <div className={styles.rightSection}>
      <Link to={"/"} className={styles.navLink} >
        <div className={styles.div}>
          <svg xmlns="http://www.w3.org/2000/svg" width='25'  height='25' fill="currentColor" className="bi bi-house" viewBox="0 0 16 16">
            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
          </svg>
        </div>
        
      </Link>  
      {auth?.user ? (<a className={styles.navLink}><Notifications /></a>) : 
      ( 
        <Link className={styles.navLink} to="/login">
        <svg xmlns="http://www.w3.org/2000/svg" width='25'  height='25' fill="currentColor" className="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"/>
          <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
        </svg>
        <span style={{ marginLeft: "5px" }}>Login</span></Link>
      )}
      <div onClick={handleThemeToggle} className={styles.color} style={{borderLeft: chessColor.border}}>
        <div className={styles.div}>
          {
            theme === 0 ? 
            <svg xmlns="http://www.w3.org/2000/svg" width='25'  height='25'  fill="currentColor" className="bi bi-brightness-high-fill" viewBox="0 0 16 16">
              <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
            </svg> :
            <svg xmlns="http://www.w3.org/2000/svg" width='25'  height='25' height={isMobileView >= 1125 ? 25 : 50} fill="currentColor" className="bi bi-moon-stars-fill" viewBox="0 0 16 16">
              <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278"/>
              <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.73 1.73 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.73 1.73 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.73 1.73 0 0 0 1.097-1.097zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
            </svg>
          }
        </div>
      </div>
    </div>
  </div>
);
}

export default NavBar;