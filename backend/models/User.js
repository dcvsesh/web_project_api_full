const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Jacques Cousteau',
    required: [true,"El nombre es requerido"],
    minlength: [2, "El nombre debe de tener al menor 2 caracteres"],
    maxlength: [30, "El nombre debe de tener como máximo 30 caracteres"],
  },
  about: {
    type: String,
    required: true,
    default: 'Explorador',
    minlength: [2, "La descripción debe de tener al menor 2 caracteres"],
    maxlength: [30, "La descripción debe de tener como máximo 30 caracteres"],
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg',
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'La URL del avatar no es válida',
    },
  },
  email: {
    type: String,
    required: [true, "El email es requerido"],
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "El correo electrónico no es válido"
    }
  },
  password: {
    type: String,
    required: [true, "La contraseña es requerida"],
    select: false // No se devolverá en las consultas por defecto
  }
});

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// Método para generar JWT
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { _id: this._id },
    process.env.JWT_SECRET || 'tu-secreto-seguro', // Usa una variable de entorno
    { expiresIn: '7d' }
  );
};

// Método para comparar contraseñas (útil en el login)
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);