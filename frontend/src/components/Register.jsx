import {Link, useNavigate} from "react-router-dom";
import { useState } from "react";
import InfoTooltip from "./InfoTooltip"

const Register = ({ handleRegistration }) => {
  const [data, setData] = useState({
    email: '',
    password: ''
  });

    // Estado para controlar el tooltip
    const navigate = useNavigate();
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setData ((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
   } ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleRegistration(data.email, data.password);
      // Si llegamos aquí, el registro fue exitoso
      setIsSuccess(true);
      setIsTooltipOpen(true);
    } catch (error) {
      // Si hay error
      setIsSuccess(false);
      setIsTooltipOpen(true);
    }
  };

  const closeTooltip = () => {
    setIsTooltipOpen(false);
    if (isSuccess) {
      navigate("/signin"); // Redirige solo si fue exitoso
    }
  };

  return (
<>
<div className="register">
 <h2 className="register_title">Regístrate</h2>
<form
className="form register__form"
noValidate
onSubmit={handleSubmit}>
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
        <button type="submit" className="register_button">
        Regístrate
        </button>
    </form>
        <p className="register_signin_link">
        ¿Ya eres miembro?{" "}
        <Link to="/signin" className="signin_link">
        Inicia sesión aquí
        </Link>
      </p>
      </div>
      <InfoTooltip
        isOpen={isTooltipOpen}
        isSuccess={isSuccess}
        onClose={closeTooltip}
      />
</>
  )

}

export default Register;
