import { Link } from "react-router-dom";

/* Import image and SVG starts */
import rentCategoryImage from "../assets/jpg/rentCategoryImage.jpg";
import sellCategoryImage from "../assets/jpg/sellCategoryImage.jpg";
/* Import image and SVG ends */

/* Import local pages and component starts */
import HomeSlider from "../components/HomeSlider";
/* Import local pages and component ends */

/* *************************************************** */

/* Component starts */
const Explore = () => {
  /* Component states declaration starts */
  /* Component states declaration ends */

  /* Component variable declaration / object destructure starts */
  /* Component variable declaration / object destructure ends */

  /* Component function definition starts */
  /* Component function definition ends */

  /* Component rendering. JSX code starts */
  return (
    <div className="explore">
      <header>
        <p className="pageHeader">Explore</p>
      </header>
      <main>
        <HomeSlider />

        <p className="exploreCategoryHeading">Categories</p>
        <div className="exploreCategories">
          <Link to="/category/rent">
            <img
              src={rentCategoryImage}
              alt="Rent"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">Places for rent</p>
          </Link>
          <Link to="/category/sale">
            <img
              src={sellCategoryImage}
              alt="Rent"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">Places for sale</p>
          </Link>
        </div>
      </main>
    </div>
  );
  /* Component rendering. JSX code ends */
};
/* Component ends */

export default Explore;
