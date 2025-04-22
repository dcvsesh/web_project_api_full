class Api {
  constructor(baseUrl, headers) {
    this.baseUrl = baseUrl;
    this.headers = headers || {
      'Content-Type': 'application/json'
    };
  }

  // Métodos para manejar el token JWT
  setAuthToken(token) {
    this.headers.authorization = `Bearer ${token}`;
  }

  clearAuthToken() {
    delete this.headers.authorization;
  }

  // Método único para manejar todas las respuestas
  _processResponse(res) {
    return res.json().then(data => {
      return data.data ?? data;
    });
  }

  // Método para obtener la información del usuario
  getUserInfo() {
    const token = localStorage.getItem("token");  // Obtiene el token de localStorage
    if (token) {
      this.setAuthToken(token);  // Establece el token en las cabeceras
    }
    return fetch(`${this.baseUrl}/users/me`, {
      headers: this.headers,
      method: "GET",
    })
    .then(this._processResponse.bind(this))
    .catch(error => console.log(error));
  }

  // Método para obtener las tarjetas
  getInitialCards() {
    const token = localStorage.getItem("token");
    if (token) {
      this.setAuthToken(token);  // Establece el token en las cabeceras
    }
    return fetch(`${this.baseUrl}/cards/`, {
      headers: this.headers,
      method: "GET",
    })
    .then(this._processResponse.bind(this))
    .catch(error => console.log(error));
  }

  // Método para actualizar la información del usuario
  setUserInfo(data) {
    const token = localStorage.getItem("token");
    if (token) {
      this.setAuthToken(token);  // Establece el token en las cabeceras
    }
    return fetch(`${this.baseUrl}/users/me`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify(data),
    })
    .then(this._processResponse.bind(this))
    .catch(error => console.log(error));
  }

  // Método para crear una tarjeta
  createCard(place, link) {
    const token = localStorage.getItem("token");
    if (token) {
      this.setAuthToken(token);  // Establece el token en las cabeceras
    }
    return fetch(`${this.baseUrl}/cards/`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        name: place,
        link,
      }),
    })
    .then(this._processResponse.bind(this))
    .catch(error => console.log(error));
  }

  // Método para eliminar una tarjeta
  deleteCard(cardId) {
    const token = localStorage.getItem("token");
    if (token) {
      this.setAuthToken(token);  // Establece el token en las cabeceras
    }
    return fetch(`${this.baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this.headers,
    })
    .then(this._processResponse.bind(this))
    .catch(error => console.log(error));
  }

  // Método para cambiar el estado de like de una tarjeta
  changeLikeCardStatus(cardId, isLiked){
    const token = localStorage.getItem("token");
    if (token) {
      this.setAuthToken(token);  // Establece el token en las cabeceras
    }
    return fetch(`${this.baseUrl}/cards/${cardId}/likes`, {
      method: isLiked ? "PUT" : "DELETE",
      headers: this.headers,
    })
    .then(this._processResponse.bind(this))
    .catch(error => console.log(error));
  }

  // Método para actualizar la imagen de perfil
  profileImage(data) {
    const token = localStorage.getItem("token");
    if (token) {
      this.setAuthToken(token);  // Establece el token en las cabeceras
    }
    return fetch(`${this.baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify(data),
    })
    .then(this._processResponse.bind(this))
    .catch(error => console.log(error));
  }
}

// Instancia de la clase Api
export const api = new Api("https://aroundthe.chickenkiller.com");