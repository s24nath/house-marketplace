import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

/* Import image and SVG starts */
import googleIcon from "../assets/svg/googleIcon.svg";
/* Import image and SVG ends */

/* Import local pages and component starts */
/* Import local pages and component ends */

/* *************************************************** */

/* Component starts */
const OAuth = () => {
  /* Component states declaration starts */
  /* Component states declaration ends */

  /* Other hooks declaration starts */
  const navigate = useNavigate();
  const location = useLocation();
  /* Other hooks declaration ends */

  /* Component variable declaration / object destructure starts */
  /* Component variable declaration / object destructure ends */

  /* Component function definition starts */
  const clickHandler = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    let userSelected;
    signInWithPopup(auth, provider)
      .then((result) => {
        // Getting user from pop-up
        userSelected = result.user;
      })
      .then(() => {
        const userRef = doc(db, "users", userSelected.uid);
        return userRef;
      })
      .then((userRef) => {
        // Getting user from database by the user reference chosen from the pop-up
        const getUserFromDb = getDoc(userRef);
        return getUserFromDb;
      })
      .then((getUserFromDb) => {
        /*
         * Creating new user at database only if there is no existing user,
         * so that same user can login with Google wihtout duplicate entry
         * in database.
         */
        if (!getUserFromDb.exists()) {
          setDoc(doc(db, "users", userSelected.uid), {
            name: userSelected.displayName,
            email: userSelected.email,
            timestamp: serverTimestamp(),
          });
        }
        navigate("/");
      })
      .catch((error) => {
        toast.error();
      });
  };
  /* Component function definition ends */

  /* Component rendering. JSX code starts */
  return (
    <div className="socialLogin">
      <p>Sign {location.pathname === "/login" ? "in" : "up"} with</p>
      <button className="socialIconDiv" onClick={clickHandler}>
        <img className="socialIconImg" src={googleIcon} alt="Google" />
      </button>
    </div>
  );
  /* Component rendering. JSX code ends */
};
/* Component ends */

export default OAuth;
