import React, { useEffect, useState } from 'react';

const SetupVehicleOp = () => {
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        marital_status: '',
        school_qualification: '',
        vehicle_operation_experience: '',
        vehicle_type: '',
        availability: '',
        license_class: '',
        profile_picture: '',
        location: '', // Using location for state selection
    });

    const [states, setStates] = useState([]);
    const [error, setError] = useState('');

    const getStatesFromApi = async () => {
        try {
            let response = await fetch('https://nga-states-lga.onrender.com/fetch');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            let json = await response.json();
            return json; // This returns the array of states
        } catch (error) {
            console.error('Error fetching states:', error);
            setError(error.message);
        }
    };

    useEffect(() => {
        const fetchStates = async () => {
            const statesData = await getStatesFromApi();
            if (statesData) {
                setStates(statesData);
            }
        };

        fetchStates();

        // Load form data from localStorage if available
        const savedData = localStorage.getItem('vehicleOpFormData');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);
        localStorage.setItem('vehicleOpFormData', JSON.stringify(updatedFormData)); // Update localStorage
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/setup-operator', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert('Setup completed successfully!');
            localStorage.removeItem('vehicleOpFormData'); // Clear localStorage on successful submission
            setFormData({ // Reset form data
                age: '',
                gender: '',
                marital_status: '',
                school_qualification: '',
                vehicle_operation_experience: '',
                vehicle_type: '',
                availability: '',
                license_class: '',
                profile_picture: '',
                location: '',
            });
        } else {
            alert('Error setting up vehicle operator.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
            <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>
            <select name="marital_status" value={formData.marital_status} onChange={handleChange} required>
                <option value="">Select Marital Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
            </select>
            <input type="text" name="school_qualification" placeholder="School Qualification" value={formData.school_qualification} onChange={handleChange} required />
            <input type="text" name="vehicle_operation_experience" placeholder="Vehicle Operation Experience" value={formData.vehicle_operation_experience} onChange={handleChange} required />
            <input type="text" name="vehicle_type" placeholder="Vehicle Type" value={formData.vehicle_type} onChange={handleChange} required />
            <input type="text" name="availability" placeholder="Availability" value={formData.availability} onChange={handleChange} required />
            <input type="text" name="license_class" placeholder="License Class" value={formData.license_class} onChange={handleChange} required />
            <input type="text" name="profile_picture" placeholder="Profile Picture URL" value={formData.profile_picture} onChange={handleChange} />

            <label htmlFor="location">Select Location (State):</label>
            <select name="location" value={formData.location} onChange={handleChange} required>
                <option value="">--Select a state--</option>
                {states.map((state, index) => (
                    <option key={index} value={state}>
                        {state}
                    </option>
                ))}
            </select>

            <button type="submit">Become a Vehicle Operator</button>
        </form>
    );
};

export default SetupVehicleOp;