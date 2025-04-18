const { celebrate, Joi } = require('celebrate');
const validator = require('validator');


const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

// Validación de ObjectId reutilizable
const validateId = Joi.string().required().hex().length(24);

// Esquemas de validación
module.exports = {
  validateUserCreation: celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().custom(validateURL),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8)
    })
  }),

  validateUserUpdate: celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30)
    })
  }),

  validateAvatarUpdate: celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom(validateURL)
    })
  }),

  validateLogin: celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required()
    })
  }),

  validateCardCreation: celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().custom(validateURL)
    })
  }),

  validateObjectId: celebrate({
    params: Joi.object().keys({
      cardId: validateId,
      userId: validateId
    })
  }),

  validateCardId: celebrate({
    params: Joi.object().keys({
      cardId: validateId
    })
  })
};