import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiFillDashboard, AiFillHome, AiOutlineClose, AiOutlineForm, AiOutlineLogin, AiOutlineLogout } from 'react-icons/ai';
import style from './Sidebar.module.css'; 
import { toast } from 'react-toastify';
import { useAuth } from '../../context/authContext';
import { useChessboardContext } from '../../context/boardContext';
import { Prev } from 'react-bootstrap/esm/PageItem';
import { baseUrl, getRequest } from '../../utils/services';


const colorBoard = [
  { id: 1, blackRow: '#2E86C1', whiteRow: '#ebecd0', blackTile: 'black-tile-azul', whiteTile: 'white-tile-azul', register: 'linear-gradient(89deg, rgb(21, 74, 189) 0.1%, rgb(26, 138, 211) 51.5%, rgb(72, 177, 234) 100.2%)' },
  { id: 2, blackRow: '#779556', whiteRow: '#ebecd0', blackTile: 'black-tile-verde', whiteTile: 'white-tile-verde', register: 'radial-gradient(circle at -1% 57.5%, rgb(19, 170, 82) 0%, rgb(0, 102, 43) 90%)' },
  { id: 3, blackRow: '#276d78', whiteRow: '#bbe4e9', blackTile: 'black-tile-verdeGris', whiteTile: 'white-tile-verdeGris', register: 'radial-gradient(circle at 5.6% 54.5%, rgb(47, 71, 79) 0%, rgb(159, 188, 198) 83.6%)' },
  { id: 4, blackRow: '#e7617e', whiteRow: '#ffcbcb', blackTile: 'black-tile-rosa', whiteTile: 'white-tile-rosa', register: 'linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)' },
  { id: 5, blackRow: '#f96d00', whiteRow: '#ffebbb', blackTile: 'black-tile-naranja', whiteTile: 'white-tile-naranja', register: 'linear-gradient(105.6deg, rgb(246, 220, 111) 12.4%, rgb(222, 104, 104) 78.7%)' },
  { id: 6, blackRow: '#810404', whiteRow: '#f0bdbd', blackTile: 'black-tile-rojo', whiteTile: 'white-tile-rojo', register: 'linear-gradient(98.3deg, rgb(0, 0, 0) 10.6%, rgb(135, 16, 16) 97.7%)' },
  { id: 7, blackRow: '#004445', whiteRow: '#d1ebe7', blackTile: 'black-tile-verdeOscuro', whiteTile: 'white-tile-verdeOscuro', register: 'radial-gradient(759px at 14% 22.3%, rgb(10, 64, 88) 0%, rgb(15, 164, 102) 90%)' },
  { id: 8, blackRow: '#263849', whiteRow: '#c8dad7', blackTile: 'black-tile-azulOscuro', whiteTile: 'white-tile-azulOscuro', register: 'linear-gradient(177.9deg, rgb(58, 62, 88) 3.6%, rgb(119, 127, 148) 105.8%)' },
];

const Sidebar = () => {
    const { setBoardColor } = useChessboardContext();
    // const {setPieceFile} = usePieceContext();
    const [showColorOptions, setShowColorOptions] = useState(false);
    // const [showPieceOptions, setShowPieceOptions] = useState(false);
    const [selectedColorId, setSelectedColorId] = useState(colorBoard[0].id);
    // const [selectedPieceId, setSelectedPieceId] = useState(pieceBoard[0].id)
    const [showNavBar, setShowNavBar] = useState(false);
    const { auth, setAuth } = useAuth();
    const [user, setUser] = useState({});

    useEffect(() => {
      const selectedColor = colorBoard?.find((c) => c.id === selectedColorId);
  
      if (selectedColor) {
        setBoardColor({
          blackTile: selectedColor.blackTile,
          whiteTile: selectedColor.whiteTile,
          register: selectedColor.register,
          whiteRow: selectedColor.whiteRow,
          blackRow: selectedColor.blackRow
        });
      }
    }, [selectedColorId, setBoardColor]);

    useEffect(() => {
     const findUser = async() => {
      const response = await getRequest(`${baseUrl}/user/${auth?.user?._id}`);
      if(response.error){
         return console.log('Error fetching users', response);
      }
      setUser(response);
     }
      findUser(); 
      console.log('sidebar foto', user.photo)
   
    },[]);
  
    const handleColorChange = (colorId) => {
      setSelectedColorId(colorId);
    };
  
    const toggleColorOptions = () => {
      setShowColorOptions(!showColorOptions);
    };
  
    const toggleNavBar = () => {
      setShowNavBar(!showNavBar);
    };
  
    const handleLogout = () => {
      setAuth({
        ...auth,
        user: null,
        token: ''
      });
      
      localStorage.removeItem('auth');
      toast.success('Logout succefilly', {
        autoClose: 3000,
        closeButton: (
          <button className={style.closeButton}>X</button>
        ),
      });
    }
    return (
    <div>
      <div className={`${style.navbartoggle} ${showNavBar ? `${style.active}` : ''}`} onClick={toggleNavBar}>
        {showNavBar ? <div className={style.close}><AiOutlineClose className={style.AiOutlineClose} /></div> :
          <div className={style.userprofile}>
            {auth?.user ?
              <img className={style.profileSidebar} src={`http://localhost:8080/api/user-photo/${auth?.user?._id}` ? `http://localhost:8080/api/user-photo/${auth?.user?._id}` : 'assets/avatar/user.png'} alt=''/>
              : 
              <div className={style.burguer}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                </svg>
              </div>
            }
          </div>
        }
      </div>
      {showNavBar && (
        <div className={`${style.navbar} ${showNavBar ? `${style.active}` : ''}`}>
          {auth.user &&
            <>
              <div className={style.userprofile}>
                  {auth.user ?
                  <img className={style.profile} src={`http://localhost:8080/api/user-photo/${auth?.user?._id}` ? `http://localhost:8080/api/user-photo/${auth?.user?._id}` : 'assets/avatar/user.png'} alt='' />
                  : <img className={style.profile} src='assets/avatar/user.png' alt='' />}
                  <span className={style.username}>{auth.user?.name}</span>
              </div>
              <div className={style.lineWithShadow}>
                  <div className={style.line}></div>
              </div>
            </>
          }
          <ul>
            <li className={`${auth?.user ? '' : style.li}`}>
              <div className={style.icon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-house" viewBox="0 0 16 16">
                  <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
                </svg>
                <Link className={style.linkli} to="/">Inicio</Link>
              </div>

            </li>
            {!auth.user && (
              <>
                <li>
                  <div className={style.icon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"/>
                      <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                    </svg>
                    <Link className={style.linkli} to="/login">Iniciar Sesión</Link>
                  </div>              
                </li>
                <li>
                  <div className={style.icon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                      <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                    </svg>
                    <Link className={style.linkli} to="/register">Register</Link>
                  </div>
                </li>
              </>
            )}
            {
              auth.user && (
                <>
                  <li>
                  <div className={style.icon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person-workspace" viewBox="0 0 16 16">
                      <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                      <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.4 5.4 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2z"/>
                    </svg>
                    <Link className={style.linkli} to={`dashboard/${auth.user.role === 'admin' ? 'admin' : 'user'}`}>                    
                        Dashboard
                    </Link>
                  </div>
                    
                  </li>
                  
                  <li>
                    <span className={style.icon} onClick={toggleColorOptions}>
                      Colores Casillas
                    </span>
                    {
                      showColorOptions &&
                      <div className={style.coloroptions}>
                          {colorBoard.map((c, index) => {
                          const isEvenIndex = (index + 1) % 2 === 0;

                          return (<div key={c.id} className={`${style.coloroption} ${isEvenIndex ? `${style.even}` : `${style.odd}`}`} onClick={() => handleColorChange(c.id)}>
                          
                          <div className={style.colorrow}>
                            <div className={style.colorboard} style={{ backgroundColor: c.blackRow }}></div>
                            <div className={style.colorboard} style={{ backgroundColor: c.whiteRow }}></div>
                          </div>
                          <div className={style.colorrow}>
                            <div className={style.colorboard} style={{ backgroundColor: c.whiteRow }}></div>
                            <div className={style.colorboard} style={{ backgroundColor: c.blackRow }}></div>
                          </div>
                        </div>)}
                        )}
                      </div>
                    }
                  </li>
                  <li>
                    <div className={style.icon}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                        <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                      </svg>
                      <Link className={style.linkli} to='/login' onClick={handleLogout}>
                        Cerrar Sesión
                      </Link>
                    </div>
                  
                  </li>
                </>
              )
            }
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
