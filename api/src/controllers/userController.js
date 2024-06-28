const { verifyToken } = require('../config/jwt');
const User = require('../model/User');
const nodemailer = require('nodemailer');
const { hashPassword } = require('../helpers/authHelpers.js');
const crypto = require('crypto');
const fs = require('fs');

require('dotenv').config();
   
exports.getUser = async(req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId, '-password -photo -partida');
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
      }
}

exports.getUserBandera = async(req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId, '-password -photo -partida');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).send(user.imagenBandera);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.getAllUser = async(req, res) => {
    try {
        const users = await User.find({}, '-password -photo -partida'); // Excluye el campo de contraseña en la respuesta
        res.json(users);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
      }
}

exports.protectedUser = (req, res) => {
    console.log('estas autoriazdo')
    res.status(200).send({ok: true});
}

exports.createUser = async(req, res) => {
    const {
        name, 
        lastName,
        username, 
        email, 
        password,  
        country,
        imagenBandera
    } = req.body;
    //validations
    
      try {
        
        if(!name){
            return res.send({message: 'Name is Required'})
        }
        if(!email){
            return res.send({message: 'Email is Required'})
        }
        if(!password){
            return res.send({message: 'Password is Required'})
        }
        if(!username){
            return res.send({message: 'username is Required'})
        }
        if(!lastName){
            return res.send({message: 'lastName is Required'})
        }
        if(!country){
            return res.send({message: 'Country is Required'})
        }
    
    
        //check user
        const existingUser = await User.findOne({email})
    
        //existing user
        if(existingUser){
          throw new Error('Already Register please login');
        }
    
        //register user
        const hashedPassword = await hashPassword(password);
        //save
         await new User({
          name,
          lastName,
          username,
          email,
          imagenBandera,
          password:hashedPassword,
          role: 'user',     
          country,
        }).save();
    
        res.status(201).send({
            success: true,
            message: 'User Register Successfully',
            user: JSON.stringify(req.body), // Convertir a cadena JSON
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in Register',
            error
        });
    }
}

exports.updateUser = async(req, res) => {
    const { userId } = req.params; // Obtén el ID del usuario desde los parámetros de la ruta
  const { name, lastName, username, country } = req.fields;
  // console.log(name, lastName, username, country);
  const {photo} = req.files;

    try{
      const user = await User.findById(userId); // Encuentra el usuario por su ID en la base de datos

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      // Actualiza los campos del usuario con los nuevos valores proporcionados
     const userUpdate = await User.findByIdAndUpdate(userId,{
        name: name || user.name,
        lastName: lastName || user.lastName,
        username: username || user.username,
        country: country || user.country,
     },{new: true});

      // Verifica si se proporcionó una imagen
      if(photo){
        user.photo.data = fs.readFileSync(photo.path);
        user.photo.contentType = photo.type;
     }
      
      await user.save(); // Guarda los cambios en la base de datos
    
      res.send({
      success: true,
      message: 'Datos de usuario actualizados correctamente',
      userUpdate
    });
  } catch (error) {
    console.log('error', error);
  if (error.response) {
    // Error de respuesta desde el servidor (código de estado no 2xx)
    console.log('Response error:', error.response.data);
  } else if (error.request) {
    // No se recibió ninguna respuesta del servidor
    console.log('No response from server');
  } else {
    // Error en la configuración de la solicitud o en el proceso de envío
    console.log('Request error:', error.message);
  }
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
}

exports.deleteUser = async(req, res) => {
    const { id } = req.params;

  User.findByIdAndUpdate(id, { deleted: true }, { new: true }) // Actualiza el campo "deleted" a true y devuelve el documento actualizado
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(user);
    })
    .catch(error => {
      res.status(500).json({ message: 'Error al borrar el usuario' });
    });
}

exports.forgotPassword = async(req, res) => {
    const { email } = req.body;
  try {
    // Verificar si el correo electrónico existe en la base de datos
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'No se encontró un usuario con ese correo electrónico', token });
    }

       // Generar un token único y establecer la fecha de expiración (10 minutos)
       const token = crypto.randomBytes(20).toString('hex');
       const expirationDate = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
   
       // Actualizar el usuario en la base de datos con el token y la fecha de expiración
       user.resetToken = token;
       user.resetTokenExpiration = expirationDate;
       await user.save();

    const transporter = nodemailer.createTransport({
      // Configura aquí tus credenciales de correo electrónico
      service: 'gmail',
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: email,
      subject: 'Restablecer contraseña',
      text: `Haz clic en el siguiente enlace para restablecer tu contraseña: http://localhost:3000/reset-password/${token}`, 
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo electrónico enviado con éxito', token });
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    res.status(500).json({ error: 'Error al enviar el correo electrónico' });
  }
}

exports.resetPassword = async(req, res) =>{
    const { token, newPassword } = req.body;

    try {
       // Buscar al usuario en la base de datos por el token y la fecha de expiración
       const user = await User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ error: 'Token inválido o expirado' });
      }
       
      const hashedPassword = await hashPassword(newPassword);
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiration = null;
      await user.save();
  
      res.status(200).json({ message: 'Contraseña restablecida con éxito' });
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      res.status(500).json({ error: 'Error al restablecer la contraseña' });
    }
}

exports.roleUser = async(req, res) =>{
    const { id } = req.params;
    const { role } = req.body;
  
    User.findByIdAndUpdate(id, { role }, { new: true }) // Actualiza el rol y devuelve el documento actualizado
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
      })
      .catch(error => {
        res.status(500).json({ message: 'Error al actualizar el usuario' });
      });
}

exports.photoUser = async(req, res) => {
    try {
        const user = await User.findById(req.params.pid).select('photo');
        
        if(user.photo.data){
            res.set('Content-type', user.photo.contentType)
            return res.status(200).send(user.photo.data);
        }else{
          res.status(404).json({ error: 'Imagen no encontrada' });
        }
    } catch (error) {
        console.log('error en la imagen');
        res.status(500).send({
            success:false,
            message: 'Error while getting photo',
            error
        })
    }
}

// Obtener estadísticas de un jugador específico
exports.statsUser = async(req, res) => {
    const { id } = req.params;
  
    User.findById(id, '-password -photo -partida').then(user => {
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const {
             games,
             gamesWon, 
             gamesLost, 
             gamesTied,
             gamesBullet,
             gamesWonBullet,
             gamesLostBullet,
             gamesTiedBullet,
             gamesBlitz,
             gamesWonBlitz,
             gamesLostBlitz,
             gamesTiedBlitz,
             gamesFast,
             gamesWonFast,
             gamesLostFast,
             gamesTiedFast
        } = user;

        res.json({ 
            games,
             gamesWon, 
             gamesLost, 
             gamesTied,
             gamesBullet,
             gamesWonBullet,
             gamesLostBullet,
             gamesTiedBullet,
             gamesBlitz,
             gamesWonBlitz,
             gamesLostBlitz,
             gamesTiedBlitz,
             gamesFast,
             gamesWonFast,
             gamesLostFast,
             gamesTiedFast
         });
        })
        .catch(error => {
        res.status(500).json({ message: 'Error al obtener las estadísticas del jugador' });
    });
}

//obtener el elo 
exports.userElo = async(req, res) => {
  const { id } = req.params;
  console.log('eloId', id)
  User.findById(id, '-password -photo -partida').then(user => {
      if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const {
           eloBullet,
           eloBlitz,
           eloFast     
     } = user;

      res.json({ 
          eloBullet,
          eloBlitz,
          eloFast
       });
      })
      .catch(error => {
      res.status(500).json({ message: 'Error al obtener el elo del jugador'});
  });
}

