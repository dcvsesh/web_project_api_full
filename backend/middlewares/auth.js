const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // 1. Extraer el token del header 'Authorization'
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }
  try {
    // 2. Verificar el token
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || 'tu-secreto-seguro' // Usa el mismo secreto que en login
    );
    // 3. Añadir el payload del token a la solicitud
    req.user = payload; // { _id: '...' }
    next();
  } catch (error) {
    // Manejar errores de token inválido/expirado
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    res.status(500).json({ message: 'Error en la autenticación' });
  }
};

module.exports = auth;
