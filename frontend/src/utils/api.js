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


  getUserInfo() {
    return fetch(`${this.baseUrl}users/me`, {
      headers: this.headers,
      method: "GET",
    })
    .then(this._processResponse.bind(this))
    .catch(error => console.log(error));
  }

  getInitialCards() {
    return fetch(`${this.baseUrl}cards/`, {
      headers: this.headers,
      method: "GET",
    })
    .then(this._processResponse.bind(this))
    .catch(error => console.log(error));
  }

  setUserInfo(data) {
    return fetch(`${this.baseUrl}users/me`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify(data),
    })
    .then(this._processResponse.bind(this))
    .catch(error => console.log(error));
  }

  createCard(place, link) {
    return fetch(`${this.baseUrl}cards/`, {
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

  deleteCard(cardId) {
    return fetch(`${this.baseUrl}cards/${cardId}`, {
      method: "DELETE",
      headers: this.headers,
    })
    .then(this._processResponse.bind(this))
    .catch(error => console.log(error));
  }

  changeLikeCardStatus(cardId, isLiked){
    return fetch(`${this.baseUrl}cards/${cardId}/likes`, {
      method: isLiked ? "PUT" : "DELETE",
      headers: this.headers,
    })
    .then(this._processResponse.bind(this))
    .catch(error => console.log(error));
  }

  profileImage(data) {
    return fetch(`${this.baseUrl}users/me/avatar`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify(data),
    })
    .then(this._processResponse.bind(this))
    .catch(error => console.log(error));
  }
}

export const api = new Api("https://api.aroundthe.chickenkiller.com/");
