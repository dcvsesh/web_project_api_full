import avatar from "../../images/avatar.jpg";
import editButton from "../../images/edit_button.png";
import addButton from "../../images/add.svg";
import {useContext } from "react";
import NewCard from "../Form/NewCard/NewCard";
import Popup from "./components/Popup";
import EditAvatar from "../Form/EditAvatar/EditAvatar";
import EditProfile from "../Form/EditProfile/EditProfile";
import Card from "./components/Card";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";

export default function Main({
  cards=[],
  onCardLike,
  onCardDelete,
  onOpenPopup,
  onClosePopup,
  onAddPlaceSubmit,
  popup,}
) {

  const { currentUser } = useContext(CurrentUserContext);

  const newCardPopup = { title: "Nuevo Lugar", children: <NewCard onAddPlaceSubmit={onAddPlaceSubmit} onClose={onClosePopup} /> };
  const editAvatarPopup = {
    title: "Cambiar foto de perfil",
    children: <EditAvatar onClose={onClosePopup} />,
  };
  const editProfilePopup = {
    title: "Editar Perfil",
    children: <EditProfile onClose={onClosePopup}/>,
  };

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__column">
          <div
            className="profile__avatar-edit"
            onClick={() => onOpenPopup(editAvatarPopup)}
          >
            <img
              src={currentUser.avatar}
              alt="Imagen de Perfil Avatar"
              className="profile__avatar"
            />
          </div>
          <div className="profile__info">
            <h2 className="profile__info_title">{currentUser.name}</h2>
            <button
              className="profile__edit-button"
              type="button"
              aria-label="Edit profile"
              onClick={() => onOpenPopup(editProfilePopup)}
            >
              <img
                src={editButton}
                alt="Botón para editar"
                className="profile__edit-button-image"
              />
            </button>
            <p className="profile__info_subtitle">{currentUser.about}</p>
          </div>
        </div>
        <button
          className="profile__add-button"
          type="button"
          aria-label="Add card"
          onClick={() => onOpenPopup(newCardPopup)}
        >
          <img
            src={addButton}
            alt="Botón para añadir"
            className="profile__add-button-image"
          />
        </button>
      </section>
      <section className="cards">
        <ul className="cards__content">
        {cards?.map((card) => (
            <Card
              key={card._id}
              card={card}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
              handleOpenPopup={onOpenPopup}
            />
          ))}
        </ul>
      </section>

      {popup && (
        <Popup onClose={onClosePopup} title={popup.title}>
          {popup.children}
        </Popup>
      )}
    </main>
  );
}
