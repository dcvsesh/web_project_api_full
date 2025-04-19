const express = require('express');
const router = express.Router();
const {getCards, createCard, deleteCard, likeCard, dislikeCard} = require("../controllers/Cards")
const { cardValidator } = require('../validators/index');

router.get('/', getCards);
router.post('/', cardValidator, createCard);
router.delete('/:cardId',deleteCard);
//
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes',dislikeCard);

module.exports = router;
