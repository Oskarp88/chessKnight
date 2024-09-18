import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Nav.module.css';
import Sidebar from './Sidebar';
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
   const navigate = useNavigate();
   const location = useLocation();
   const [theme, setTheme] = useState(0); 
   const {chessColor, setChessColor} = useChessboardContext();
   const {language, setLanguage} = useLanguagesContext();
   const [showModalSettings, setShowSettings] = useState();
  

   useEffect(()=>{
    const languageNum = localStorage.getItem('languageNum');
    
    if(!isNaN(languageNum) && languageNum) {
      setLanguage(languages[parseInt(languageNum)]);
    }
   
  },[language]);

  useEffect(()=>{
    const themeLocal = localStorage.getItem('theme');
  
    if(!isNaN(themeLocal) && themeLocal) {
      setChessColor(colorChess[parseInt(themeLocal)]);
      setTheme(parseInt(themeLocal));
    }else{
      setChessColor(colorChess[theme]);
    }
  },[chessColor, theme, setChessColor])

   // Verificar si la ruta actual es /chess
   if (location.pathname === "/chess" || location.pathname === "/dashboard/next") {
     return null; // No renderiza nada si la ruta es /chess
   }

   const firstName = (auth?.user?.name || "").charAt(0).toUpperCase() + (auth?.user?.name || "").slice(1);
    const trimmedFirstName = firstName.substring(0, 8);

    const lastName = (auth?.user?.lastName || "").charAt(0).toUpperCase() + (auth?.user?.lastName || "").slice(1);
    const trimmedLastName = lastName.substring(0, 8);

    const handleThemeToggle = () => {
      setTheme((prevTheme) => (prevTheme === 0 ? 1 : 0));
      localStorage.setItem('theme', theme === 0 ? 1 : 0);
    };

const handleLogout = () => {
  setAuth({
    ...auth,
    user: null,
    token: ''
  });
  
  localStorage.removeItem('auth');
  toast.success('Logout succefilly');
  navigate('/login');
}

const handleLanguageChange = (num) => {
   setLanguage(languages[num]);
   localStorage.setItem('languageNum', num)
}

const CustomNavDropdown = styled(NavDropdown)`
  .dropdown-menu {
    background: ${chessColor?.fondo4}; /* Cambia el color según tus necesidades */
  } 
`;

return (
  <>
  <Navbar className={`${styles.navbar} fixed-top`} expand="lg" >
    <Container >
      <Navbar.Brand href="/" ><img src="/logo/chessfive.png" alt="" className={styles.logo}/></Navbar.Brand>
      <Navbar.Toggle
  aria-controls="basic-navbar-nav"
  style={{ borderColor: 'rgba(255, 255, 255, 0.6)', color: 'rgba(255, 255, 255, 0.6)'}}
>
  <span className="navbar-toggler-icon" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 30 30%27%3E%3Cpath stroke=%27rgba(255, 255, 255, 0.8)%27 stroke-width=%272%27 d=%27M4 7h22M4 15h22M4 23h22%27/%3E%3C/svg%3E")' }}></span>
</Navbar.Toggle>


      <Navbar.Collapse id="navbarScroll" style={{color: '#fff'}}>
        <Nav 
          className="me-auto my-2 my-lg-0"
          style={{Height: 'auto'}}
        >
        <Nav.Link href="/"  className={styles.navlink}>{language?.home}</Nav.Link>
          {!auth?.user ? (
            <>             
              <Nav.Link href="/login" className={styles.navlink}>{language?.login}</Nav.Link>
              <Nav.Link href="/register" className={styles.navlink}>{language?.register}</Nav.Link>
             
            </>
          ) :(             
             <>               
                <Nav><Notifications /></Nav>
             </>
          )}
        </Nav>
        {auth?.user ?
         <> 
            <CustomNavDropdown 
                  title={<span className={styles.dropdownSpan}>{language?.dashboard}</span>}
                  style={{ "--bs-dropdown-caret-color": chessColor.color, color: '#fff' }}
                >                
                  <NavDropdown.Item href="/dashboard/profile" className={styles.item} style={{color: chessColor.color}}>{language?.profile}</NavDropdown.Item>                   
                  
                  <NavDropdown.Item 
                    className={`${styles.item} d-flex`} 
                    onClick={handleThemeToggle} 
                  >
                    <Nav style={{color: chessColor.color}}> {theme === 0 ? 'Light' : 'Dark'}</Nav>
                    <Nav className={styles.color} style={{borderLeft: `solid 2px ${chessColor.color}`}}>
                        <div className={styles.theme}>
                        {
                          theme === 0 ? 
                          <svg xmlns="http://www.w3.org/2000/svg" style={{color: chessColor.color}} width='25'  height='25'  fill="currentColor" className="bi bi-brightness-high-fill" viewBox="0 0 16 16">
                            <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
                          </svg> :
                          <svg xmlns="http://www.w3.org/2000/svg" style={{color: chessColor.color}} width='25'  height='25' fill="currentColor" className="bi bi-moon-stars-fill" viewBox="0 0 16 16">
                            <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278"/>
                            <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.73 1.73 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.73 1.73 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.73 1.73 0 0 0 1.097-1.097zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
                          </svg>
                        }
                      </div>
                    </Nav>
                  </NavDropdown.Item>
                  <NavDropdown                     
                    title={
                      <span className={styles.dropdownSpan2} style={{color: chessColor.color}}>{language?.Language}</span>
                    }
                    style={{marginLeft: '5px', color:chessColor.color}}
                  >
                      <NavDropdown.Item className={styles.item}   style={{color: chessColor.color}} onClick={() => handleLanguageChange(1)}>
                        {language.english}
                      </NavDropdown.Item>
                      <NavDropdown.Item className={styles.item}  style={{color: chessColor.color}} onClick={() => handleLanguageChange(0)}>
                        {language.spanish}
                      </NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown.Item className={styles.item} style={{color: chessColor.color}} onClick={()=>setShowSettings(true)}>
                    {language.settings}
                    <SettingSvg />
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item className={styles.item} style={{color: chessColor.color}} onClick={handleLogout}>
                    {language.logout}
                    <CerrarSvg />
                  </NavDropdown.Item>
            </CustomNavDropdown>
           
           <Navbar.Brand style={{marginLeft:'10px'}} href="/dashboard/profile" className='d-flex justify-content-center align-items-center text-white ' >
              <div className={styles.userprofile} >           
                <div className={styles.imageContainer}>
                  <img className={styles.photo} src={auth?.user?.photo} alt="User Photo" />
                  <img className={styles.marco} src={auth?.user?.marco} alt="Marco" />
                </div>
              </div>
              {`${trimmedFirstName} ${trimmedLastName}`}
           </Navbar.Brand>
         </> :  
         
         <CustomNavDropdown 
                  title={<span className={styles.dropdownSpan}>{language?.dashboard}</span>}
                  id="navbarScrollingDropdown"
                  style={{marginLeft: '5px', color:chessColor.color}}
                >                                  
                  <NavDropdown.Item 
                    className={`${styles.item} d-flex` } 
                    onClick={handleThemeToggle} 
                  >
                    <Nav style={{color: chessColor.color}}> {theme === 0 ? 'Light' : 'Dark'}</Nav>
                    <Nav className={styles.color} style={{borderLeft: `solid 2px ${chessColor.color}`}}>
                        <div className={styles.theme}>
                        {
                          theme === 0 ? 
                          <svg xmlns="http://www.w3.org/2000/svg" style={{color: chessColor.color}} width='25'  height='25'  fill="currentColor" className="bi bi-brightness-high-fill" viewBox="0 0 16 16">
                            <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
                          </svg> :
                          <svg xmlns="http://www.w3.org/2000/svg" style={{color: chessColor.color}} width='25'  height='25' fill="currentColor" className="bi bi-moon-stars-fill" viewBox="0 0 16 16">
                            <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278"/>
                            <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.73 1.73 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.73 1.73 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.73 1.73 0 0 0 1.097-1.097zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
                          </svg>
                        }
                      </div>
                    </Nav>
                  </NavDropdown.Item>
                  <NavDropdown                     
                    title={
                      <span className={styles.dropdownSpan2} style={{color: chessColor.color}}>{language?.Language}</span>
                    }
                  >
                      <NavDropdown.Item className={styles.item}   style={{color: chessColor.color}} onClick={() => handleLanguageChange(1)}>
                        {language.english}
                      </NavDropdown.Item>
                      <NavDropdown.Item className={styles.item}  style={{color: chessColor.color}} onClick={() => handleLanguageChange(0)}>
                        {language.spanish}
                      </NavDropdown.Item>
                  </NavDropdown>
                </CustomNavDropdown> 
      }
      </Navbar.Collapse>
    </Container>
  </Navbar>

  <SettingsModal 
    show={showModalSettings}
    handleClose={()=> setShowSettings(false)}
  />
</>
);
}

export default NavBar;