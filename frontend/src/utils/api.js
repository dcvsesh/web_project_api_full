import { auth } from './auth';
class Api {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

 // Método para obtener los headers con autorización
 _getHeaders() {
  const headers = {
    "Content-Type": "application/json"
  };

  // Añadimos el token si está disponible
  const token = auth.getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

// Método para manejar todas las respuestas
_handleResponse(res) {
  if (res.ok) {
    return res.json();
  }
  // Si es un error 401 no autorizado, limpiamos el token
  if (res.status === 401) {
    auth.removeToken();
    window.location.href = '/signin'; // Redirigir a login
  }
  return Promise.reject(`Error: ${res.status}`);
}

getUserInfo() {
  return fetch(`${this.baseUrl}users/me`, {
    headers: this._getHeaders(),
    method: "GET",
  }).then(this._handleResponse);
}

getInitialCards() {
  return fetch(`${this.baseUrl}cards/`, {
    headers: this._getHeaders(),
    method: "GET",
  }).then(this._handleResponse);
}

setUserInfo(data) {
  return fetch(`${this.baseUrl}users/me`, {
    method: "PATCH",
    headers: this._getHeaders(),
    body: JSON.stringify(data),
  }).then(this._handleResponse);
}

createCard(place, link) {
  return fetch(`${this.baseUrl}cards/`, {
    method: "POST",
    headers: this._getHeaders(),
    body: JSON.stringify({ name: place, link }),
  }).then(this._handleResponse);
}

deleteCard(cardId) {
  return fetch(`${this.baseUrl}cards/${cardId}`, {
    method: "DELETE",
    headers: this._getHeaders(),
  }).then(this._handleResponse);
}

changeLikeCardStatus(cardId, isLiked) {
  return fetch(`${this.baseUrl}cards/${cardId}/likes`, {
    method: isLiked ? "PUT" : "DELETE",
    headers: this._getHeaders(),
  }).then(this._handleResponse);
}

profileImage(data) {
  return fetch(`${this.baseUrl}users/me/avatar`, {
    method: "PATCH",
    headers: this._getHeaders(),
    body: JSON.stringify(data),
  }).then(this._handleResponse);
}
}

export const api = new Api("https://around-api.es.tripleten-services.com/v1/");
