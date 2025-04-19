const express = require('express');
const router = express.Router();
const {getUsers, getUserId, createUser, updateUserProfile, updateUserAvatar, getCurrentUser } = require("../controllers/Users")
const auth = require('../middlewares/auth');

// Rutas públicas
router.post('/', createUser); // Registro de usuario (signup)

// Rutas protegidas (requieren autenticación)
router.use(auth);

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserId);
router.patch('/me', updateUserProfile);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;