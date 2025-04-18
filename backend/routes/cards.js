const express = require('express');
const router = express.Router();
const {getCards, createCard, deleteCard, likeCard, dislikeCard} = require("../controllers/Cards")
const auth = require('../middlewares/auth');
const {
  validateCardId,
  validateCardCreation
} = require('../middlewares/validation');

// Todas las rutas de cards requieren autenticación
router.use(auth);

// Obtener todas las tarjetas
router.get('/', getCards);

// Crear nueva tarjeta (con validación)
router.post('/', validateCardCreation, createCard);

// Operaciones con tarjetas específicas (con validación de ID)
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = router;
