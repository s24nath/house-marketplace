import { useState, useEffect } from "react";
import { getAuth, updateProfile, onAuthStateChanged } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

/* Import image and SVG starts */
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
/* Import image and SVG ends */

/* Import local pages and component starts */
import Loader from "../components/Loader";
import PropertyEach from "../components/PropertyEach";
/* Import local pages and component ends */

/* *************************************************** */

/* Component starts */
const Profile = () => {
  /* Component states declaration starts */
  const [isloading, setIsLoading] = useState(true);
  const [userPropertyList, setUserPropertyList] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState({});
  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });
  const [updateUser, setUpdateUser] = useState(false);
  /* Component states declaration ends */

  /* Other hooks declaration starts */
  const navigate = useNavigate();
  const auth = getAuth();
  /* Other hooks declaration ends */

  /* Component variable declaration / object destructure starts */
  const { name, email } = userData;
  /* Component variable declaration / object destructure ends */

  /* Component function definition starts */
  const logOutHandler = () => {
    auth.signOut();
    navigate("/");
  };
  const inputHandler = ({ target }) => {
    setUserData((prevState) => ({
      ...prevState,
      [target.id]: target.value,
    }));
  };
  const submitHandler = () => {
    const { displayName, uid } = userLoggedIn;
    if (displayName !== name) {
      updateProfile(userLoggedIn, {
        displayName: name,
      })
        .then(() => {
          const userRef = doc(db, "users", uid);
          updateDoc(userRef, {
            name,
          });
        })
        .catch((error) => {
          toast.error("Could not update profile details.");
        });
    }
  };
  const fetchUserProperties = (user) => {
    const propertiesRef = collection(db, "listings");
    const q = query(
      propertiesRef,
      where("userRef", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    getDocs(q)
      .then((querySnap) => {
        const propertList = [];
        querySnap.forEach((doc) => {
          propertList.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        return propertList;
      })
      .then((propertList) => {
        setUserPropertyList(propertList);
      })
      .then(() => {
        setIsLoading(false);
      });
  };
  const onDelete = (propertyRefID) => {
    const confirmed = window.confirm("Are you sure you want to delete");
    if (confirmed) {
      deleteDoc(doc(db, "listings", propertyRefID))
        .then(() => {
          const newPropertyList = userPropertyList.filter(
            (currentProperty) => currentProperty.id !== propertyRefID
          );
          return newPropertyList;
        })
        .then((newPropertyList) => {
          setUserPropertyList(newPropertyList);
        })
        .then(() => {
          toast.success("Successfully deleted");
        });
    }
  };
  const onEdit = (propertyRefID) => {
    navigate(`/edit-ad/${propertyRefID}`);
  };
  /* Component function definition ends */

  /* Component useEffect starts */
  useEffect(() => {
    let unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserData((prevState) => ({
          ...prevState,
          name: user.displayName,
          email: user.email,
        }));
        setUserLoggedIn(user);
        fetchUserProperties(user);
      }
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* Component useEffect ends */

  /* Component rendering. JSX code starts */
  if (isloading) {
    return <Loader />;
  }

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={logOutHandler}>
          Sign out
        </button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              updateUser && submitHandler();
              setUpdateUser((prev) => !prev);
            }}
          >
            {updateUser ? "Save" : "Update"}
          </p>
        </div>

        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={updateUser ? "profileNameActive" : "profileName"}
              disabled={!updateUser}
              value={name}
              onChange={inputHandler}
            />
            <input
              type="text"
              id="email"
              className={updateUser ? "profileEmailActive" : "profileEmail"}
              disabled={!updateUser}
              value={email}
              onChange={inputHandler}
            />
          </form>
        </div>
        <Link to="/create-ad" className="createListing">
          <img src={homeIcon} alt="Create Ad" />
          <p>Sell or rent your place</p>
          <img src={arrowRight} alt="Arrow right" />
        </Link>
        {userPropertyList?.length > 0 && (
          <>
            <p className="listingText">Your Listings</p>
            <ul className="listingsList">
              {userPropertyList.map((currentProperty) => (
                <PropertyEach
                  key={currentProperty.id}
                  id={currentProperty.id}
                  place={currentProperty.data}
                  deleteHandler={() => onDelete(currentProperty.id)}
                  editHandler={() => onEdit(currentProperty.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
  /* Component rendering. JSX code ends */
};
/* Component ends */

export default Profile;
