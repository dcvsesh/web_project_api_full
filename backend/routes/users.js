const express = require('express');
const router = express.Router();
const {getUsers, getUserId, createUser, updateUserProfile, updateUserAvatar, getCurrentUser} = require("../controllers/Users")
const auth = require('../middlewares/auth');
const {
  validateUserCreation,
  validateUserUpdate,
  validateAvatarUpdate,
  validateObjectId
} = require('../middlewares/validation');

// Crear usuario
router.post('/', validateUserCreation, createUser);

// Rutas protegidas por autenticación
router.use(auth);
// Ruta para obtener información del usuario actual
router.get('/me', getCurrentUser);
// Obtener todos los usuarios
router.get('/', getUsers);
// Obtener usuario por ID (con validación de ObjectId)
router.get('/:userId', validateObjectId, getUserId);

// Actualizar perfil de usuario
router.patch('/me', validateUserUpdate, updateUserProfile);
// Actualizar avatar de usuario
router.patch('/me/avatar', validateAvatarUpdate, updateUserAvatar);

module.exports = router;