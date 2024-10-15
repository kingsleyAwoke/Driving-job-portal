import React, { useEffect, useState } from 'react';

const ProfileDetails = ({ match }) => {
    const [user, setUser] = useState(null);
    const userId = match.params.id;

    useEffect(() => {
        const fetchUserProfile = async () => {
            const response = await fetch(`/api/profile/${userId}`);
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            }
        };

        fetchUserProfile();
    }, [userId]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-details">
            <h1>{user.name}</h1>
            <img src={user.profile_picture} alt={`${user.name}'s profile`} style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
            <p>Email: {user.email}</p>
            <p>Contact: {user.mobile_number}</p>
            <p>Vehicle Type: {user.vehicle_type}</p>
            <p>Experience Level: {user.experience_level}</p>
            <p>Availability: {user.availability}</p>
            <p>Location: {user.location}</p>
            <p>Bio: {user.bio}</p>
        </div>
    );
};

export default ProfileDetails;