const express = require('express');
const router = express.Router();
const {getUsers, getUserId, createUser, updateUserProfile, updateUserAvatar, getCurrentUser} = require("../controllers/Users")
const auth = require('../middlewares/auth');

// Ruta para obtener información del usuario actual
router.get('/me', auth, getCurrentUser);
//
router.get('/', getUsers);
router.get('/:userId', getUserId);
router.post('/',createUser);
//
router.patch('/me',updateUserProfile);
router.patch('/me/avatar',updateUserAvatar)

module.exports = router;