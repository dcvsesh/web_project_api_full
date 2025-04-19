const express = require('express');
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const mongoose = require('mongoose');
const { login, createUser } = require("./controllers/Users");
const auth = require('./middlewares/auth');

const app = express();
const PORT = 3000;
mongoose.connect("mongodb://localhost:27017/aroundb",{})
.then(() => {
  console.log('Conectado a la base de datos')
})
.catch((error) => {
  console.log("Error al conectar a la base de datos", error)
});

app.use(express.json());

// Rutas de autenticación
app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
// Rutas protegidas
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);


app.get("*", (req, res) => {
  res.status(404).send({ message: "Recurso solicitado no encontrado" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
