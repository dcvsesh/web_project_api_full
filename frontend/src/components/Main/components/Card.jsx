import trashButton from "../../../images/trash_icon.svg";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext } from "../../../contexts/CurrentUserContext";
import { useContext } from "react";

export default function Card(props) {
  const { name, link, isLiked} = props.card;
  const { handleOpenPopup, onCardLike,onCardDelete } = props;
  const { currentUser } = useContext(CurrentUserContext);

  const imageComponent = {
    title: "",
    children: <ImagePopup name={name} link={link} />,
  };

  //Cartas
  // Verifica si el usuario actual le ha dado "like" a la tarjeta
  const cardLikeButtonClassName = `cards__hearth-button ${
    isLiked ? "cards__hearth-button_active" : ""
  }`;

  const handleLikeClick = () => {
      onCardLike(props.card);
  }
  const handleCardDeleteClick = () => {
    onCardDelete(props.card);
}

  return (
    <li className="cards__item">
      <img
        src={link}
        alt={`Imagen de ${name}`} 
        className="cards__image"
        onClick={() => handleOpenPopup(imageComponent)}
      ></img>
      <button
        className="cards__trash-button"
        aria-label="Delete card"
        type="button"
        onClick={handleCardDeleteClick}
      >
        <img
          src={trashButton}
          alt="trash picture"
          className="cards__trash-button-image"
        />
      </button>
      <div className="cards__image-info">
        <h3 className="cards__image-text">{name}</h3>
        <button
          className={cardLikeButtonClassName}
          aria-label="Like card"
          type="button"
          onClick={handleLikeClick}
        ></button>
      </div>
    </li>
  );
}
