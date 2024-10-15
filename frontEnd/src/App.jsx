import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SetupVehicleOp from './Components/SetupVehicleOp';
//import VehicleOpListing from './Components/VehicleOpListing';
// import ProfileDetails from './Components/ProfileDetails'
//import HomePage from './Pages/HomePage';
const Home = () => <h1>Home page</h1>
const About = () => <h1>About page</h1>
const App = () => {
    return (
      <Routes>
        <Route index path='/' element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path='/setup' element={<SetupVehicleOp />} />
       </Routes>
    );
};

export default App;