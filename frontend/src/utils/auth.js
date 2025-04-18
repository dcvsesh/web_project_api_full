const BASE_URL = 'https://se-register-api.en.tripleten-services.com/v1';

export const auth = {
  // Almacena el token JWT en localStorage
  setToken(token) {
    localStorage.setItem('jwt', token);
  },

  // Obtiene el token almacenado
  getToken() {
    return localStorage.getItem('jwt');
  },

  // Elimina el token (logout)
  removeToken() {
    localStorage.removeItem('jwt');
  },

  // Verifica si hay un token (usuario autenticado)
  isLoggedIn() {
    return !!this.getToken();
  },
  
 // Registro de usuario
 async signUp(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error en registro');

    return data;
  } catch (error) {
    console.error("SignUp Error:", error);
    throw error;
  }
},

async signIn(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error en inicio de sesión');

    // Guardamos el token recibido
    if (data.token) {
      this.setToken(data.token);
    }

    return data;
  } catch (error) {
    console.error("SignIn Error:", error);
    throw error;
  }
},

  // Obtener información del usuario autenticado
  async userInfo() {
    const token = this.getToken();
    if (!token) throw new Error('No hay token de autenticación');

    try {
      const response = await fetch(`${BASE_URL}/users/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al obtener usuario');

      return data;
    } catch (error) {
      console.error("GetUserInfo Error:", error);
      throw error;
    }
  }
};
