import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { db } from "../firebase.config";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

/* Import local pages and component starts */
import Loader from "../components/Loader";
/* Import local pages and component ends */

/* *************************************************** */

/* Component starts */
const UpdateAdvertisement = () => {
  /* Component states declaration starts */
  const [propertyInfo, setPropertyInfo] = useState({
    bathrooms: 1,
    bedrooms: 1,
    discountedPrice: 0,
    furnished: false,
    imageUrls: [],
    imageFiles: [],
    location: "",
    name: "",
    offer: false,
    parking: false,
    regularPrice: 0,
    type: "rent",
    contactNum: "",
    contactEmail: "",
    about: "",
    userRef: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedProperty, setFetchedProperty] = useState(null);
  /* Component states declaration ends */

  /* Other hooks declaration starts */
  const auth = getAuth();
  const navigate = useNavigate();
  const params = useParams();
  /* Other hooks declaration ends */

  /* Component variable declaration / object destructure starts */
  const {
    bathrooms,
    bedrooms,
    discountedPrice,
    furnished,
    imageFiles,
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
  } = propertyInfo;
  /* Component variable declaration / object destructure ends */

  /* Component function definition starts */
  const uploadImage = async (image) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      const uniqueFileName = `${image.name}-${uuidv4()}-${userRef}`;
      const storageRef = ref(storage, `images/${uniqueFileName}`);
      const uploadTask = uploadBytesResumable(storageRef, image);
      console.log(uniqueFileName);
      /*
       * Register three observers:
       * 1. 'state_changed' observer, called any time the state changes
       * 2. Error observer, called on failure
       * 3. Completion observer, called on successful completion
       */
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          reject(error);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (regularPrice === 0) {
      setIsLoading(false);
      toast.error("Provide regular price");
      return;
    }
    if (offer && discountedPrice === 0) {
      setIsLoading(false);
      toast.error("Provide discounted price");
      return;
    }
    if (discountedPrice >= regularPrice) {
      setIsLoading(false);
      toast.error("Discount price is greater than Regular price");
      return;
    }
    if (imageFiles.length > 6) {
      setIsLoading(false);
      toast.error("Maximum 6 images can be uploaded");
      return;
    }
    if (isNaN(contactNum)) {
      setIsLoading(false);
      toast.error("Provide a valid contact number");
      return;
    }

    // Upload images in firebase
    const imgUrlsResult = await Promise.all(
      [...imageFiles].map((image) => uploadImage(image))
    ).catch(() => {
      setIsLoading(false);
      toast.error(
        "Images cannot upload. Upload image less than 2MB and try again"
      );
      return;
    });

    const formDataCopy = {
      ...propertyInfo,
      about: propertyInfo.about.trim(),
      imageUrls: imgUrlsResult,
      timestamp: serverTimestamp(),
    };
    delete formDataCopy.imageFiles;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    console.log(formDataCopy);
    try {
      const docRef = doc(db, "listings", params.id);
      await updateDoc(docRef, formDataCopy);
      setIsLoading(false);
      toast.success("Property advertisement successfully posted");
      navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  const onInputChange = ({ target }) => {
    let value = target.value;
    // For boolean values
    if (
      target.id === "parking" ||
      target.id === "furnished" ||
      target.id === "offer"
    ) {
      // Converting the string of boolean to actual boolean
      if (value === "true") value = true;
      else value = false;
    }

    // For images
    if (target.files) {
      setPropertyInfo((prevState) => ({
        ...prevState,
        imageFiles: target.files,
      }));
    }

    console.log(target.id);
    // For text and numbers
    if (!target.files) {
      setPropertyInfo((prevState) => ({
        ...prevState,
        [target.id]: value,
      }));
    }
  };
  const fetchPropertyDetails = (currentUserID) => {
    const docRef = doc(db, "listings", params.id);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          setFetchedProperty(docSnap.data());
          setPropertyInfo(docSnap.data());
        } else {
          navigate("/");
          toast.error("Property does not exist.");
        }
      })
      .then(() => {
        if (fetchedProperty && fetchedProperty.userRef !== currentUserID) {
          toast.error("You cannot edit the property");
          navigate("/");
        }
        setIsLoading(false);
      });
  };
  /* Component function definition ends */

  /* Component useEffect starts */
  useEffect(() => {
    let unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setPropertyInfo({
          ...propertyInfo,
          userRef: user.uid,
        });
        fetchPropertyDetails(user.uid);
      } else {
        navigate("/login");
      }
    });
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* Component useEffect ends */

  /* Component rendering. JSX code starts */
  if (isLoading) return <Loader />;

  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Edit Advertisement</p>
      </header>
      <main>
        <form onSubmit={submitHandler}>
          <label className="formLabel">Sell / Rent</label>
          <div className="formButtons">
            <button
              type="button"
              id="type"
              onClick={onInputChange}
              value="sale"
              className={type === "sale" ? "formButtonActive" : "formButton"}
            >
              Sell
            </button>
            <button
              type="button"
              id="type"
              value="rent"
              onClick={onInputChange}
              className={type === "rent" ? "formButtonActive" : "formButton"}
            >
              Rent
            </button>
          </div>

          <label className="formLabel">Property Name</label>
          <input
            className="formInputName"
            type="text"
            id="name"
            value={name}
            onChange={onInputChange}
            required
          />

          <label className="formLabel">Contact Email</label>
          <input
            className="formInputName"
            type="email"
            id="contactEmail"
            value={contactEmail}
            onChange={onInputChange}
            required
          />

          <label className="formLabel">Contact Number</label>
          <input
            className="formInputName"
            type="text"
            id="contactNum"
            value={contactNum}
            onChange={onInputChange}
            required
          />

          <div className="formRooms flex">
            <div>
              <label className="formLabel">Bedrooms</label>
              <input
                className="formInputSmall"
                type="number"
                id="bedrooms"
                value={bedrooms}
                onChange={onInputChange}
                min="1"
                max="50"
                required
              />
            </div>
            <div>
              <label className="formLabel">Bathrooms</label>
              <input
                className="formInputSmall"
                type="number"
                id="bathrooms"
                value={bathrooms}
                onChange={onInputChange}
                min="1"
                max="50"
                required
              />
            </div>
          </div>

          <label className="formLabel">Parking spot</label>
          <div className="formButtons">
            <button
              className={parking ? "formButtonActive" : "formButton"}
              type="button"
              id="parking"
              value={true}
              onClick={onInputChange}
              min="1"
              max="50"
            >
              Yes
            </button>
            <button
              className={
                !parking && parking !== null ? "formButtonActive" : "formButton"
              }
              type="button"
              id="parking"
              value={false}
              onClick={onInputChange}
            >
              No
            </button>
          </div>

          <label className="formLabel">Furnished</label>
          <div className="formButtons">
            <button
              className={furnished ? "formButtonActive" : "formButton"}
              type="button"
              id="furnished"
              value={true}
              onClick={onInputChange}
            >
              Yes
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? "formButtonActive"
                  : "formButton"
              }
              type="button"
              id="furnished"
              value={false}
              onClick={onInputChange}
            >
              No
            </button>
          </div>

          <label className="formLabel">Address</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="location"
            value={location}
            onChange={onInputChange}
            required
          />

          <label className="formLabel">About the place</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="about"
            value={about}
            onChange={onInputChange}
            required
          />

          <label className="formLabel">On offer</label>
          <div className="formButtons">
            <button
              className={offer ? "formButtonActive" : "formButton"}
              type="button"
              id="offer"
              value={true}
              onClick={onInputChange}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? "formButtonActive" : "formButton"
              }
              type="button"
              id="offer"
              value={false}
              onClick={onInputChange}
            >
              No
            </button>
          </div>

          <label className="formLabel">Regular Price</label>
          <div className="formPriceDiv">
            <input
              className="formInputSmall"
              type="number"
              id="regularPrice"
              value={regularPrice}
              onChange={onInputChange}
              required
            />
            {type === "rent" && <p className="formPriceText">$ / Month</p>}
          </div>

          {offer && (
            <>
              <label className="formLabel">Discounted Price</label>
              <input
                className="formInputSmall"
                type="number"
                id="discountedPrice"
                value={discountedPrice}
                onChange={onInputChange}
                required={offer}
              />
            </>
          )}

          <label className="formLabel">Images</label>
          <p className="imagesInfo">
            The first image will be the cover (max 6).
          </p>
          <input
            className="formInputFile"
            type="file"
            id="imageFiles"
            onChange={onInputChange}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />

          <button type="submit" className="primaryButton createListingButton">
            Post
          </button>
        </form>
      </main>
    </div>
  );
  /* Component rendering. JSX code ends */
};
/* Component ends */

export default UpdateAdvertisement;
