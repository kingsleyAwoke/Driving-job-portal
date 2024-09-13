import React, { useState } from 'react';
import axios from 'axios';

const OTPVerification = () => {
    const [email, setEmail] = useState('');
    const [mobile_number, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/validate-otp', { email, mobile_number, otp });
            alert('OTP validated successfully!');
        } catch (error) {
            alert('Error validating OTP');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="text" placeholder="Mobile Number" value={mobile_number} onChange={(e) => setMobileNumber(e.target.value)} />
            <input type="text" placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            <button type="submit">Verify OTP</button>
        </form>
    );
};

export default OTPVerification;