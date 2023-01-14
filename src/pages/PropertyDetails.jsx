import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase.config";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

/* Import image and SVG starts */
import shareIcon from "../assets/svg/shareIcon.svg";
/* Import image and SVG ends */

/* Import local pages and component starts */
import Loader from "../components/Loader";
import ContactOwnerForm from "../components/ContactOwnerForm";
/* Import local pages and component ends */

/* *************************************************** */

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

/* Component starts */
const PropertyDetails = () => {
  /* Component states declaration starts */
  const [details, setDetails] = useState({});
  const [userRefDetails, setUserRefDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [getCurrentUser, setGetCurrentUser] = useState(false);
  const [shareLinkCopy, setShareLinkCopy] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  /* Component states declaration ends */

  /* Other hooks declaration starts */
  const params = useParams();
  const auth = getAuth();
  /* Other hooks declaration ends */

  /* Component variable declaration / object destructure starts */
  const {
    bathrooms,
    bedrooms,
    discountedPrice,
    furnished,
    imageUrls,
    location,
    name,
    offer,
    parking,
    regularPrice,
    type,
    contactNum,
    contactEmail,
    about,
    userRef,
  } = details;
  /* Component variable declaration / object destructure ends */

  /* Component function definition starts */
  const fetchData = () => {
    const docRef = doc(db, "listings", params.id);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          setDetails(docSnap.data());
          return docSnap.data();
        }
      })
      .then((propertyDocSnap) => {
        return doc(db, "users", propertyDocSnap.userRef);
      })
      .then((ownerDocSnap) => {
        return getDoc(ownerDocSnap);
      })
      .then((ownerDocSnap) => {
        if (ownerDocSnap.exists()) {
          setUserRefDetails(ownerDocSnap.data());
        }
      })
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {});
  };
  const shareLinkHandler = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareLinkCopy(true);
    setTimeout(() => {
      setShareLinkCopy(false);
    }, 2000);
  };
  /* Component function definition ends */

  /* Component useEffect starts */
  useEffect(() => {
    let unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setGetCurrentUser(true);
    });
    fetchData();
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* Component useEffect ends */

  /* Component rendering. JSX code starts */
  if (isLoading || !getCurrentUser) {
    return <Loader />;
  }

  return (
    <main>
      <Swiper slidesPerView={1} pagination={{ clickable: true }}>
        {imageUrls.map((currentImageUrl, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${currentImageUrl}) center no-repeat`,
                backgroundSize: "cover",
              }}
              className="swiperSlideDiv"
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="shareIconDiv" onClick={shareLinkHandler}>
        <img src={shareIcon} alt="Share" />
      </div>
      {shareLinkCopy && <p className="linkCopied">Link Copied</p>}
      <div className="listingDetails">
        <p className="listingName">
          {name} - ${offer ? discountedPrice : regularPrice}
          {type === "rent" && "/Month"}
        </p>
        <p className="listingLocation">{location}</p>
        <p className="listingType">For {type === "rent" ? "Rent" : "Sale"}</p>
        {offer && (
          <p className="discountPrice">
            ${regularPrice - discountedPrice} discount
          </p>
        )}
        <ul className="listingDetailsList">
          <li>{bedrooms > 1 ? `${bedrooms} Bedrooms` : "1 Bedroom"}</li>
          <li>{bathrooms > 1 ? `${bathrooms} Bathrooms` : "1 Bathroom"}</li>
          <li>{parking && "Vehicle parking available"}</li>
          <li>{furnished && "Furnished"}</li>
        </ul>
        {about && (
          <div className="aboutPlace">
            <h3>About this place</h3>
            <p>{about}</p>
          </div>
        )}
        {authUser?.uid !== userRef && (
          <ContactOwnerForm
            ownerEmail={contactEmail}
            ownercontactNum={contactNum}
            ownerName={userRefDetails.name}
            propertyName={name}
          />
        )}
      </div>
    </main>
  );
  /* Component rendering. JSX code ends */
};
/* Component ends */

export default PropertyDetails;
