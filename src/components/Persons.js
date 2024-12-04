import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';

const Persons = () => {
    const [personsDetails, setPersonsDetails] = useState([]);
    const [personTypes, setPersonTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const modalRef = useRef();

    // Form state for Add/Edit
    const [formData, setFormData] = useState({
        person_id: '',
        person_name: '',
        person_contact_number: '',
        person_work_type: '',
        person_type_id: '',
    });

    // Fetch person details
    const fetchPersons = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/show_persons/');
            setPersonsDetails(response.data.data || []);
            setPersonTypes(response.data.person_types || []);
            setLoading(false);
        } catch (err) {
            setError('Failed to load person details');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPersons();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission for Add/Update
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/insert_update_person/',
                formData
            );
            if (response.status === 200) {
                alert('Person details saved successfully!');
                fetchPersons(); // Reload data
                resetForm();
                closeModal();
            } else {
                alert('Failed to save person details.');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Error occurred while saving person details.');
        }
    };

    // Close the modal
    const closeModal = () => {
        const modalInstance = Modal.getInstance(modalRef.current);
        if (modalInstance) {
            modalInstance.hide();
        }
    };

    // Open the modal
    const openModal = () => {
        const modalInstance = new Modal(modalRef.current);
        modalInstance.show();
    };

    // Fetch data for editing a specific person
    const editDetailsGetData = async (id) => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/insert_update_person/?getdata_id=${id}`
            );
            setFormData(response.data.data);
            setPersonTypes(response.data.person_types || []);
            openModal();
        } catch (err) {
            setError('Failed to load person details');
        }
    };

    // Reset the form state
    const resetForm = () => {
        setFormData({
            person_id: '',
            person_name: '',
            person_contact_number: '',
            person_work_type: '',
            person_type_id: '',
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <div>
                <h1>Persons</h1>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={openModal}
                >
                    Add Person
                </button>

                <table>
                    <thead>
                        <tr>
                            <th>Person ID</th>
                            <th>Name</th>
                            <th>Contact Number</th>
                            <th>Work Type</th>
                            <th>Person Type</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {personsDetails.length > 0 ? (
                            personsDetails.map((person) => (
                                <tr key={person.person_id}>
                                    <td>{person.person_id || 'N/A'}</td>
                                    <td>{person.person_name || 'N/A'}</td>
                                    <td>{person.person_contact_number || 'N/A'}</td>
                                    <td>{person.person_work_type || 'N/A'}</td>
                                    <td>{person.person_type_id__person_type_name || 'N/A'}</td>
                                    <td>
                                        <i
                                            className="fa-regular fa-pen-to-square"
                                            onClick={() => editDetailsGetData(person.person_id)}
                                        ></i>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No person details available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for Add/Edit Person */}
            <div
                className="modal fade"
                id="personModal"
                tabIndex="-1"
                aria-labelledby="personModalLabel"
                aria-hidden="true"
                ref={modalRef}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="personModalLabel">
                                {formData.person_id ? 'Edit Person' : 'Add Person'}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label>Name:</label>
                                    <input
                                        type="text"
                                        name="person_name"
                                        value={formData.person_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Contact Number:</label>
                                    <input
                                        type="text"
                                        name="person_contact_number"
                                        value={formData.person_contact_number}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Work Type:</label>
                                    <select
                                        name="person_work_type"
                                        value={formData.person_work_type}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Work Type</option>
                                        <option value="Worker">Worker</option>
                                        <option value="Project">Project</option>
                                        <option value="Material">Material</option>
                                        <option value="Machine">Machine</option>
                                        <option value="Bhatthu">Bhatthu</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Person Type:</label>
                                    <select
                                        name="person_type_id"
                                        value={formData.person_type_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Person Type</option>
                                        {personTypes.map((type) => (
                                            <option
                                                key={type.person_type_id}
                                                value={type.person_type_id}
                                            >
                                                {type.person_type_name }
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Persons;