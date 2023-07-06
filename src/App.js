import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.js";
import Explore from "./pages/Explore.js"
import ForgetPassword from "./pages/ForgetPassword.js"
import Offers from "./pages/Offers.js"
import Profile from "./pages/Profile.js"
import SignIn from "./pages/SignIn.js"
import SignUp from "./pages/SignUp.js"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; //toastify -css File
function App() {
  return (
   
   <div>
      <Router>
        <Routes>
        
          <Route path="/" element={<Explore />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp/>} />
        </Routes>
        <ToastContainer />
        <Navbar />  
      </Router>
      <ToastContainer />
   </div>
  );
}

export default App;
