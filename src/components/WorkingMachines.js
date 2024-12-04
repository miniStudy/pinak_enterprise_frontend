import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';  // Import axios
import { Modal } from 'bootstrap';


const WorkingMachines = () => {
    const [workingmachinesDetails, setWorkingMachinesDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const [machine_types, setmachine_types] = useState([]);
    const [ownership_choices, setownership_choices] = useState([]);
    const modalRef = useRef();

    const [formData, setFormData] = useState({
        working_machine_id: '',
        working_machine_name: '',
        working_machine_owner_name: '',
        working_machine_owner_contact: '',
        working_machine_plate_number: '',
        working_machine_start_date: '',
        working_machine_end_date: '',
        working_machine_ownership: '',
        working_machine_details: '',
        working_machine_rented_amount: '',
        machine_type_id: '',
    });

    // Fetch machine details
    const fetchMachines = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/show_working_machines/');
            console.log(response.data)
            setWorkingMachinesDetails(response.data.data || []);
            setmachine_types(response.data.machine_types_data || []);
            setownership_choices(response.data.ownership_choices || []);
            setTitle(response.data.title);


            setLoading(false);
        } catch (err) {
            console.log(err)
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
                'http://127.0.0.1:8000/insert_update_working_machine/',
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

    // Fetch data for editing a specific machine
    const editDetailsGetData = async (id) => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/insert_update_working_machine/?getdata_id=${id}`
            );
            setFormData(response.data.data);
            setmachine_types(response.data.machine_types_data || []);
            openModal()
        } catch (err) {
            setError('Failed to load machine details');
        }
    };

    // Reset the form state
    const resetForm = () => {
        setFormData({
            working_machine_id: '',
            working_machine_name: '',
            working_machine_owner_name: '',
            working_machine_owner_contact: '',
            working_machine_plate_number: '',
            working_machine_start_date: '',
            working_machine_end_date: '',
            working_machine_ownership: '',
            working_machine_details: '',
            working_machine_rented_amount: '',
            machine_type_id: '',
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
                <h1>{title}</h1> {/* Use the 'title' state here */}
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={openModal}
                >
                    Add Working Machine
                </button>
                <table>
                    <thead>
                        <tr>
                            <th>Machine ID</th>
                            <th>Machine Name</th>
                            <th>Owner's Name</th>
                            <th>Plate Number</th>
                            <th>Machine Type</th>
                            <th>Ownership</th>
                            <th>Owner Contact</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Rented Amount</th>                           
                            <th>Details</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workingmachinesDetails.length > 0 ? (
                            workingmachinesDetails.map((x) => (
                                <tr key={x.working_machine_id}>
                                    <td>{x.working_machine_id || "N/A"}</td>
                                    <td>{x.working_machine_name || "N/A"}</td>
                                    <td>{x.working_machine_owner_name || "N/A"}</td>
                                    <td>{x.working_machine_plate_number || "N/A"}</td>
                                    <td>{x.machine_type_id__machine_type_name || "N/A"}</td>
                                    <td>{x.working_machine_ownership || "N/A"}</td>
                                    <td>{x.working_machine_owner_contact || "N/A"}</td>
                                    <td>{x.working_machine_start_date || "N/A"}</td>
                                    <td>{x.working_machine_end_date || "N/A"}</td>
                                    <td>{x.working_machine_rented_amount || "N/A"}</td>
                                    <td>{x.working_machine_details || "N/A"}</td>
                                    <td>
                                        <i
                                            className="fa-regular fa-pen-to-square"
                                            onClick={() => editDetailsGetData(x.working_machine_id)}
                                        ></i>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="11">No working machine details available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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
                                {formData.working_machine_id ? 'Edit Machine' : 'Add Machine'}
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
                                    <label>Machine Name:</label>
                                    <input
                                        type="text"
                                        name="working_machine_name"
                                        value={formData.working_machine_name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label>Owner's Name:</label>
                                    <input
                                        type="text"
                                        name="working_machine_owner_name"
                                        value={formData.working_machine_owner_name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label>Contact Number:</label>
                                    <input
                                        type="text"
                                        name="working_machine_owner_contact"
                                        value={formData.working_machine_owner_contact}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label>Plate Number</label>
                                    <input
                                        type="text"
                                        name="working_machine_plate_number"
                                        value={formData.working_machine_plate_number}
                                        onChange={handleChange}
                                    />
                                </div>



                                <div>
                                    <label>Start Date:</label>
                                    <input
                                        type="date"
                                        name="working_machine_start_date"
                                        value={formData.working_machine_start_date}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label>End Date:</label>
                                    <input
                                        type="date"
                                        name="working_machine_end_date"
                                        value={formData.working_machine_end_date}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label>Ownership</label>
                                    <select name="working_machine_ownership" onChange={handleChange} required>
                                        <option value="">Select ownership</option>
                                        {ownership_choices.length > 0 ? (
                                            ownership_choices.map((x) => (
                                                <option value={x} selected={formData.working_machine_ownership === x}>{x}</option>
                                            ))
                                        ) : (
                                            <option>Data not available</option>
                                        )}
                                    </select>
                                </div>


                                <div>
                                    <label>Machine Details:</label>
                                    <textarea
                                        name="working_machine_details"
                                        value={formData.working_machine_details}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>


                                <div>
                                    <label>Rented Amount</label>
                                    <input
                                        type="text"
                                        name="working_machine_rented_amount"
                                        value={formData.working_machine_rented_amount}
                                        onChange={handleChange}
                                    />
                                </div>
                               
                                <div>
                                    <label>Machine Type ID:</label>
                                    <select name="machine_type_id" onChange={handleChange} required>
                                    <option value="">Select machine types</option>
                                        {machine_types.length > 0 ? (
                                            machine_types.map((x) => (
                                                <option value={x.machine_type_id} selected={formData.machine_type_id === x.machine_type_id}>{x.machine_type_name}</option>
                                            ))
                                        ) : (
                                            <option>Data not available</option>
                                        )}
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
export default WorkingMachines;
