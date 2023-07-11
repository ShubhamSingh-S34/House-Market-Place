import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.js";
import Explore from "./pages/Explore.js"
import ForgetPassword from "./pages/ForgetPassword.js"
import Offers from "./pages/Offers.js"
import Profile from "./pages/Profile.js"
import SignIn from "./pages/SignIn.js"
import SignUp from "./pages/SignUp.js"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; //toastify -css File
import PrivateRoute from "./components/PrivateRoute.jsx";
import Category from "./pages/Category.js";
import CreateListings from "./pages/CreateListings.js";
function App() {
  return (
   
   <div>
      <Router>
        <Routes>
        
          <Route path="/" element={<Explore />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp/>} />
          <Route path="/create-listing" element={<CreateListings/>} />
        </Routes>
        <ToastContainer />
        <Navbar />  
      </Router>
      <ToastContainer />
   </div>
  );
}

export default App;
