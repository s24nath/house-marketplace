import { Link } from "react-router-dom";

/* Import image and SVG starts */
import bedIcon from "../assets/svg/bedIcon.svg";
import bathtubIcon from "../assets/svg/bathtubIcon.svg";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";
/* Import image and SVG ends */

/* *************************************************** */

/* Component starts */
const PropertyEach = ({ place, id, deleteHandler, editHandler }) => {
  /* Component rendering. JSX code starts */
  return (
    <li className="categoryListing">
      <Link
        to={`/category/${place.type}/${id}`}
        className="categoryListingLink"
      >
        <img
          src={place.imageUrls[0]}
          alt={place.name}
          className="categoryListingImg"
        />
        <div className="categoryListingDetails">
          <p className="categoryListingName">{place.name}</p>
          <p className="categoryListingLocation">{place.location}</p>
          <p className="categoryListingPrice">
            ${place.offer ? place.discountedPrice : place.regularPrice}{" "}
            {place.type === "rent" && "/ Month"}
          </p>
          <div className="categoryListingInfoDiv">
            <img src={bedIcon} alt="Bed" />
            <p className="categoryListingInfoText">
              {place.bedrooms > 1
                ? `${place.bedrooms} Bedrooms`
                : `${place.bedrooms} Bedroom`}
            </p>
            <img src={bathtubIcon} alt="Bathtub" />
            <p className="categoryListingInfoText">
              {place.bathrooms > 1
                ? `${place.bathrooms} Bathrooms`
                : `${place.bathrooms} Bathroom`}
            </p>
          </div>
        </div>
      </Link>
      {deleteHandler && (
        <DeleteIcon
          className="removeIcon"
          fill="#2c2c2c"
          onClick={() => deleteHandler()}
        />
      )}
      {editHandler && (
        <EditIcon
          className="editIcon"
          fill="#2c2c2c"
          onClick={() => editHandler()}
        />
      )}
    </li>
  );
  /* Component rendering. JSX code ends */
};
/* Component ends */

export default PropertyEach;
