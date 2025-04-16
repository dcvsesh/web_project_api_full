const express = require('express');
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const mongoose = require('mongoose');
const { createUser, login } = require('./controllers/Users');
const auth = require('./middlewares/auth');

const app = express();
const PORT = 3000;
// Conexión a MongoDB
mongoose.connect("mongodb://localhost:27017/aroundb", {})
  .then(() => console.log('Conectado a la base de datos'))
  .catch((error) => console.log("Error al conectar a la base de datos", error));

// Middlewares
app.use(express.json());

app.post('/signup', createUser);
app.post('/signin', login);

// Middlewares de Autenticación
app.use(auth); // Todas las rutas siguientes requerirán autenticación

// Middlewares Rutas Protegidas
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

// Manejo de rutas no encontradas (protegida)
app.use((req, res) => {
  res.status(404).send({ message: "Recurso solicitado no encontrado" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});