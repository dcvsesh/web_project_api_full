import { useState, useContext } from 'react';
import {CurrentUserContext} from '../../../contexts/CurrentUserContext';


export default function EditProfile() {
  const userContext = useContext(CurrentUserContext); // Obtiene el objeto currentUser
  const { currentUser, handleUpdateUser } = userContext;

  const [name, setName] = useState(currentUser.name); // Agrega la variable de estado para name
  const [description, setDescription] = useState(currentUser.about); // Agrega la variable de estado para description

  const handleNameChange = (evt) => {
    setName(evt.target.value); // Actualiza name cuando cambie la entrada
  };

  const handleDescriptionChange = (evt) => {
    setDescription(evt.target.value); // Actualiza description cuando cambie la entrada
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    handleUpdateUser({ name, about:description });
  };

  return (

    <form
    className="form popup__form"
     noValidate
     onSubmit={handleSubmit}>
      <label className="form__field">
        <input
          className="input__text input__text_name"
          type="text"
          name="name"
          id="name-input"
          placeholder="Nombre"
          minLength="2"
          maxLength="40"
          required
          value={name} // Vincula name con la entrada
          onChange={handleNameChange} // Agrega el controlador onChange
        />
        <span className="form__input-error name-input-error"></span>
      </label>
      <label className="form__field">
        <input
          className="input__text input__text_about"
          type="text"
          name="about"
          id="about-input"
          placeholder="Acerca de mí"
          minLength="2"
          maxLength="200"
          required
          value={description}
          onChange={handleDescriptionChange} // Agrega el controlador onChange
        />
        <span className="form__input-error about-input-error"></span>
      </label>
      <div className="popup_submit-button">
      <button
        className="popup__form-button popup__save-button"
        type="submit">
        Guardar
      </button>
      </div>
      </form>
  );
}
