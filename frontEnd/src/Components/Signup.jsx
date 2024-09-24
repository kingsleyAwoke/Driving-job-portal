import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile_number, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory(); // Hook for navigation

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/signup', { name, email, mobile_number, password });
            alert('Signup successful! Check your email for the OTP.');
            // Redirect to the validation page with email and mobile number
            history.push('/validate-otp', { email, mobile_number });
        } catch (error) {
            alert('Error during signup');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder="Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
            />
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
            />
            <input 
                type="text" 
                placeholder="Mobile Number" 
                value={mobile_number} 
                onChange={(e) => setMobileNumber(e.target.value)} 
                required 
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
            />
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default Signup;