import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Nav.module.css';
import Notifications from '../chat/Notifications';
import { useAuth } from '../../context/authContext';
import { useChessboardContext } from '../../context/boardContext';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { colorChess } from '../../utils/Colors';
import { useLanguagesContext } from '../../context/languagesContext';
import toast from 'react-hot-toast';
import { languages } from '../../utils/languages';
import styled from 'styled-components';
import { CerrarSvg, SettingSvg } from '../../svg';
import SettingsModal from '../modal/SettingsModal';



function NavBar() {
   const{ auth, setAuth } = useAuth();
   const location = useLocation();
   const [showModalSettings, setShowSettings] = useState();


   // Verificar si la ruta actual es /chess
   if (location.pathname === "/chess" || location.pathname === "/dashboard/next") {
     return null; // No renderiza nada si la ruta es /chess
   }

   const firstName = (auth?.user?.name || "").charAt(0).toUpperCase() + (auth?.user?.name || "").slice(1);
    const trimmedFirstName = firstName.substring(0, 8);

    const lastName = (auth?.user?.lastName || "").charAt(0).toUpperCase() + (auth?.user?.lastName || "").slice(1);
    const trimmedLastName = lastName.substring(0, 8);


return (
  <>
  <div className={styles.navbar}>
    <div className={styles.containerMoneda}>
      <div className={styles.moneda}>
        <img src="/icon/moneda.png" alt="" />
        <div className={styles.dinero}>
          <span>0</span>
        </div>
      </div>
    </div>
    <div className={styles.container}> 
      <div className={styles.profileContainer}>
              <div className={styles.containerProfile}
                style={{
                  background:'#64a8a6',
                  boxShadow: '0px 0px 0px 1px #4e8381 inset, 0px 0px 0px 2px #74b6b4 inset, 0px 4px 0px 0px #4a7c7b, 0px 5px 0px 0px #355655, 0px 8px 0px 0px rgba(0,0,0,.15)'
                }}
              >
                  <div className={styles.ligaContainer} >           
                      <div 
                        className={styles.imageLiga}
                      >
                        <img className={styles.liga} src={'/ligas/bronceLiga.png'} alt="User Photo" />
                      </div>
                    </div>
                    <div className={styles.inf} style={{color: '#0b5345'}}>
                      <div className={styles.nameLiga}>
                        <span >LIGA</span>
                      </div>
                      <div className={styles.insignias}>
                        <span>Proximamente...</span>
                      </div>
                    </div>
                    <div 
                      className={styles.div1}
                      style={{background: '#64a8a6'}}
                    ></div>
                    <div 
                      className={styles.div2}
                      style={{background:'#73c2c0'}}
                    ></div>
              </div>
              
            </div>               
                    
        {auth?.user &&
         <>        
            <div className={styles.profileContainer}>
              <div className={styles.containerProfile}>
                  <div className={styles.userprofile} >           
                      <div className={styles.imageContainer}>
                        <img className={styles.photo} src={auth?.user?.photo} alt="User Photo" />
                        <img className={styles.marco} src={auth?.user?.marco} alt="Marco" />
                      </div>
                    </div>
                    <div className={styles.inf}>
                      <div className={styles.name}>
                        <span>{`${trimmedFirstName} ${trimmedLastName}`}</span>
                        <div><Notifications /></div>
                      </div>
                      <div className={styles.insignias}>
                        <img src={auth.user.imagenBandera} alt="" />
                      </div>
                    </div>
                    <div className={styles.div1}></div>
                    <div className={styles.div2}></div>
              </div>
              
            </div>
         </> }
         
    
    </div>
  </div>

  <SettingsModal 
    show={showModalSettings}
    handleClose={()=> setShowSettings(false)}
  />
</>
);
}

export default NavBar;