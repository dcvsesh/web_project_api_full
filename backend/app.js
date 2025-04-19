const express = require('express');
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const mongoose = require('mongoose');
const { login, createUser } = require("./controllers/Users");
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Conexión a MongoDB
mongoose.connect("mongodb://localhost:27017/aroundb",{})
  .then(() => console.log('Conectado a la base de datos'))
  .catch((error) => console.log("Error al conectar a la base de datos", error));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Rutas públicas
app.post('/signin', login);
app.post('/signup', createUser);

// Middleware de autenticación
app.use(auth);

// Rutas protegidas
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

//
app.get("*", (req, res) => {
  res.status(404).send({ message: "Recurso solicitado no encontrado" });
});

app.use(errorLogger);
// Middleware de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});