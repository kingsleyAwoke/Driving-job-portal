import React from 'react';
import { Redirect } from 'react-router-dom';

const withAuth = (WrappedComponent) => {
    return (props) => {
        const token = localStorage.getItem('token'); // Assuming you're storing the JWT in local storage

        if (!token) {
            // If no token, redirect to login
            return <Redirect to="/login" />;
        }

        // If token exists, render the wrapped component
        return <WrappedComponent {...props} />;
    };
};

export default withAuth;