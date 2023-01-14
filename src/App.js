import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

/* Import local pages and component starts */
// Components
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
// Pages
import Explore from "./pages/Explore";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Category from "./pages/Category";
import PostAdvertisement from "./pages/PostAdvertisement";
import UpdateAdvertisement from "./pages/UpdateAdvertisement";
import PropertyDetails from "./pages/PropertyDetails";
/* Import local pages and component ends */

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/category/:type" element={<Category />} />
          <Route path="/category/:type/:id" element={<PropertyDetails />} />
          <Route path="/offers" element={<Offers />} />

          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-ad" element={<PostAdvertisement />} />
          <Route path="/edit-ad/:id" element={<UpdateAdvertisement />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
        <Navbar />
      </Router>

      <ToastContainer theme="dark" />
    </>
  );
}

export default App;
