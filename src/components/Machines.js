import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';

const Machines = () => {
    const [machinesDetails, setMachinesDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const modalRef = useRef();

    // Form state for Add/Edit
    const [formData, setFormData] = useState({
        machine_id: '',
        machine_owner: '',
        machine_buy_date: '',
        machine_condition: '',
        machine_number_plate: '',
        machine_contact_number: '',
        machine_sold_out_date: '',
        machine_sold_price: '',
        machine_working: false,
        machine_types_id: '',
        machine_details: '',
    });

    // Fetch machine details
    const fetchMachines = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/show_company_machines/');
            setMachinesDetails(response.data.data || []);
            setTitle(response.data.title);
            setLoading(false);
        } catch (err) {
            setError('Failed to load machine details');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMachines();
    }, []);

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
                'http://127.0.0.1:8000/insert_update_company_machine/',
                formData
            );
            if (response.status === 200) {
                alert('Machine details saved successfully!');
                fetchMachines(); // Reload data
                resetForm();
                closeModal();
            } else {
                alert('Failed to save machine details.');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Error occurred while saving machine details.');
        }
    };

    // Fetch data for editing a specific machine
    const editDetailsGetData = async (id) => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/insert_update_company_machine/?getdata_id=${id}`
            );
            setFormData(response.data.data);
        } catch (err) {
            setError('Failed to load machine details');
        }
    };

    // Reset the form state
    const resetForm = () => {
        setFormData({
            machine_id: '',
            machine_owner: '',
            machine_buy_date: '',
            machine_condition: '',
            machine_number_plate: '',
            machine_contact_number: '',
            machine_sold_out_date: '',
            machine_sold_price: '',
            machine_working: false,
            machine_types_id: '',
            machine_details: '',
        });
    };

    // Close the modal
    const closeModal = () => {
        const modalInstance = Modal.getInstance(modalRef.current);
        if (modalInstance) {
            modalInstance.hide();
        }
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
                <h1>{title}</h1>
                <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#machineModal"
                    onClick={resetForm}
                >
                    Add Machine
                </button>

                <table>
                    <thead>
                        <tr>
                            <th>Machine ID</th>
                            <th>Owner's Name</th>
                            <th>Purchase Date</th>
                            <th>Machine Condition</th>
                            <th>Number Plate</th>
                            <th>Contact Number</th>
                            <th>Sold Out Date</th>
                            <th>Sold Amount</th>
                            <th>Machine Working</th>
                            <th>Machine Type Name</th>
                            <th>Machine Details</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {machinesDetails.length > 0 ? (
                            machinesDetails.map((y) => (
                                <tr key={y.machine_id}>
                                    <td>{y.machine_id || "N/A"}</td>
                                    <td>{y.machine_owner || "N/A"}</td>
                                    <td>{y.machine_buy_date || "N/A"}</td>
                                    <td>{y.machine_condition || "N/A"}</td>
                                    <td>{y.machine_number_plate || "N/A"}</td>
                                    <td>{y.machine_contact_number || "N/A"}</td>
                                    <td>{y.machine_sold_out_date || "N/A"}</td>
                                    <td>{y.machine_sold_price || "N/A"}</td>
                                    <td>{y.machine_working ? "Yes" : "No"}</td>
                                    <td>{y.machine_types_id__machine_type_name || "N/A"}</td>
                                    <td>{y.machine_details || "N/A"}</td>
                                    <td>
                                        <i
                                            className="fa-regular fa-pen-to-square"
                                            data-bs-toggle="modal"
                                            data-bs-target="#machineModal"
                                            onClick={() => editDetailsGetData(y.machine_id)}
                                        ></i>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="12">No machine details available.</td>
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
                                <div>
                                    <label>Owner's Name:</label>
                                    <input
                                        type="text"
                                        name="machine_owner"
                                        value={formData.machine_owner}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label>Purchase Date:</label>
                                    <input
                                        type="date"
                                        name="machine_buy_date"
                                        value={formData.machine_buy_date}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label>Condition:</label>
                                    <select name="machine_condition" onChange={handleChange}>
                                        <option value="New">New</option>
                                        <option value="Second_hand">Second_hand</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Number Plate:</label>
                                    <input
                                        type="text"
                                        name="machine_number_plate"
                                        value={formData.machine_number_plate}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label>Contact Number:</label>
                                    <input
                                        type="text"
                                        name="machine_contact_number"
                                        value={formData.machine_contact_number}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label>Sold Out Date:</label>
                                    <input
                                        type="date"
                                        name="machine_sold_out_date"
                                        value={formData.machine_sold_out_date}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label>Sold Price:</label>
                                    <input
                                        type="number"
                                        name="machine_sold_price"
                                        value={formData.machine_sold_price}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label>Working:</label>
                                    <input
                                        type="checkbox"
                                        name="machine_working"
                                        checked={formData.machine_working}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label>Machine Type ID:</label>
                                    <input
                                        type="text"
                                        name="machine_types_id"
                                        value={formData.machine_types_id}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label>Machine Details:</label>
                                    <textarea
                                        name="machine_details"
                                        value={formData.machine_details}
                                        onChange={handleChange}
                                    ></textarea>
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

export default Machines;