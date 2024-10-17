import React, { useEffect, useState } from 'react';

const VehicleOperators = ({ operatorId }) => {
    const [operator, setOperator] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOperatorData = async () => {
        try {
            const response = await fetch(`/vehicle-operators/${operatorId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch operator data');
            }
            const data = await response.json();
            setOperator(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOperatorData();
    }, [operatorId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="card">
            <img src={operator.profile_picture} alt={`${operator.username}'s profile`} />
            <h3>{operator.username}</h3>
            <p>Age: {operator.age}</p>
            <p>Gender: {operator.gender}</p>
            <p>Location: {operator.location}</p>
            <p>Vehicle Type: {operator.vehicle_type}</p>
            <p>Experience: {operator.vehicle_operation_experience}</p>
        </div>
    );
};

export default VehicleOperators;