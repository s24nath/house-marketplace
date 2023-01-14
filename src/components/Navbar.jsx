import { useNavigate, useLocation } from "react-router-dom";

/* Import image and SVG starts */
import { ReactComponent as OfferIcon } from "../assets/svg/localOfferIcon.svg";
import { ReactComponent as ExploreIcon } from "../assets/svg/exploreIcon.svg";
import { ReactComponent as PersonOutlineIcon } from "../assets/svg/personOutlineIcon.svg";
/* Import image and SVG ends */

/* *************************************************** */

/* Component starts */
const Navbar = () => {
  /* Other hooks declaration starts */
  const navigate = useNavigate();
  const location = useLocation();
  /* Other hooks declaration ends */

  /* Component function definition starts */
  const currentMatchedPath = (path) => {
    if (path === location.pathname) return true;
    return false;
  };
  /* Component function definition ends */

  /* Component rendering. JSX code starts */
  return (
    <footer className="navbar">
      <nav className="navbarNav">
        <ul className="navbarListItems">
          <li className="navbarListItem" onClick={() => navigate("/")}>
            <ExploreIcon
              fill={currentMatchedPath("/") ? "#2c2c2c" : "#8f8f8f"}
              height="36px"
              width="36px"
            />
            <p
              className={`navbarListItem ${
                currentMatchedPath("/")
                  ? "navbarListItemNameActive"
                  : "navbarListItemName"
              }`}
            >
              Explore
            </p>
          </li>
          <li className="navbarListItem" onClick={() => navigate("/offers")}>
            <OfferIcon
              fill={currentMatchedPath("/offers") ? "#2c2c2c" : "#8f8f8f"}
              height="36px"
              width="36px"
            />
            <p
              className={`navbarListItem ${
                currentMatchedPath("/offers")
                  ? "navbarListItemNameActive"
                  : "navbarListItemName"
              }`}
            >
              Offers
            </p>
          </li>
          <li className="navbarListItem" onClick={() => navigate("/profile")}>
            <PersonOutlineIcon
              fill={
                currentMatchedPath("/profile") || currentMatchedPath("/login")
                  ? "#2c2c2c"
                  : "#8f8f8f"
              }
              height="36px"
              width="36px"
            />
            <p
              className={`navbarListItem ${
                currentMatchedPath("/profile")
                  ? "navbarListItemNameActive"
                  : "navbarListItemName"
              }`}
            >
              Profile
            </p>
          </li>
        </ul>
      </nav>
    </footer>
  );
  /* Component rendering. JSX code ends */
};
/* Component ends */

export default Navbar;
