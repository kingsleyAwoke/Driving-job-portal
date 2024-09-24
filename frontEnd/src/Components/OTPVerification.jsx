import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useHistory } from 'react-router-dom';

const OTPVerification = () => {
    const location = useLocation();
    const history = useHistory();
    const { email, mobile_number } = location.state || {}; // Get email and mobile number from state
    const [otp, setOtp] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/validate-otp', { email, mobile_number, otp });
            alert('OTP validated successfully!');
            history.push('/dashboard'); // Redirect to the user dashboard
        } catch (error) {
            alert('Error validating OTP');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                readOnly // Make the email field read-only
            />
            <input 
                type="text" 
                placeholder="Mobile Number" 
                value={mobile_number} 
                readOnly // Make the mobile number field read-only
            />
            <input 
                type="text" 
                placeholder="OTP" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                required 
            />
            <button type="submit">Verify OTP</button>
        </form>
    );
};

export default OTPVerification;