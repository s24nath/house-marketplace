import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
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
const Login = () => {
  /* Component states declaration starts */
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  /* Component states declaration ends */

  /* Other hooks declaration starts */
  const navigate = useNavigate();
  /* Other hooks declaration ends */

  /* Component variable declaration / object destructure starts */
  const { email, password } = loginData;
  /* Component variable declaration / object destructure ends */

  /* Component function definition starts */
  const formInputHandler = ({ target }) => {
    setLoginData((prevState) => ({
      ...prevState,
      [target.id]: target.value,
    }));
  };
  const submitHandler = (e) => {
    e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) navigate("/");
      })
      .catch((error) => {
        toast.error("Wrong credentials");
      });
  };
  /* Component function definition ends */

  /* Component rendering. JSX code starts */
  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>
        <main>
          <form onSubmit={submitHandler}>
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
            <div className="signInBar">
              <p className="signInText">Log in</p>
              <button className="signInButton">
                <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
              </button>
            </div>
          </form>
          <OAuth />
          <Link to="/register" className="registerLink">
            Don't have an accout ?
          </Link>
        </main>
      </div>
    </>
  );
  /* Component rendering. JSX code ends */
};
/* Component ends */

export default Login;
