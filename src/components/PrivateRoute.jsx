import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";

/* Import local pages and component starts */
import Loader from "./Loader";
/* Import local pages and component ends */

/* *************************************************** */

/* Component starts */
const PrivateRoute = () => {
  /* Other hooks declaration starts */
  const { loggedIn, checkingAuthStatus } = useAuthStatus();
  /* Other hooks declaration ends */

  /* Component rendering. JSX code starts */
  if (checkingAuthStatus) {
    return <Loader />;
  }

  return loggedIn ? <Outlet /> : <Navigate to="/login" />;
  /* Component rendering. JSX code ends */
};
/* Component ends */

export default PrivateRoute;
