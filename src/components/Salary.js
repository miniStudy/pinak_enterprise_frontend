import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';

const Machines = () => {
    const [Salary, setSalary] = useState([]);
    const [PersonsData, setPersonsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const modalRef = useRef();
    const deletemodel = useRef();
    const [delid, setdelid] = useState("");
    const [Messages, setMessages] = useState('');

    // Form state for Add/Edit
    const [formData, setFormData] = useState({
        salary_id: "",
        salary_date: "",
        salary_amount: "",
        salary_working_days: "",
        salary_details: "",
        person_id: "",
    });


    // Fetch machine details
    const fetchSalary = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/show_salary/');
            setSalary(response.data.data || []);
            setPersonsData(response.data.persons_data || []);
            setTitle(response.data.title);
            setLoading(false);
        } catch (err) {
            setError('Failed to load machine details');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalary();
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
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle form submission for Add/Update
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/insert_update_salary/',
                formData
            );
            if (response.status === 200) {
                alert('Salary details saved successfully!');
                fetchSalary(); // Reload data
                resetForm();
                closeModal();
            } else {
                alert('Failed to save salary details.');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Error occurred while saving salary details.');
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

    // Fetch data for editing a specific machine
    const editDetailsGetData = async (id) => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/insert_update_salary/?getdata_id=${id}`
            );
            setFormData(response.data.data);
            console.log(response.data.data)
            setPersonsData(response.data.persons_data || []);
            openModal()
        } catch (err) {
            setError('Failed to load salary details');
        }
    };


    const deleteData = async (id) => {
        try {
            const response = await axios.delete(
                `http://127.0.0.1:8000/delete_salary/?salary_id=${id}`
            );
            setMessages(response.data.message)
            fetchSalary();
            closedeleteModal();
        } catch (err) {
            setError("Failed to delete document type data")
        }
    }

    // Reset the form state
    const resetForm = () => {
        setFormData({
            salary_id: "",
            salary_date: "",
            salary_amount: "",
            salary_working_days: "",
            salary_details: "",
            person_id: "",
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
                <h1>{title}</h1>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={openModal}
                >
                    Add Salary
                </button>

                <table>
                    <thead>
                        <tr>
                            <th>S.N</th>
                            <th>Person Name</th>
                            <th>Contact Number</th>
                            <th>Salary Date</th>
                            <th>Salary Amount</th>
                            <th>Working Days</th>
                            <th>Salary Details</th>
                            <th>Update</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Salary.length > 0 ? (
                            Salary.map((salary, index) => (
                                <tr key={salary.salary_id}>
                                    <td>{index+1}</td>
                                    <td>{salary.person_id__person_name || "N/A"}</td>
                                    <td>{salary.person_id__person_contact_number || "N/A"}</td>
                                    <td>{salary.salary_date || "N/A"}</td>
                                    <td>{salary.salary_amount || "N/A"}</td>
                                    <td>{salary.salary_working_days || "N/A"}</td>
                                    <td>{salary.salary_details || "N/A"}</td>
                                    <td><i className="fa-regular fa-pen-to-square" onClick={() => editDetailsGetData(salary.salary_id)}></i></td>
                                    <td><i class="fa-regular fa-trash-can" onClick={() => opendeleteModal(salary.salary_id)}></i></td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No salary details available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>


            </div>

            {/* Modal for Add/Edit Machine */}
            <div
                className="modal fade"
                id="machineModal"
                tabIndex="-1"
                aria-labelledby="machineModalLabel"
                aria-hidden="true"
                ref={modalRef}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="machineModalLabel">
                                {formData.machine_id ? 'Edit Machine' : 'Add Machine'}
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

                                <select
                                    name="person_id"
                                    value={formData.person_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select person</option>
                                    {PersonsData.map((x) => (
                                        <option key={x.person_id} value={x.person_id}>
                                            {x.person_name}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="text"
                                    name="salary_amount"
                                    value={formData.salary_amount}
                                    onChange={handleChange}
                                    placeholder="Salary Amount"
                                />
                                <input
                                    type="text"
                                    name="salary_working_days"
                                    value={formData.salary_working_days}
                                    onChange={handleChange}
                                    placeholder="Working Days"
                                />
                                <input
                                    type="date"
                                    name="salary_date"
                                    value={formData.salary_date}
                                    onChange={handleChange}
                                />
                                <textarea
                                    name="salary_details"
                                    value={formData.salary_details}
                                    onChange={handleChange}
                                    placeholder="Details (optional)"
                                />
                                <button type="submit">Submit</button>
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
                                Delete Salary Data
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

export default Machines;