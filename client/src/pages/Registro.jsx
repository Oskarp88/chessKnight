import React, { useEffect, useState } from 'react';
import style from './Registro.module.css';
import axios from 'axios';
import  toast  from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useChessboardContext } from '../context/boardContext';
import GoogleOAuht from '../components/oauth/GoogleOAuth';
import { baseUrl } from '../utils/services';
import { useLanguagesContext } from '../context/languagesContext';

const Registro = ({ onSubmit }) => {
  const { boardColor } = useChessboardContext();
  const {language} = useLanguagesContext();
  const [countries, setCountries] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    imagenBandera: ''
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
  });

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

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (!formData.name) {
      isValid = false;
      errors.name = 'Name is required';
    }

    if (!formData.lastName) {
      isValid = false;
      errors.lastName = 'Last name is required';
    }

    if (!formData.userName) {
      isValid = false;
      errors.userName = 'Username is required';
    }

    if (!formData.email) {
      isValid = false;
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      isValid = false;
      errors.email = 'Invalid email format';
    }

    if (!formData.password) {
      isValid = false;
      errors.password = 'Password is required';
    } else if (formData.password.length < 6 || !/[A-Z]/.test(formData.password) || !/\d/.test(formData.password)) {
      isValid = false;
      errors.password = 'Password must be at least 6 characters long and contain at least one uppercase letter and one number';
    }

    if (formData.password !== formData.confirmPassword) {
      isValid = false;
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!selectedCountry) {
      isValid = false;
      errors.country = 'Country is required';
    } else if (!countries.find((country) => country.name.common === selectedCountry)) {
      isValid = false;
      errors.country = 'Invalid country';
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleCountryChange = (event) => {
    const { value } = event.target;
    setSelectedCountry(value);
    const selectedCountryData = countries.find((country) => country.name.common === value);
    if (selectedCountryData) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        country: value,
        imagenBandera: selectedCountryData.flags.png,
      }));
    }
  };
  

  const handleFilterOptions = (event) => {
    const { value } = event.target;
    const filtered = countries.filter((country) =>
      country.name.common.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered.map((country) => country.name.common));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post(`${baseUrl}/user`, {
          name: formData.name,
          lastName: formData.lastName,
          username: formData.userName,
          email: formData.email,
          password: formData.password,
          country: formData.country,
          imagenBandera: formData.imagenBandera
        });

        if (response.data.success) {
          toast.success(response.data.message);
          navigate('/login');
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error('register fallied');
      }
    }
  };


  return (
    <div className={style.Registro}>
      <div id={style.loginbox}>
        <div className={style.container}>
          <form className={style.letf} onSubmit={handleSubmit}>
            <h1>{language.Sign_up}</h1>
            <input
              type="text"
              name="name"
              placeholder={language.name}
              value={formData.name}
              onChange={handleChange}
            />
            {formErrors.name && <div className={style.error}>{formErrors.name}</div>}
            <input
              type="text"
              name="lastName"
              placeholder={language.lastName}
              value={formData.lastName}
              onChange={handleChange}
            />
            {formErrors.lastName && <div className={style.error}>{formErrors.lastName}</div>}
            <input
              type="text"
              name="userName"
              placeholder={language.username}
              value={formData.userName}
              onChange={handleChange}
            />
            {formErrors.userName && <div className={style.error}>{formErrors.userName}</div>}
            <input
              type="text"
              name="email"
              placeholder={language.email}
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder={language.password}
              value={formData.password}
              onChange={handleChange}
            />
            {formErrors.password && <div className={style.error}>{formErrors.password}</div>}
            <input
              type="password"
              name="confirmPassword"
              placeholder={`${language.confirm} ${language.password}`}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {formErrors.confirmPassword && <div className={style.error}>{formErrors.confirmPassword}</div>}
            <div className={style['country-select']}>
              <input
                type="text"
                name="country"
                value={selectedCountry}
                onChange={handleCountryChange}
                onInput={handleFilterOptions}
                placeholder={language.Select_or_enter_a_country}
                list="country-options"
              />
              <datalist id="country-options">
                {filteredOptions.map((option) => (
                  <option value={option} key={option} />
                ))}
              </datalist>
            </div>
            <input type="submit" name="signup_submit" value={language.sign_me_up} />
          </form>

          <div className={style.right}>
            <span className={style.loginwith}>{language.Sign_in_with}<br />{language.social_network}</span>
            <GoogleOAuht/>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Registro;
