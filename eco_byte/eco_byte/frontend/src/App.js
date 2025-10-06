import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import Home from "./pages/Home"; 
import Pricing from "./pages/pricing"; 
import BookNow from "./pages/booknow"; 
import Address from "./pages/address"; 
import Login from "./pages/login";
import Blog from "./pages/blog"; 
import Footer from "./components/footer";
import Profile from "./pages/profile";
import ManageRequests from "./pages/managerequest"; 
import ManageAddress from "./pages/manageaddress"; 
import Services from "./pages/services"; 
import SchedulePickup from "./pages/SchedulePickup";
import BookingConfirmation from "./pages/booking-confirmation";
import Steps from "./components/Steps";
import UserTable from "./pages/user_details_admin";
import Qutations from "./pages/quotation_admin";
import PriceList from "./pages/price_list_admin";
import AdminPincodes from "./pages/pincodes_admin";
import PickupAdmin from "./pages/pickup_admin";
// ✅ ScrollToTop logic inside App
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop /> {/* ✅ Auto scrolls to top on route change */}

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} /> 
        <Route path="/booknow" element={<BookNow />} /> 
        <Route path="/address" element={<Address />} /> 
        <Route path="/login" element={<Login />} /> 
        <Route path="/blog" element={<Blog />} /> 
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/managerequest" element={<ManageRequests />} /> 
        <Route path="/manageaddress" element={<ManageAddress />} /> 
        <Route path="/services" element={<Services />} />
        <Route path="/SchedulePickup" element={<SchedulePickup />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="/steps" element={<Steps activeStep={2} />} /> {/* Your Steps component */}
        <Route path="/price-list-admin" element={<PriceList />} />
        <Route path="/user-details-admin" element={<UserTable />} />
        <Route path="/quotation-admin" element={<Qutations />} />
        <Route path="/pincodes-admin" element={<AdminPincodes />} />
        <Route path="/pickup-admin" element={<PickupAdmin />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
