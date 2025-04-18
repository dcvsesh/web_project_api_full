const express = require('express');
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const mongoose = require('mongoose');
const { createUser, login } = require('./controllers/Users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const { NotFoundError } = require('./middlewares/errors'); // Importa el error personalizado
const { requestLogger, errorLogger } = require('./middlewares/logging');

const app = express();
const PORT = 3000;
// Conexión a MongoDB
mongoose.connect("mongodb://localhost:27017/aroundb", {})
  .then(() => console.log('Conectado a la base de datos'))
  .catch((error) => console.log("Error al conectar a la base de datos", error));

// Middlewares
app.use(express.json());
app.use(requestLogger);

app.post('/signup', createUser);
app.post('/signin', login);

// Middlewares de Autenticación
app.use(auth);

// Middlewares Rutas Protegidas
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);


// Middleware para rutas no encontradas (404)
app.use((req, res, next) => {
  next(new NotFoundError('Recurso solicitado no encontrado'));
});

app.use(errorLogger);
// Middleware de manejo centralizado de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});