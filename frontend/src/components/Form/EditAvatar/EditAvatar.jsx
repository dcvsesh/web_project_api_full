import { useContext, useRef } from "react";
import { CurrentUserContext } from "../../../contexts/CurrentUserContext";
export default function EditAvatar() {
  const avatarRef = useRef(); // Referencia para el input del avatar
  const { onUpdateAvatar } = useContext(CurrentUserContext); // Acceder al contexto


  function handleSubmit(evt) {
    evt.preventDefault();

    // Llama a la función onUpdateAvatar con el nuevo valor del avatar
    onUpdateAvatar({
      avatar: avatarRef.current.value, // Obtener el valor del input usando la ref
    });
  }

  return (
    <>
    <form className="form popup__form"
    noValidate
    onSubmit={handleSubmit}>
      <label className="form__field">
        <input
          className="input__text input__text_link"
          type="url"
          name="avatar"
          id="avatar-input"
          placeholder="Ingrese el nuevo enlace"
          required
          ref={avatarRef}
        />
        <span className="form__input-error link-input-error"></span>
      </label>
      <div className="popup_submit-button">
      <button
        className="popup__form-button popup__save-button"
        type="submit"
      >
        Guardar
      </button>
      </div>
      </form>
    </>
  );
}
