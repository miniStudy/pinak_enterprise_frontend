import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
import Person_types_insert from './insert_update/person_types_insert';

const Persons = () => {
    const [personsDetails, setPersonsDetails] = useState([]);
    const [personTypes, setPersonTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const modalRef = useRef();
    const deletemodel = useRef();
    const [delid, setdelid] = useState("");
    const [Messages, setMessages] = useState('');

    const [formData, setFormData] = useState({
        person_id: '',
        person_name: '',
        person_contact_number: '',
        person_register_date: '',
        person_status: true,
        person_address: '',
        person_other_details: '',
        person_business_job_name: '',
        person_business_job_company_num: '',
        person_business_job_address: '',
        person_gst: '',
        person_types_for_project: '',
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

    useEffect(() => {
        if (Messages) {
            const timer = setTimeout(() => {
                setMessages('');  // Clear success message after 3 seconds
            }, 3000);  // 3000 milliseconds = 3 seconds

            // Cleanup the timer if the component is unmounted or successMessage changes
            return () => clearTimeout(timer);
        }
    }, [Messages]);

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

    const closedeleteModal = () => {
        const modalInstance = Modal.getInstance(deletemodel.current);
        if (modalInstance) {
            modalInstance.hide();
        }
    };

    const opendeleteModal = (id) => {
        const modalInstance = new Modal(deletemodel.current);
        setdelid(id);
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

    const deleteData = async (id) => {
        try {
            const response = await axios.delete(
                `http://127.0.0.1:8000/delete_person/?person_id=${id}`
            );
            setMessages(response.data.message)
            fetchPersons();
            closedeleteModal();
        } catch (err) {
            setError("Failed to delete document type data")
        }
    }

    // Reset the form state
    const resetForm = () => {
        setFormData({
            person_id: '',
            person_name: '',
            person_contact_number: '',
            person_register_date: '',
            person_status: true,
            person_address: '',
            person_other_details: '',
            person_business_job_name: '',
            person_business_job_company_num: '',
            person_business_job_address: '',
            person_gst: '',
            person_types_for_project: '',
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
                {Messages && <div class="alert alert-success alert-dismissible fade show" role="alert">{Messages}</div>}
                
                
                <h3>Persons</h3>
                <button
                    type="button"
                    className="btn btn-sm mb-3 btn-primary"
                    onClick={openModal}
                >
                    Add Person
                </button>
                <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>S.N</th>
                            <th>Name</th>
                            <th>Contact</th>
                            <th>Register Date</th>
                            <th>Status</th>
                            <th>Address</th>
                            <th>Other Details</th>
                            <th>Job/Business Name</th>
                            <th>Company Number</th>
                            <th>Job Address</th>
                            <th>GST</th>
                            <th>Person Type For Project</th>
                            <th>Person Type</th>
                            <th>Update</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {personsDetails.length > 0 ? (
                            personsDetails.map((person, index) => (
                                <tr key={index+1}>
                                    <td>{person.person_id || 'N/A'}</td>
                                    <td>{person.person_name || 'N/A'}</td>
                                    <td>{person.person_contact_number || 'N/A'}</td>
                                    <td>{person.person_register_date || 'N/A'}</td>
                                    <td>{person.person_status ? 'Active' : 'Inactive'}</td>
                                    <td>{person.person_address || 'N/A'}</td>
                                    <td>{person.person_other_details || 'N/A'}</td>
                                    <td>{person.person_business_job_name || 'N/A'}</td>
                                    <td>{person.person_business_job_company_num || 'N/A'}</td>
                                    <td>{person.person_business_job_address || 'N/A'}</td>
                                    <td>{person.person_gst || 'N/A'}</td>
                                    <td>{person.person_types_for_project || 'N/A'}</td>
                                    <td>{person.person_type_id__person_type_name || 'N/A'}</td>
                                    <td>
                                        <i
                                            className="fa-regular fa-pen-to-square"
                                            onClick={() => editDetailsGetData(person.person_id)}
                                        ></i>
                                    </td>
                                    <td>
                                        <i
                                            className="fa-regular fa-trash-can"
                                            onClick={() => opendeleteModal(person.person_id)}
                                        ></i>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="15">No person details available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </div>

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
                            
                            <Person_types_insert fetchdata={fetchPersons} />
                        
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    name="person_name"
                                    value={formData.person_name}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Person Name*"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <input
                                    type="text"
                                    name="person_contact_number"
                                    value={formData.person_contact_number}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Person Contact*"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <textarea
                                    name="person_address"
                                    value={formData.person_address}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Person Address"
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <input
                                    type="text"
                                    name="person_business_job_name"
                                    value={formData.person_business_job_name}
                                    onChange={handleChange}
                                    placeholder="Job/Business Name"
                                    className="form-control"
                                />
                            </div>

                            <div className="mb-3">
                                <input
                                    type="text"
                                    name="person_business_job_company_num"
                                    value={formData.person_business_job_company_num}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Business/Job Number"
                                />
                            </div>

                            <div className="mb-3">
                                <textarea
                                    name="person_business_job_address"
                                    value={formData.person_business_job_address}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Business/Job Address"
                                    
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <input
                                    type="text"
                                    name="person_gst"
                                    value={formData.person_gst}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="GST Number"
                                />
                            </div>

                            <div className="mb-3">
                                    <select
                                        name="person_type_id"
                                        value={formData.person_type_id}
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Select Person Type*</option>
                                        {personTypes.map((type) => (
                                            <option
                                                key={type.person_type_id}
                                                value={type.person_type_id}
                                            >
                                                {type.person_type_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                            <div className="mb-3">
                                <select
                                    name="person_types_for_project"
                                    value={formData.person_types_for_project}
                                    onChange={handleChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="">Select Person Type For Project*</option>
                                    <option value="Worker">Worker</option>
                                    <option value="Project">Project</option>
                                    <option value="Material">Material</option>
                                    <option value="Machine">Machine</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                                <div className="mb-3">       
                                <select
                                    name="person_status"
                                    value={formData.person_status}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </select>
                                </div> 

                            
                                <div className="mb-3">
                                <textarea
                                    name="person_other_details"
                                    value={formData.person_other_details}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Addtional details..."
                                ></textarea>
                                </div>
                                <button type="submit" className="btn btn-sm btn-primary">
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* delete Model confirmation */}
            <div
                className="modal fade"
                id="Modal"
                tabIndex="-1"
                aria-labelledby="ModalLabel"
                aria-hidden="true"
                ref={deletemodel}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="ModalLabel">
                                Delete Persons Data
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            are you sure You want to delete this data?<br />

                            <div className="mt-2">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                    onClick={() => deleteData(delid)}
                                >Delete</button>

                                <button
                                    type="button"
                                    className="btn btn-sm btn-primary ms-2"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                >Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Persons;