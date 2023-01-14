import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useAuthStatus = () => {
  const auth = getAuth();

  /* Component states declaration starts */
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingAuthStatus, setCheckingAuthStatus] = useState(true);
  /* Component states declaration ends */

  console.log("Rendering useAuthStatus");
  useEffect(() => {
    let unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      }
      setCheckingAuthStatus(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  return { loggedIn, checkingAuthStatus };
};
