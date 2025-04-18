import closeButton from "../../../images/close_icon.svg"

export default function Popup(props) {
  //los hijos son el contenido de la ventana emergente
  const {onClose, title, children } = props;

return (
<section className="popup">
        <div
        className ={`popup__content ${
          !title ? "card__image" : ""
        }`}
        >
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
       <fieldset className="popup__form-fieldset form__set">
            {title && <h3 className="popup__title">{title}</h3>}
              {children}
              </fieldset>
              </div>
        </div>
      </section>
  );
}