const BASE_URL = 'https://aroundthe.chickenkiller.com';

export const signUp = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        error: data.message || `Error ${response.status}: Registro Fallido`,
      };
    }
    return data;
  } catch (err) {
    return {
      error: err.message || "Error del Navegador durante el Registro",
    };
  }
};

export const signIn = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        error: data.message || `Error ${response.status}: Inicio de Sesion Fallido`,
      };
    }
    // Guardamos el token en localStorage para su posterior uso
    localStorage.setItem('token', data.token);
    return data;
  } catch (err) {
    return {
      error: err.message || "Error del Navegador durante el Inicio de Sesion",
    };
  }
};

export const userInfo = async (email, password) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${BASE_URL}/users/me`, {  // Usa comillas invertidas
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization" : `Bearer ${token}`
    },
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        error: data.message || `Error ${response.status}: Veirficacion del Token Fallido`,
      };
    }

    return data;
  } catch (err) {
    return {
      error: err.message || "Error del Navegador durante la Verificacion del Token",
    };
  }
};