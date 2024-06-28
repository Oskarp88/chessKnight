import React, { useEffect, useState } from 'react';
import style from './UserProfile.module.css'; // Importa el archivo CSS
import axios from 'axios';
import ReactCrop from 'react-image-crop';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const UserProfile = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [originalPhoto, setOriginalPhoto] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [photo, setPhoto] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(false);
  const [user, setUser] = useState({});

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

  const handleUploadIconClick = () => {
    setOriginalPhoto(photo); // Guarda la foto original
    setShowModal(true);
  };

  useEffect(() => {
    setShowModal(showModal)
  },[showModal]);

  const handleModalClose = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setShowModal(false);
  };

  const handleEditPhoto = () => {
    setEditingPhoto(true);
    setShowModal(false);
  };

  
  
  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('lastName', lastName);
      formData.append('username', username);
      formData.append('country', country);
      if (photo) {
        formData.append('photo', photo, photo.name);
      }

      const response = await axios.put(`http://localhost:8080/api/user/update/${auth.user._id}`, formData);
      if (response.data.success) {
        toast.success(`${name} is updated`, {
          autoClose: 3000,
          closeButton: <button className={style.closeButton}>X</button>,
        });
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
          {photo ? (
            <div className={style.profileimage}>
              <img src={URL.createObjectURL(photo)} alt="product-photo" height={'200px'} />
            </div>
          ) : (
            <div className={style.profileimage}>
              {user.photo ? (
                <img
                  src={`http://localhost:8080/api/user-photo/${auth.user._id}`}
                  alt="user-photo"
                  height={'200px'}
                />
              ) : (
                <img src="/assets/avatar/user.png" alt="user-photo" height={'200px'} />
              )}
            </div>
          )}
          <div className={style.uploadIcon} onClick={handleUploadIconClick}>
            {showModal && (
              <div className={style.modal}>
                <div className={style.modalContent}>
                  <h3>Choose an option</h3>
                  <div className={style.buttonGroup}>
                    <button onClick={handleEditPhoto}>Edit Photo</button>
                    <button
                      className={style.uploadButton}
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const file = e.target.files[0];
                          setPhoto(file);
                          setShowModal(false);
                        };
                        input.click();
                      }}
                    >
                      Choose Photo
                    </button>
                    <button onClick={handleModalClose}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={style.upload}>
            <label className={style.label} onClick={handleUploadIconClick}>
              <img src="/assets/avatar/outline.png" alt="icon-outline" />
            </label>
          </div>
        </div>
        {editingPhoto && (
  <div className={style.modal}>
    <div className={style.modalContent}>
      <h3>Edit Photo</h3>
      {originalPhoto || photo ? (
        <ReactCrop
          src={URL.createObjectURL(originalPhoto || photo)}
          onImageLoaded={(image) => {
            // Puedes realizar operaciones cuando la imagen se carga
          }}
          onChange={(newCrop) => {
            // Actualiza el estado del recorte
          }}
          onComplete={(crop, pixelCrop) => {
            // Puedes realizar operaciones después de completar el recorte
          }}
        />
      ) : (
        <p>No photo available for editing</p>
      )}
      <div className={style.buttonGroup}>
        <button onClick={() => setEditingPhoto(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}


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
            <div className={style.detailrow}>
              <label htmlFor="country">Country:</label>
              <input type="text" name="country" value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>
          </div>
          <button onClick={handleUpdate}>Actualizar Perfil</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

