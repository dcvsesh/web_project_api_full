import { useState } from "react";
export default function NewCard({onClosePopup, onAddPlaceSubmit}){
const [place, setPlace] = useState("");
const [link, setLink] = useState("");

const handleLinkChange = (evt) => {
  setLink(evt.target.value); // Actualiza el link
};
const handlePlaceChange = (evt) => {
  setPlace(evt.target.value); // Actualiza el link
};

const handleSubmit = (evt) => {
evt.preventDefault();
onAddPlaceSubmit({name: place, link});
};

return (
<form className="form popup__form" noValidate
onSubmit={handleSubmit}>
<label className="form__field">
                <input
                  className="input__text input__text_place"
                  type="text"
                  name="place"
                  id="place-input"
                  placeholder="Título"
                  minLength="2"
                  maxLength="30"
                  required
                  value={place}
                  onChange={handlePlaceChange}
                />
                <span className="form__input-error place-input-error"></span>
              </label>
              <label className="form__field">
                <input
                  className="input__text input__text_link"
                  type="url"
                  name="link"
                  id="link-input"
                  placeholder="Enlace a la imagen"
                  required
                  value={link}
                  onChange={handleLinkChange}
                />
                <span className="form__input-error link-input-error"></span>
              </label>

              <div className="popup_submit-button">
      <button
        className="popup__form-button popup__save-button"
        type="submit"
      >
        Crear
      </button>
      </div>
      </form>
  )
}