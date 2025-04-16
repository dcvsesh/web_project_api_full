const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require('jsonwebtoken');


const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').orFail(() => {
      const error = new Error("No se encontraron usuarios");
      error.statusCode = 404;
      throw error;
    });
    res.json(users);
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Error al obtener a los usuarios", error: error.message });
  }
};

const getUserId = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password').orFail(() => {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    });
    res.json(user);
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: "ID de usuario no válido" });
    }
    res.status(500).json({ message: "Error al buscar usuario", error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar, email, password } = req.body;

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "El correo electrónico ya está registrado"
      });
    }

    // Crear el usuario (el hash se maneja en el pre-save hook del modelo)
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password
    });
    // No devolver la contraseña en la respuesta
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Manejo de errores de validación de Mongoose
      return res.status(400).json({
        message: "Datos de usuario no válidos",
        errors: error.errors
      });
    } else if (error.code === 11000) {
      // Error de duplicado (por si acaso el unique no se captura antes)
      return res.status(409).json({
        message: "El correo electrónico ya está registrado"
      });
    }
    // Error genérico del servidor
    console.error("Error al crear usuario:", error);
    res.status(500).json({
      message: "Error interno del servidor al crear usuario"
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true }
    ).select('-password').orFail(() => {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    });
    res.json(updatedUser);
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: "Datos de perfil no válidos", error: error.message });
    }
    res.status(500).json({ message: "Error al actualizar el perfil", error: error.message });
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;

    if (!validator.isURL(avatar)) {
      return res.status(400).json({ message: "La URL del avatar no es válida" });
    }

    const updatedAvatar = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true }
    ).select('-password').orFail(() => {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    });
    res.json(updatedAvatar);
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: "URL de avatar no válida", error: error.message });
    }
    res.status(500).json({ message: "Error al actualizar el avatar", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que se proporcionen email y contraseña
    if (!email || !password) {
      return res.status(400).json({
        message: "Email y contraseña son requeridos"
      });
    }

    // Buscar usuario incluyendo la contraseña (que normalmente está select: false)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: "Credenciales incorrectas"
      });
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Credenciales incorrectas"
      });
    }

    // Crear token JWT (expira en 7 días)
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || 'tu-secreto-seguro',
      { expiresIn: '7d' }
    );

    // Enviar token al cliente
    res.json({ token });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      message: "Error interno del servidor durante el login"
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    // req.user._id viene del middleware de autenticación
    const user = await User.findById(req.user._id).select('-password').orFail(() => {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    });
    res.json(user);
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({
      message: "Error al obtener información del usuario",
      error: error.message
    });
  }
};


module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
  getCurrentUser 
};