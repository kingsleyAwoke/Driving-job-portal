import React from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import SetupVehicleOp from './Components/SetupVehicleOp';
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
        
        <Route path='/contact' element={<ContactPage /> } />
        <Route path='/about' element={<AboutPage /> } />
      
        /* NOT FOUND PAGE ROUTE */
        <Route path='*' element={<NotFoundPage />} />
      </Route>
      )
    );
  
  
    return (<RouterProvider router={ router } />);
};

export default App;