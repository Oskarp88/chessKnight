import React, { useEffect, useRef, useState } from 'react';
import style from './UserProfile.module.css'; // Importa el archivo CSS
import axios from 'axios';
import ReactCrop from 'react-image-crop';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../../utils/firebase';


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
      const { data } = await axios.get(`http://localhost:8080/api/user/${auth.user._id}`);
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

      const response = await axios.put(`http://localhost:8080/api/user/update/${auth.user._id}`, {
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
          user: response.data.user,
          token: response.data.token,
        });

        const data = { user: response.data.user, token: auth?.token}
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

  return (
    <div className={style.userprofile}>
      <div className={style.column}>
        <div className={style.photo}>
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
            <label className={style.label} onClick={()=>fileRef.current.click()}>
              <img src="/assets/avatar/outline.png" alt="icon-outline" />
            </label>
          </div>
          <p>
            {fileUploadError ? 
              (<span style={{color: '#d20b0b'}}>
                 {'Error al cargar la imagen (Max. 5mb)' }
              </span>) :
              filePerc > 0 && filePerc < 100 ? 
             ( <span style={{color:'#fff'}}>
                {`Cargando ${filePerc}%`}
              </span> ) :
              filePerc === 100 ? 
             ( <span style={{color:'#0e8527'}}>
                  Carga exitosa
              </span>) :
             ('')
            }
          </p>
        </div>
      </div>
      <div className={style.column}>
        <div className={style.inputs}>
          <div className={style.profiledetails}>
            <div className={style.detailrow}>
              <label htmlFor="name">Name:</label>
              <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className={style.detailrow}>
              <label htmlFor="lastName">Last Name:</label>
              <input type="text" name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className={style.detailrow}>
              <label htmlFor="username">Username:</label>
              <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className={style.detailrow}>
              <label htmlFor="email">Email:</label>
              <input type="email" name="email" value={email} disabled onChange={(e) => setEmail(e.target.value)} />
            </div>
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
            <button onClick={handleUpdate}>Actualizar Perfil</button>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default UserProfile;

