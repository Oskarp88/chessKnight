const { generateToken } = require("../config/jwt");
const { comparePassword, hashPassword } = require("../helpers/authHelpers");
const User = require("../model/User");
const axios = require('axios');
const { generateRandomUsername } = require("../utils/generateUsername");
const { generarPasswordAleatorio } = require("../utils/generarPasswordAleatorio,");

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
      const user = await User.findOne({ email },' -partida');
  
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

    // buscar o crear un usuario en la base de datos
    let user = await User.findOne({ email });
    if (!user) {
      // Generar una contraseña aleatoria y un nombre de usuario aleatorio
      // const passwordRandom = await generarPasswordAleatorio();
      // const hashedPassword = await hashPassword(passwordRandom);
       // Generar un nombre de usuario aleatorio si es necesario
      const usernameRandom = await generateRandomUsername(username);
      user = new User({
        username: usernameRandom,
        email,
        photo,
        country,
        imagenBandera,
      });

      await user.save();
       
      const token = generateToken({id: user._id.toString()}, '120d');

      return res.json({
          success: true,
          message: 'Continue with the registration',
          user,
          token
      });
    }

    const token = generateToken({id: user._id.toString()}, '120d');

    // Verificar si falta información para completar el perfil
    if(!user.name || !user.lastName || !user.country){
      return res.json({
        success: true,
        message: 'Continue with the registration',
        user,
        token
      });
    }
        
    //el usuario está autenticado
    res.json({
      success: true,
      message: 'User authenticated successfully',
      user,
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