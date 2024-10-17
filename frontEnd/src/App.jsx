import React from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import SetupVehicleOp from './Components/SetupVehicleOp';
import Login from './Components/Login';
import OTPVerification from './Components/OTPVerification';
import Signup from './Components/Signup';
import ProfileDetails from "./Components/ProfileDetails";
//import VehicleOpListing from './Components/VehicleOpListing';
// import ProfileDetails from './Components/ProfileDetails'
import HomePage from './Pages/HomePage';
import AboutPage from './Pages/AboutPage';
import ContactPage from './Pages/ContactPage';
import Layout from "./Components/Layout";
import NotFoundPage from "./Pages/NotFoundPage";

const App = () => {
  const router = createBrowserRouter( 
    createRoutesFromElements(
      <Route path='/' element={<Layout /> } >
        <Route index element={<HomePage /> } />
        <Route path="/sign-up" element={<SetupVehicleOp /> } />
        <Route path='/contact' element={<ContactPage /> } />
        <Route path='/about' element={<AboutPage /> } />
        <Route path='/login' element={<Login /> } />
        <Route path="/setup-operator" element={<SetupVehicleOp /> } />
        <Route path="/signup" element={<Signup /> } />
        <Route path="/otpverify" element={<OTPVerification /> } />
        <Route path="/profile" element={<ProfileDetails />} />
        
        {/* NOT FOUND PAGE ROUTE */}
        <Route path='*' element={<NotFoundPage />} />
      </Route>
      )
    );
  
  
    return (<RouterProvider router={ router } />);
};

export default App;