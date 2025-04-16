const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre es requerido"],
    minlength: [2, "El nombre debe de tener al menor 2 caracteres"],
    maxlength: [30, "El nombre debe de tener como máximo 30 caracteres"],
  },
  link: {
    type: String,
    required: [true,"El link es requerido"],
    validate: {
    validator: function (value) {
        return /^(https?:\/\/)(www\.)?[\w.-]+\.[a-z]{2,6}(\/[\w._~:/?%#[\]@!$&'()*+,;=-]*)?#?$/i.test(value);
      },
      message: "La URL de la imagen no es válida."
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    default: [],
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Card', cardSchema);