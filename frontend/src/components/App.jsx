import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Main from "../components/Main/Main";
import Header from "./Header/Header";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { api } from "../utils/api";
import Login from "./Login";
import Register from "./Register";
import { signIn, signUp } from "../utils/auth";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [popup, setPopup] = useState(null);
  const [cards, setCards] = useState([]);

 // Verificar autenticación al cargar la app
 useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    checkToken(token);
  }
}, []);

// Cargar datos del usuario y cartas si está autenticado
useEffect(() => {
  if (isLoggedIn) {
    loadUserData();
    loadCards();
  }
}, [isLoggedIn]);

const checkToken = (token) => {
  api.setAuthToken(token);
  api.getUserInfo()
    .then((userData) => {
      setCurrentUser(userData);
      setIsLoggedIn(true);
      navigate("/");
    })
    .catch(() => {
      handleLogout();
    });
};

const loadUserData = () => {
  api.getUserInfo()
    .then((data) => {
      setCurrentUser(data);
    })
    .catch((error) => {
      console.error("Error al cargar datos del usuario:", error);
    });
};

const loadCards = () => {
  api.getInitialCards()
    .then((data) => {
      setCards(data);
    })
    .catch((error) => {
      console.error("Error al cargar las cartas:", error);
    });
};

const handleUpdateUser = (data) => {
  api
    .setUserInfo(data) // actualiza en el servidor
    .then(() => api.getUserInfo()) // vuelve a consultar los datos actualizados
    .then((newData) => {
      setCurrentUser(newData); // actualiza el estado
      handleClosePopup(); // cierra el popup
    })
    .catch((error) => console.error("Error actualizando perfil:", error));
};

const handleUpdateAvatar = (data) => {
  api
    .profileImage(data) // actualiza en el servidor
    .then(() => api.getUserInfo()) // vuelve a consultar los datos actualizados
    .then((newData) => {
      setCurrentUser(newData);
      handleClosePopup();
    })
    .catch((error) => console.error("Error actualizando avatar:", error));
};

  //Popup
  function handleOpenPopup(popup) {
    setPopup(popup);
  }

  function handleClosePopup() {
    setPopup(null);
  }


  //Likes
  async function handleCardLike(card) {
    const isLiked = card.isLiked;
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
    signIn(email, password)
      .then((response) => {
        if (response.error) {
          throw new Error(response.error);
        }
        localStorage.setItem("token", response.token);
        api.setAuthToken(response.token);
        setIsLoggedIn(true);
        return api.getUserInfo();
      })
      .then((userData) => {
        setCurrentUser(userData);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error de login:", error.message);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    api.clearAuthToken();
    setIsLoggedIn(false);
    setCurrentUser({});
    navigate("/signin");
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