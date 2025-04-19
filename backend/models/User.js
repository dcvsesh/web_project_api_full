const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Jacques Cousteau',
    minlength: [2, "El nombre debe de tener al menor 2 caracteres"],
    maxlength: [30,"El nombre debe de tener como máximo 30 caracteres"],
  },
  about: {
    type: String,
    default: 'Explorador',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://ejemplo.com/avatar-default.jpg',
    validate: {
      validator: (value) => validator.isURL(value),
      message: 'La URL de la imagen no es válida',
    },
  },
  // Nuevos campos:
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true, // Para evitar duplicados
    validate: {
      validator: (value) => validator.isEmail(value), // Validación de email
      message: 'El formato del email no es válido',
    },
  },
  
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    select: false, // Evita que se devuelva en consultas automáticas
  },

});

module.exports = mongoose.model('User', userSchema);