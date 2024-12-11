import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Home from "./component/Home";
import Login from "./component/Login";
import Register from "./component/Register"
import Admin from "./component/Admin"
import Seller from "./component/Seller"
import Profile from "./component/profile"
import EditProfile from "./component/edit-profile"
import EditPassword from "./component/edit-password"
import CookieDisplay from "./component/CookieDisplay"
import ProductDetails from "./component/ProductDetails"

const App = () => {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/seller" element={<Seller />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/CookieDisplay" element={<CookieDisplay />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/edit-password" element={<EditPassword />} />
          <Route path="/product/:documentId" element={<ProductDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
