import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import viteLogo from "/vite.svg";
import Footer from "../components/Footer/Footer";
import Main from "../components/Main/Main";
import Header from "./Header/Header";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { api } from "../utils/api";
import Login from "./Login";
import Register from "./Register";
import { signIn, signUp, userInfo } from "../utils/auth";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  useEffect(() => {
    (async () => {
      await api.getUserInfo().then((data) => {
        setCurrentUser(data);
      });
    })();
  }, []);

  const handleUpdateUser = (data) => {
    (async () => {
      await api
        .setUserInfo(data)
        .then((newData) => {
          setCurrentUser(newData);
          handleClosePopup();
        })
        .catch((error) => console.error(error));
    })();
  };

  const handleUpdateAvatar = (data) => {
    api
      .profileImage(data)
      .then((newData) => {
        setCurrentUser(newData); // Actualizar el estado del usuario actual
        handleClosePopup(); // Cerrar el popup después de actualizar
      })
      .catch((error) => console.error(error));
  };

  const [popup, setPopup] = useState(null);
  function handleOpenPopup(popup) {
    setPopup(popup);
  }

  function handleClosePopup() {
    setPopup(null);
  }

  //Cartas
  const [cards, setCards] = useState([]);
  useEffect(() => {
    api.getInitialCards().then((data) => {
      setCards(data);
    });
  }, []);

  //Likes
  async function handleCardLike(card) {
    // Verifica una vez más si a esta tarjeta ya les has dado like
    const isLiked = card.isLiked;
    // Envía una solicitud a la API y obtén los datos actualizados de la tarjeta
    await api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard
          )
        );
      })
      .catch((error) => console.error(error));
  }

  //Eliminar targetas
  async function handleCardDelete(card) {
    await api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) =>
          state.filter((currentCard) => currentCard._id !== card._id)
        );
      })
      .catch((error) => console.error(error));
  }

  //Agregar Targetas
  const handleAddPlaceSubmit = (data) => {
    api
      .createCard(data.name, data.link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        handleClosePopup();
      })
      .catch((error) => console.error(error));
  };

  //REGISTER
  const handleRegistration = (email, password) => {
    return signUp(email, password)
      .then((response) => {
        if (response && response.error) {
          console.error("Error de registro:", response.error);
          throw new Error(response.error);
        }
        return response;
      })
      .catch((error) => {
        console.error("Fallo en el Registro:", error.message);
        throw error; // Re-lanza el error para que lo maneje el componente Register
      });
  };

  //LOGIN
  const handleLogin = (email, password) => {
    signIn(email, password).then((response) => {
      if (response.error) {
        setIsLoggedIn(false);
        console.error(response.error);
        return;
      }
      localStorage.setItem("token", response.token);
      setIsLoggedIn(true);
      // Obtenemos los datos del usuario de la API
      api.getUserInfo().then((userData) => {
        // Combinamos los datos de la API con el email del login
        const fullUserData = {
          ...userData, // name, about, avatar, _id
          email: email, // Añadimos el email
        };
        setCurrentUser(fullUserData);
        localStorage.setItem("currentUser", JSON.stringify(fullUserData));
      });
      navigate("/");
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      // Carga los datos del usuario
      api.getUserInfo().then((data) => {
        // Combina los datos de la API con el email guardado en localStorage
        const storedUser = JSON.parse(
          localStorage.getItem("currentUser") || "{}"
        );
        const userData = {
          ...data,
          email: storedUser.email || "", // Mantiene el email si existe
        };
        setCurrentUser(userData);
        localStorage.setItem("currentUser", JSON.stringify(userData));
      });
      navigate("/");
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        handleUpdateUser,
        onUpdateAvatar: handleUpdateAvatar,
      }}
    >
      <div className="page">
        <Header />
        <Routes>
          <Route path="/signin" element={<Login handleLogin={handleLogin} />} />
          <Route
            path="/signup"
            element={<Register handleRegistration={handleRegistration} />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Main
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  onOpenPopup={handleOpenPopup}
                  onClosePopup={handleClosePopup}
                  onAddPlaceSubmit={handleAddPlaceSubmit}
                  popup={popup}
                />
                <Footer />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
