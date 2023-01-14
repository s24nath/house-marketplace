import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

/* Import local pages and component starts */
import Loader from "../components/Loader";
import PropertyEach from "../components/PropertyEach";
/* Import local pages and component ends */

/* *************************************************** */

/* Component starts */
const Category = () => {
  /* Component states declaration starts */
  const [houseListings, setHouseListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchedProperty, setLastFetchedProperty] = useState(null);
  /* Component states declaration ends */

  /* Other hooks declaration starts */
  const params = useParams();
  /* Other hooks declaration ends */

  /* Component function definition starts */
  const fetchPropertyLists = (initialQuery) => {
    const listingRef = collection(db, "listings");
    let queryInitialization;
    if (initialQuery) {
      queryInitialization = query(
        listingRef,
        where("type", "==", params.type),
        orderBy("timestamp", "desc"),
        limit(10)
      );
    } else {
      queryInitialization = query(
        listingRef,
        where("type", "==", params.type),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedProperty),
        limit(10)
      );
    }

    getDocs(queryInitialization)
      .then((executeQuery) => {
        const listings = [];
        const lastProperty = executeQuery.docs[executeQuery.docs.length - 1];
        setLastFetchedProperty(lastProperty);
        executeQuery.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setHouseListings((prevState) => [...prevState, ...listings]);
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error("Could not fetch data");
      });
  };
  /* Component function definition ends */

  /* Component useEffect starts */
  useEffect(() => {
    fetchPropertyLists(true);
  }, [params.type]);
  /* Component useEffect ends */

  /* Component rendering. JSX code starts */
  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.type === "rent" ? "Places for Rent" : "Places for Sale"}
        </p>
      </header>
      {isLoading ? (
        <Loader />
      ) : houseListings && houseListings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {houseListings.map((currentPlace) => (
                <PropertyEach
                  key={currentPlace.id}
                  id={currentPlace.id}
                  place={currentPlace.data}
                  deleteHandler={null}
                />
              ))}
            </ul>
          </main>

          <br />
          <br />

          {lastFetchedProperty ? (
            <p className="loadMore" onClick={() => fetchPropertyLists(false)}>
              Load More
            </p>
          ) : (
            <p
              style={{
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              That's it
            </p>
          )}
        </>
      ) : (
        <p>No places for {params.type}</p>
      )}
    </div>
  );
  /* Component rendering. JSX code ends */
};
/* Component ends */

export default Category;
