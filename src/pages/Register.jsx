import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

/* Import image and SVG starts */
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
/* Import image and SVG ends */

/* Import local pages and component starts */
import OAuth from "../components/OAuth";
/* Import local pages and component ends */

/* *************************************************** */

/* Component starts */
const Register = () => {
  /* Component states declaration starts */
  const [showPassword, setShowPassword] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    password: "",
  });
  /* Component states declaration ends */

  /* Other hooks declaration starts */
  const navigate = useNavigate();
  /* Other hooks declaration ends */

  /* Component variable declaration / object destructure starts */
  const { name, email, password } = registrationData;
  /* Component variable declaration / object destructure ends */

  /* Component function definition starts */
  const formInputHandler = ({ target }) => {
    setRegistrationData((prevState) => ({
      ...prevState,
      [target.id]: target.value,
    }));
  };
  const submitHandler = (e) => {
    e.preventDefault();
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return user;
      })
      .then((user) => {
        updateProfile(auth.currentUser, {
          // Setting the display name of the current signed in user
          displayName: name,
        });
        return user;
      })
      .then((user) => {
        const registrationDataCopy = { ...registrationData };
        delete registrationDataCopy.password;
        registrationDataCopy.timestamp = serverTimestamp();
        return { user, registrationDataCopy };
      })
      .then(({ user, registrationDataCopy }) => {
        setDoc(doc(db, "users", user.uid), registrationDataCopy);
      })
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        toast.error("Something went wrong");
      });
  };
  /* Component function definition ends */

  /* Component rendering. JSX code starts */
  return (
    <div>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Thank you for joining us!</p>
        </header>
        <main>
          <form onSubmit={submitHandler}>
            <input
              type="text"
              id="name"
              value={name}
              className="nameInput"
              placeholder="Name..."
              onChange={formInputHandler}
            />
            <input
              type="email"
              id="email"
              value={email}
              className="emailInput"
              placeholder="Email..."
              onChange={formInputHandler}
            />
            <div className="passwordInputDiv">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                className="passwordInput"
                placeholder="Password..."
                onChange={formInputHandler}
              />
              <img
                src={visibilityIcon}
                className="showPassword"
                alt="Show password"
                onClick={() => {
                  setShowPassword((prev) => !prev);
                }}
              />
            </div>
            <Link to="/forgot-password" className="forgotPasswordLink">
              Forgot password ?
            </Link>
            <div className="signUpBar">
              <p className="signUpText">Join us</p>
              <button type="submit" className="signUpButton">
                <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
              </button>
            </div>
          </form>
          <OAuth />
          <Link to="/login" className="registerLink">
            Already have an account ?
          </Link>
        </main>
      </div>
    </div>
  );
  /* Component rendering. JSX code ends */
};
/* Component ends */

export default Register;
