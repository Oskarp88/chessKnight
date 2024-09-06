import React, { useEffect, useRef, useState } from 'react';
import style from './UserProfile.module.css'; // Importa el archivo CSS
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/authContext';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../../utils/firebase';
import { baseUrl } from '../../utils/services';
import { useChessboardContext } from '../../context/boardContext';
import ProgressBar from 'react-bootstrap/ProgressBar';
import AvatarSelectorModal from './AvatarSelectorModal';
import { avatars } from '../../utils/avatars';
import Form from 'react-bootstrap/Form';
import { useLanguagesContext } from '../../context/languagesContext';


const UserProfile = () => {
  const { auth, setAuth } = useAuth();
  const fileRef = useRef(null);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [photo, setPhoto] = useState('');
  const [bandera, setBandera] = useState('');
  const [user, setUser] = useState({});
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [countries, setCountries] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const {chessColor} = useChessboardContext();
  const {language} = useLanguagesContext();

  const [showAvatarModal, setShowAvatarModal] = useState(false); // Estado para el modal

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        setCountries(response.data);
        setFilteredOptions(response.data.map((country) => country.name.common));
      } catch (error) {
        console.error(error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    console.log('pileperc',filePerc); // Verifica que filePerc se esté actualizando correctamente
  }, [filePerc]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    if (!file) {
      console.error("No file provided for upload.");
      return;
    }

    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('progress',progress)
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        console.error("Error during upload:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => setPhoto(downloadUrl));
      }
    );
  };

  
  const handleCountryChange = (event) => {
    const { value } = event.target;
    setSelectedCountry(value);
    const selectedCountryData = countries.find((country) => country.name.common === value);
    if (selectedCountryData) {
      setCountry(value);
      setBandera(selectedCountryData.flags.png)
    }
  };
  

  const handleFilterOptions = (event) => {
    const { value } = event.target;
    const filtered = countries.filter((country) =>
      country.name.common.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered.map((country) => country.name.common));
  };

  const getUser = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/user/${auth.user._id}`);
      setName(data.name);
      setLastName(data.lastName);
      setEmail(data.email);
      setUsername(data.username);
      setCountry(data.country);
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  
  
  const handleUpdate = async (event) => {
    event.preventDefault();
    try {

      const response = await axios.put(`${baseUrl}/user/update/${auth.user._id}`, {
         name,
         lastName,
         username,
         country,
         photo,
         imagenBandera: bandera
      });
      if (response.data.success) {
        toast.success(`${name} is updated`);
        setAuth({
          ...auth,
          user: response.data.userUpdate,
          token: auth?.token,
        });

        const data = { user: response.data.userUpdate, token: auth?.token}
        localStorage.setItem('auth', JSON.stringify(data));
        // navigate('/dashboard/user/profile');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log('error', error);

      toast.error(String(error), {
        autoClose: 3000,
        closeButton: <button className={style.closeButton}>X</button>,
      });
    }
  };

  const selectAvatar = (avatar) => {
    setPhoto(avatar);
    setShowAvatarModal(false);
  };

  return (
    <div className={style.container} style={{background: chessColor?.fondo}}>
      <div className={style.userprofile} >
      <div className={style.column}>
        <div className={style.photo} style={{border: `1px solid ${chessColor.color}`}}>
          <div className={style.profileimage}>
            <img src={photo || user.photo} alt="product-photo" height={'200px'} />
          </div>
          <div className={style.upload}>
            <input 
              type='file' 
              ref={fileRef} 
              hidden accept='image/*'
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div className={style.label} onClick={()=>fileRef.current.click()}>
             <div>
             <svg xmlns="http://www.w3.org/2000/svg" style={{marginLeft: '4.5px'}} width="75%" height="75%" fill="currentColor" className="bi bi-camera2" viewBox="0 0 16 16">
                <path d="M5 8c0-1.657 2.343-3 4-3V4a4 4 0 0 0-4 4"/>
                <path d="M12.318 3h2.015C15.253 3 16 3.746 16 4.667v6.666c0 .92-.746 1.667-1.667 1.667h-2.015A5.97 5.97 0 0 1 9 14a5.97 5.97 0 0 1-3.318-1H1.667C.747 13 0 12.254 0 11.333V4.667C0 3.747.746 3 1.667 3H2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1h.682A5.97 5.97 0 0 1 9 2c1.227 0 2.367.368 3.318 1M2 4.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0M14 8A5 5 0 1 0 4 8a5 5 0 0 0 10 0"/>
              </svg>
             </div>
            </div>
          </div>
          <div className={style.carga}>
            {fileUploadError ? 
              (<span style={{color: '#d20b0b'}}>
                 {'Error al cargar la imagen (Max. 5mb)' }
              </span>) :
              filePerc > 0 && filePerc < 100 ? 
             ( <ProgressBar className={style.progress} now={filePerc} label={`${filePerc}%`} />) :
              filePerc === 100 ? 
             ( <span style={{color:'#0e8527'}}>
                  Carga exitosa
              </span>) :
             ('')
            }
          </div>
          <div
            className={style.avatar}
            onClick={() => setShowAvatarModal(true)} // Abre el modal al hacer clic
          >
            <span style={{color: '#0066CC'}}>O elige un avatar</span>
            <img src="/icon/avatar.png" alt="" className={style.imgAvatar}/>
          </div>
          
        </div>
      </div>
      <div className={style.column1}>
        <div className={style.inputs}>
          <div className={style.profiledetails}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>{language.name}</Form.Label>
              <Form.Control type="text" placeholder={language.name} name="name" value={name} onChange={(e) => setName(e.target.value)}/>
            </Form.Group>
            {/* <div className={style.detailrow}>
              <label htmlFor="name">Name:</label>
              <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div> */}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>{language.lastName}</Form.Label>
              <Form.Control type="text" placeholder={language.lastName} name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
            </Form.Group>
            {/* <div className={style.detailrow}>
              <label htmlFor="lastName">Last Name:</label>
              <input type="text" name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div> */}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>{language.username}</Form.Label>
              <Form.Control type="text" placeholder={language.username} name="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            </Form.Group>
            {/* <div className={style.detailrow}>
              <label htmlFor="username">Username:</label>
              <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div> */}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>{language.email}</Form.Label>
              <Form.Control type="email" placeholder={language.email} name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </Form.Group>
            {/* <div className={style.detailrow}>
              <label htmlFor="email">Email:</label>
              <input type="email" name="email" value={email} disabled onChange={(e) => setEmail(e.target.value)} />
            </div> */}
            <div className={style['country-select']}>
              <label htmlFor="country"> Country</label>
              <input
                type="text"
                name="country"
                value={selectedCountry}
                onChange={handleCountryChange}
                onInput={handleFilterOptions}
                placeholder="Seleccione o escriba un país"
                list="country-options"
              />
              <datalist id="country-options">
                {filteredOptions.map((option) => (
                  <option value={option} key={option} />
                ))}
              </datalist>
            </div>
            <button className={style.lightbgyellow} onClick={handleUpdate}>Actualizar Perfil</button>
          </div>
        </div>
      </div>
      <AvatarSelectorModal
        show={showAvatarModal}
        handleClose={() => setShowAvatarModal(false)}
        avatars={avatars}
        selectAvatar={selectAvatar}
      />
    </div>
    </div>
  );
  
};

export default UserProfile;

