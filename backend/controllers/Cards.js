const Card = require("../models/Card");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ValidationError,
  InternalServerError
} = require('../middlewares/errors');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find().orFail(() => {
      throw new NotFoundError("No se encontraron tarjetas");
    });
    res.json({ success: true, data: cards });
  } catch (error) {
    next(error);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;

    const newCard = new Card({ name, link, owner });
    const savedCard = await newCard.save();

    res.status(201).json({ success: true, data: savedCard });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new ValidationError("Datos de tarjeta no válidos", error.errors));
    } else {
      next(new InternalServerError("Error al crear tarjeta"));
    }
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    const card = await Card.findById(cardId).orFail(() => {
      throw new NotFoundError("Tarjeta no encontrada");
    });

    if (card.owner.toString() !== req.user._id) {
      throw new ForbiddenError("No tienes permiso para eliminar esta tarjeta");
    }

    await Card.findByIdAndDelete(cardId);

    res.status(200).json({
      success: true,
      message: "Tarjeta eliminada exitosamente",
      data: { id: cardId }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError("ID de tarjeta no válido"));
    } else {
      next(error);
    }
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true }
    ).orFail(() => {
      throw new NotFoundError("Tarjeta no encontrada");
    });

    res.json({ success: true, data: card });
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError("ID de tarjeta no válido"));
    } else if (error.name === 'ValidationError') {
      next(new ValidationError("Datos no válidos al dar like"));
    } else {
      next(error);
    }
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).orFail(() => {
      throw new NotFoundError("Tarjeta no encontrada");
    });

    res.json({ success: true, data: card });
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError("ID de tarjeta no válido"));
    } else {
      next(error);
    }
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
};