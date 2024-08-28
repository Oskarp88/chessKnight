import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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



function NavBar() {
   const{ auth, setAuth } = useAuth();
   const location = useLocation();
   const [theme, setTheme] = useState(0); 
   const {chessColor, setChessColor} = useChessboardContext();
   const {language, setLanguage} = useLanguagesContext();
  
   useEffect(()=>{
    setChessColor(colorChess[theme]);
   },[theme, setChessColor])

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
  console.log(theme, colorChess[theme].navbar)

};

const handleLogout = () => {
  setAuth({
    ...auth,
    user: null,
    token: ''
  });
  
  localStorage.removeItem('auth');
  toast.success('Logout succefilly');
}

const handleLanguageChange = (num) => {
   setLanguage(languages[num]);
}

// return (
//   <div className={styles.navbar} style={{background: chessColor.navbar, boxShadow: chessColor.boxShadow}}>    
//     <div className={styles.leftSection}>
//       <Sidebar/>
//        <Link to={'/dashboard/user'} className={styles.navLink}>
//         <div className={styles.img}>
//           {auth?.user ? <p>{`${trimmedFirstName} ${trimmedLastName}`}</p> : <p>ChessKnigth</p>}
//         </div>
//        </Link>
        
//     </div>
//     <div className={styles.rightSection}>
//       <Link to={"/"} className={styles.navLink} >
//         <div className={styles.div}>
//           <svg xmlns="http://www.w3.org/2000/svg" width='25'  height='25' fill="currentColor" className="bi bi-house" viewBox="0 0 16 16">
//             <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
//           </svg>
//         </div>
        
//       </Link>  
//       {auth?.user ? (<a className={styles.navLink}><Notifications /></a>) : 
//       ( 
//         <Link className={styles.navLink} to="/login">
//         <svg xmlns="http://www.w3.org/2000/svg" width='25'  height='25' fill="currentColor" className="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
//           <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"/>
//           <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
//         </svg>
//         <span style={{ marginLeft: "5px" , marginRight: '5px'}}>Login</span></Link>
//       )}
//       <div onClick={handleThemeToggle} className={styles.color} style={{borderLeft: chessColor.border}}>
//         <div className={styles.div}>
//           {
//             theme === 0 ? 
//             <svg xmlns="http://www.w3.org/2000/svg" width='25'  height='25'  fill="currentColor" className="bi bi-brightness-high-fill" viewBox="0 0 16 16">
//               <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
//             </svg> :
//             <svg xmlns="http://www.w3.org/2000/svg" width='25'  height='25' fill="currentColor" className="bi bi-moon-stars-fill" viewBox="0 0 16 16">
//               <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278"/>
//               <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.73 1.73 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.73 1.73 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.73 1.73 0 0 0 1.097-1.097zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
//             </svg>
//           }
//         </div>
//       </div>
//     </div>
//   </div>
// );

const CustomNavDropdown = styled(NavDropdown)`
  .dropdown-menu {
    background: ${chessColor?.fondo}; /* Cambia el color según tus necesidades */
  } 
`;

return (
  <Navbar className='fixed-top' expand="lg" style={{background: chessColor.navbar, boxShadow: chessColor.boxShadow}}>
    <Container>
   
      {auth?.user ? 
         <>
           
           <Navbar.Brand href="/dashboard/user" className='d-flex justify-content-center align-items-center' style={{color: chessColor.color1}}>
              <div className={styles.userprofile}>           
                <img className={styles.profileSidebar} src={auth?.user?.photo} alt=''/>
              </div>
              {`${trimmedFirstName} ${trimmedLastName}`}
           </Navbar.Brand>
         </> :
        <Navbar.Brand href="/dashboard/user" style={{color: chessColor.color1}}>ChessKnight</Navbar.Brand>
      }
      <Navbar.Toggle aria-controls="basic-navbar-nav" style={{border: `solid 1px ${chessColor.color1}`, backgroundColor: chessColor.color1, color: chessColor.color1}}/>
      <Navbar.Collapse id="basic-navbar-nav" style={{color: chessColor.color1}}>
        <Nav className="me-auto">
        <Nav.Link href="/" style={{color: chessColor.color1}}>{language?.home}</Nav.Link>
          {!auth?.user ? (
            <>             
              <Nav.Link href="/login" style={{color: chessColor.color1}}>{language?.login}</Nav.Link>
              <Nav.Link href="/register" style={{color: chessColor.color1}}>{language?.register}</Nav.Link> 
            </>
          ) :(
              
             <>
                <CustomNavDropdown 
                  title={<span style={{ color: chessColor.color1 }}>{language?.dashboard}</span>}
                  style={{ "--bs-dropdown-caret-color": chessColor.color1 }}
                >                
                  <NavDropdown.Item href="/dashboard/user" style={{color: chessColor.color}}>{language?.profile}</NavDropdown.Item>                   
                  
                  <NavDropdown.Item 
                    className='d-flex' 
                    onClick={handleThemeToggle} 
                  >
                    <Nav style={{color: chessColor.color}}> {theme === 0 ? 'Light' : 'Dark'}</Nav>
                    <Nav className={styles.color} style={{borderLeft: `solid 2px ${chessColor.color}`}}>
                        <div className={styles.div}>
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
                  <NavDropdown className='fw-bold ml-[20px]' title={<span style={{color: chessColor.color}}>{language?.Language}</span>}>
                      <NavDropdown.Item style={{color: chessColor.color}} onClick={() => handleLanguageChange(1)}>
                        {language.english}
                      </NavDropdown.Item>
                      <NavDropdown.Item style={{color: chessColor.color}} onClick={() => handleLanguageChange(0)}>
                        {language.spanish}
                      </NavDropdown.Item>
                    </NavDropdown>
                  <NavDropdown.Divider />
                  <NavDropdown.Item style={{color: chessColor.color}} onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </CustomNavDropdown>
                <Nav><Notifications /></Nav>
             </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);
}

export default NavBar;