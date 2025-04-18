const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  ValidationError,
  InternalServerError
} = require('../middlewares/errors');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').orFail(() => {
      throw new NotFoundError("No se encontraron usuarios");
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getUserId = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select('-password').orFail(() => {
      throw new NotFoundError("Usuario no encontrado");
    });
    res.json(user);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError("ID de usuario no válido"));
    } else {
      next(error);
    }
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, about, avatar, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError("El correo electrónico ya está registrado");
    }

    const user = await User.create({ name, about, avatar, email, password });
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new ValidationError("Datos de usuario no válidos", error.errors));
    } else if (error.code === 11000) {
      next(new ConflictError("El correo electrónico ya está registrado"));
    } else {
      next(new InternalServerError("Error al crear usuario"));
    }
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true }
    ).select('-password').orFail(() => {
      throw new NotFoundError("Usuario no encontrado");
    });

    res.json(updatedUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new ValidationError("Datos de perfil no válidos", error.errors));
    } else {
      next(error);
    }
  }
};


const updateUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;

    if (!validator.isURL(avatar)) {
      throw new BadRequestError("La URL del avatar no es válida");
    }

    const updatedAvatar = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true }
    ).select('-password').orFail(() => {
      throw new NotFoundError("Usuario no encontrado");
    });

    res.json(updatedAvatar);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new ValidationError("URL de avatar no válida", error.errors));
    } else {
      next(error);
    }
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Email y contraseña son requeridos");
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError("Credenciales incorrectas");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("Credenciales incorrectas");
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || 'tu-secreto-seguro',
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password').orFail(() => {
      throw new NotFoundError("Usuario no encontrado");
    });
    res.json(user);
  } catch (error) {
    next(error);
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