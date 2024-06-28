const jwt = require('jsonwebtoken');

 // Cambia esto con una clave segura en un entorno de producción
function generateToken(user,expired) {
  const token = jwt.sign({ user, role: user.role }, process.env.SECRETA_JWT, { expiresIn: expired });
  return token;
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.SECRETA_JWT);
    return decoded;
  } catch (error) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };
