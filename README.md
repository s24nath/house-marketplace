- Used Firebase-Authentication for authenticating Users.

- Used Fire-Store as database for storing Users as well Listings.

- User can create, update, delete their own posted properties.

- Used React-Toastify for alert messages.

- Used conditional private route with Outlet (that renders the child of the Route component) for a single routing path, from React-Router-DOM. It well check if any user is currently logged in then it will render the Outlet component (child in the Route component), else it will automatically redirect to the Login page. 

- Created custom hook that will check the status of Authentication-checking from Firebase. [Problem facing without this: Component is rendering before fetching the currentUser as a result it is getting null value. Also created a type of Loader for this].

- Used useRef hook to store the boolean value if the component is mounted or not. Changed this useRef value while the component is being unmounted with useEffect hook, mimicking the componentWillUnmount() in class component. [Problem facing without this: Getting memory leak warning on console due to asynchronous task.]

- Created forgot-password functionality. User will get a link for resetting their password to their registered email.

- Used React Router DOM library to implement dynamic page routing.

- Used Firebase library for easy management of backend services.

- Used Firebase O-Auth services for Google provider, to login or register with any Google account.

- Used useParams hook from React Router DOM library to access the parameters of the current route.

- Used Firebase cloud storage to store files such as images. We basically uploaded the files to the storage and got an unique link to access each of those files.

- Set onAuthStateChanged observer to observe the state of the auth object (by default the auth object is null). It also returns a function to unsubscribe or destroy the observer to solve memory leak issue. 

- Used Swiper package for image slider.

- Implemented "Load More" feature. Intially user will be able to see only 10 Listings, if the user clicks "Load More" button at the bottom they will be able to see 10 more Listings if available from database, including the previous Listings. Achieved it with the help of "startAfter" query method (query cursor) from Firebase.

