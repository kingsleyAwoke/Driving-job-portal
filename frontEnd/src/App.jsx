import React from 'react';
import Signup from './Components/Signup';
import OTPVerification from './Components/OTPVerification';
import Login from './Components/Login';

const App = () => {
    return (
        <div>
            <h1>Welcome to the Job Portal</h1>
            <Login />
        </div>
    );
};

export default App;