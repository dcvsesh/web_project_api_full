const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // 1. Obtener el token del header 'Authorization'
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Autorización requerida'
      });
    }

    // 2. Extraer el token (eliminar 'Bearer ')
    const token = authorization.replace('Bearer ', '');

    // 3. Verificar el token
    let payload;
    try {
      payload = jwt.verify(
        token,
        process.env.JWT_SECRET || 'tu-secreto-seguro'
      );
    } catch (err) {
      return res.status(401).json({
        message: 'Token inválido o expirado'
      });
    }

    // 4. Asignar el payload al request
    req.user = payload;

    // 5. Continuar con el siguiente middleware
    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    res.status(500).json({
      message: 'Error interno durante la autenticación'
    });
  }
};

module.exports = auth;