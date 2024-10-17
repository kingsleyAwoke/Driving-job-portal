import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfileDetails = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('/profile');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setError('Failed to fetch user profile.');
            }
        };

        fetchUserProfile();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-details">
            <h1>{user.name}</h1>
            <p>Email: {user.email}</p>
        </div>
    );
};

export default ProfileDetails;