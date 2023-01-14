import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, orderBy, limit, query } from "firebase/firestore";
import { db } from "../firebase.config";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

/* Import image and SVG starts */
/* Import image and SVG ends */

/* Import local pages and component starts */
import Loader from "./Loader";
/* Import local pages and component ends */

/* *************************************************** */

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

/* Component starts */
const HomeSlider = () => {
  /* Component states declaration starts */
  const [loading, setLoading] = useState(true);
  const [propertiesList, setPropertiesList] = useState(null);
  /* Component states declaration ends */

  /* Other hooks declaration starts */
  const navigate = useNavigate();
  /* Other hooks declaration ends */

  /* Component variable declaration / object destructure starts */
  /* Component variable declaration / object destructure ends */

  /* Component function definition starts */
  /* Component function definition ends */

  /* Component useEffect starts */
  useEffect(() => {
    const propertyListRef = collection(db, "listings");
    const q = query(propertyListRef, orderBy("timestamp", "desc"), limit(5));
    getDocs(q).then((querySnap) => {
      const queryList = [];
      querySnap.forEach((doc) => {
        queryList.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setPropertiesList(queryList);
      setLoading(false);
    });
  }, []);
  /* Component useEffect ends */

  /* Component rendering. JSX code starts */
  if (loading) return <Loader />;
  return (
    <>
      <p className="exploreHeading">Recently Posted</p>
      <Swiper slidesPerView={1} pagination={{ clickable: true }}>
        {propertiesList.map(({ data, id }) => (
          <SwiperSlide
            key={id}
            onClick={() => {
              navigate(`/category/${data.type}/${id}`);
            }}
          >
            <div
              className="swiperSlideDiv"
              style={{
                background: `url(${data.imageUrls[0]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            >
              <p className="swiperSlideText">{data.name}</p>
              <p className="swiperSlidePrice">
                ${data.discountedPrice ?? data.regularPrice}
                {data.type === "rent" && " / month"}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
  /* Component rendering. JSX code ends */
};
/* Component ends */

export default HomeSlider;
