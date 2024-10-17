import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
const OTPVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { email, mobile_number } = location.state || {};
    const [otp, setOtp] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/validate-otp', { email, mobile_number, otp });
            alert('OTP validated successfully!');
            navigate('/dashboard'); // Redirect to the user dashboard
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
                readOnly 
            />
            <input 
                type="text" 
                placeholder="Mobile Number" 
                value={mobile_number} 
                readOnly 
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