const { generateToken } = require("../config/jwt");
const { comparePassword } = require("../helpers/authHelpers");
const User = require("../model/User");
const axios = require('axios');

exports.login = async(req, res) => {
    const { email , password } = req.body;

    try {
  
      //validation
      if(!email || !password){
        return res.status(404).send({
            succes: false,
            message: 'Invalid email or password'
        });
    }
      // Buscar al usuario en la base de datos por su nombre de usuario
      const user = await User.findOne({ email },' -photo -partida');
  
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Email is not registerd'
         });
      }
  
      // Comparar la contraseña proporcionada con la almacenada en la base de datos
      const isPasswordValid = await comparePassword(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Password'
         });
      }
  
      // Si las credenciales son válidas, genera un token JWT y envíalo en la respuesta
      const token = generateToken({id: user._id.toString()}, '120d');
      res.json({
        success: true,
        message: 'login successfully',
        user,
        token });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error en el servidor' });
    }
}

exports.googleAuth = async (req, res) => {
  try {
    const { username, email, photo, country, imagenBandera } = req.body;

    // Lógica para buscar o crear un usuario en tu base de datos
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        username,
        email,
        photo,
        country,
        imagenBandera
      });
      await user.save();
    }

    const token = generateToken({id: user._id.toString()}, '120d');

    res.json({
      success: true,
      message: 'User authenticated successfully',
      user: {
        username: user.username,
        email: user.email,
        photo: user.photo,
        country: user.country,
        imagenBandera: user.imagenBandera
      },
      token
    });
  } catch (error) {
    console.error('Error in Google auth:', error);
    res.status(500).json({
      success: false,
      message: 'Error in Google authentication',
      error: error.message
    });
  }
};

exports.getIp = async (req, res) => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get IP' });
  }
}

exports.getGeo = async (req, res) => {
  const { ip } = req.params;
  try {
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get geolocation' });
  }
}