import React from "react";
import successIcon from "../images/exito-icon.svg";
import errorIcon from "../images/error-icon.svg";
import closeButton from "../images/close_icon.svg"

const InfoTooltip = ({ isSuccess, isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="popup">
      <div className="popup__form_content">
        <button
                  aria-label="Close modal"
                    className="popup__button-close"
                    type="button"
                    onClick={onClose}
                  >
                    <img
                      className="popup__button-close-image"
                      src={closeButton}
                      alt="Cruz para cerrar"
                    />
             </button>
      <div className="popup__content popup__content_info">
        <img
          src={isSuccess ? successIcon : errorIcon}
          alt={isSuccess ? "Éxito" : "Error"}
          className="info-tooltip__icon"
        />

        <p className="info-tooltip__message">
          {isSuccess
            ? "¡Correcto! Ya estás registrado."
            : "Uy, algo salió mal. Por favor, inténtalo de nuevo."}
        </p>
      </div>
      </div>
    </div>
  );
};

export default InfoTooltip;