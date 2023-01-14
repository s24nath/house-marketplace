import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";

/* Import image and SVG starts */
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
/* Import image and SVG ends */

/* Import local pages and component starts */
/* Import local pages and component ends */

/* *************************************************** */

/* Component starts */
const ForgotPassword = () => {
  /* Component states declaration starts */
  const [email, setEmail] = useState("");
  /* Component states declaration ends */

  /* Component variable declaration / object destructure starts */
  /* Component variable declaration / object destructure ends */

  /* Component function definition starts */
  const inputHandler = ({ target }) => {
    setEmail(target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success("Email was successfully sent");
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };
  /* Component function definition ends */

  /* Component rendering. JSX code starts */
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Forgot Password</p>
      </header>
      <main>
        <form onSubmit={submitHandler}>
          <input
            type="text"
            className="emailInput"
            placeholder="Email..."
            id="email"
            value={email}
            onChange={inputHandler}
          />
          <Link className="forgotPasswordLink" to="/login">
            Back to Login
          </Link>
          <div className="signInBar">
            <div className="signInText">Send Reset Link</div>
            <button type="submit" className="signInButton">
              <ArrowRightIcon fill="#fff" height="34px" width="34px" />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
  /* Component rendering. JSX code ends */
};
/* Component ends */

export default ForgotPassword;
