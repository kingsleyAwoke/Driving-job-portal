import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Signup from './Components/Signup';
import OTPVerification from './Components/OTPVerification';
import Login from './Components/Login';
import UserDashboard from './Components/UserDashboard';
import ProtectedDashboard from './Components/ProtectedDashboard';

const App = () => {
    return (
        <Router>
            <Switch>
              <Route path="/" exact Component={Signup} />
              <Route path="/login" Component={Login} />
              <Route path="/user-dashboard" Component={ProtectedDashboard} />
            </Switch>
        </Router>
    );
};

export default App;