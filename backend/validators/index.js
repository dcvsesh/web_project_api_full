const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

// Validador personalizado para URLs
const validateURL = (value, helpers) => {
  const options = {
    protocols: ['http', 'https'],
    require_protocol: true,
    disallow_auth: true
  };

  return validator.isURL(value, options)
    ? value
    : helpers.error('string.uri');
};

// Esquema para tarjetas
const cardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateURL),
    owner: Joi.object(),
    likes: Joi.array().items(Joi.object()),
    createdAt: Joi.date()
  })
});

// Esquema para usuarios
const userValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8)
  })
});

module.exports = { cardValidator, userValidator };