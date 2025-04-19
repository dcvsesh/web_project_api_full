import { Link } from "react-router-dom";
import { useState } from "react";

const Login = ({ handleLogin }) => {
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(data.email, data.password);
  };

  return (
    <div className="login">
      <h2 className="login_title">Inicia sesión</h2>

      <form
        className="form login__form"
        noValidate
        onSubmit={handleSubmit}
      >
        <input
          className="input__text input__text_email"
          type="email"
          name="email"
          id="email-input"
          placeholder="Correo electrónico"
          value={data.email}
          onChange={handleChange}
          required
        />
        <span className="form__input-error email-input-error"></span>

        <input
          className="input__text input__text_password"
          type="password"
          name="password"
          id="password-input"
          placeholder="Contraseña"
          value={data.password}
          onChange={handleChange}
          required
        />
        <span className="form__input-error password-input-error"></span>

        <button type="submit" className="login_button">
          Inicia sesión
        </button>
      </form>

      <p className="login_register_link">
        ¿Aún no eres miembro?{" "}
        <Link to="/signup" className="register_link">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
};

export default Login;