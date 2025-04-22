const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res) => {
  try {
    const users = await User.find().orFail(() => {
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
    const user = await User.findById(req.params.userId).orFail(() => {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    });
    res.json(user);
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Error al buscar usuario", error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar, email, password } = req.body;
    // 1. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    // 2. Crear el usuario con los valores por defecto (si no se envían name/about/avatar)
    const newUser = new User({
      name: name || 'Jacques Cousteau',
      about: about || 'Explorador',
      avatar: avatar || 'https://hips.hearstapps.com/hmg-prod/images/leighton-meester-attends-los-angeles-special-screening-of-news-photo-1608631629.?crop=1xw:0.49906xh;center,top&resize=1200:*',
      email,
      password: hashedPassword,
    });
    // 3. Guardar en la base de datos
    const savedUser = await newUser.save();
    // 4. Devolver respuesta SIN el password (seguridad)
    res.status(201).json({
      _id: savedUser._id,
      name: savedUser.name,
      about: savedUser.about,
      avatar: savedUser.avatar,
      email: savedUser.email,
    });
  } catch (error) {
    // Manejo específico para errores de duplicado (email único)
    if (error.code === 11000) {
      return res.status(409).json({ message: 'El correo electrónico ya está registrado' });
    }
    // Otros errores
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
};

//
const updateUserProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
req.user._id,
      { name, about }
    ).orFail(() => {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    });
    res.json(updatedUser);
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Error al actualizar el perfil", error: error.message });
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const updateAvatar = await User.findByIdAndUpdate(
req.user._id,
      { avatar }
    ).orFail(() => {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    });
    res.json(updateAvatar);
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Error al actualizar el avatar", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // 1. Buscar usuario por email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos' });
    }
    // 2. Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos' });
    }
    // 3. Crear token JWT (expira en 7 días)
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || 'tu-secreto-seguro', // Usa una variable de entorno en producción
      { expiresIn: '7d' }
    );
    // 4. Enviar respuesta con token (sin datos sensibles)
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor durante el login', error: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    // El middleware auth ya añadió req.user._id
    const user = await User.findById(req.user._id).orFail(() => {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    });

    res.json({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email
    });

  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Error al obtener usuario actual", error: error.message });
  }
};



module.exports = {
  getUsers, getUserId, createUser, updateUserProfile, updateUserAvatar, login, getCurrentUser
};