import React from 'react';
import { useHistory } from 'react-router-dom';

const VehicleOpListing = ({ user }) => {
    const history = useHistory();

    const handleClick = () => {
        history.push(`/profile/${user.id}`); // Redirect to full profile details
    };

    return (
        <div className="profile-preview" onClick={handleClick} style={{ cursor: 'pointer', border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
            <img src={user.profile_picture} alt={`${user.name}'s profile`} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
            <h2>{user.name}</h2>
            <p>Contact: {user.mobile_number}</p>
            <p>Vehicle Type: {user.vehicle_type}</p>
            <p>Experience Level: {user.experience_level}</p>
            <p>Availability: {user.availability}</p>
            <p>Location: {user.location}</p>
        </div>
    );
};

export default VehicleOpListing;