import React, { useContext, useState, useEffect, useRef } from "react";
import logo from "../../images/logo_header.svg";
import menu from "../../images/menu.svg";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import closeButton from "./../../images/close_icon.svg"

function Header() {
  const isAuthenticated = localStorage.getItem("token") !== null;
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useContext(CurrentUserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/signin");
    setIsMenuOpen(false);
  };

  const user = currentUser || JSON.parse(localStorage.getItem("currentUser") || "{}");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  return (
    <header className="header">
      {isMenuOpen && (
        <div className="header__user-info header__user-info--mobile" ref={menuRef}>
          <span className="header__email">{user?.email || "Usuario"}</span>
          <button onClick={handleLogout} className="header__logout">Cerrar sesión</button>
          <hr className="line line_header" />
        </div>
      )}
      <div className='header_items'>
        <img src={logo} alt="Logo" className="header__logo" />
        <nav className="header__nav">
          {isAuthenticated ? (
            <>
              <div className="header__user-info header__user-info--desktop">
                <span className="header__email">{user?.email || "Usuario"}</span>
                <button onClick={handleLogout} className="header__logout">Cerrar sesión</button>
              </div>
            </>
          ) : location.pathname === "/signin" ? (
            <Link to="/signup" className="header__link header__link--white">
              Regístrate
            </Link>
          ) : (
            <Link to="/signin" className="header__link header__link--white">
              Iniciar sesión
            </Link>
          )}
        </nav>
        {isAuthenticated && (
          <button
            ref={hamburgerRef}
            className={`header__hamburger ${isMenuOpen ? "header__hamburger--active" : ""}`}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <img
              src={isMenuOpen ? closeButton : menu}
              alt={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              className="header__button"
            />
          </button>
        )}
      </div>
      <hr className="line" />
    </header>
  );
}

export default Header;