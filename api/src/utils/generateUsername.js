const User = require("../model/User");

exports.generateRandomUsername = async (username) => {
    const baseUsername = username.substring(0, 4); // Primeras 4 letras
    let newUsername;
    let userExists = true;
  
    while (userExists) {
      const randomNumbers = Math.floor(1000 + Math.random() * 9000); // Generar 4 números aleatorios
      newUsername = `${baseUsername}${randomNumbers}`;
  
      // Verificar si el username ya existe en la base de datos
      userExists = await User.findOne({ username: newUsername });
    }
  
    return newUsername;
  };