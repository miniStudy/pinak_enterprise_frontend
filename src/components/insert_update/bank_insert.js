import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';


function Bank_insert({ fetchdata }) {
    const modalRef = useRef();
    const [personsData, setpersonsData] = useState([]);
    const [formData, setFormData] = useState({
        bank_id: "",
        bank_name: "",
        bank_branch: "",
        bank_account_number: "",
        bank_ifsc_code: "",
        bank_account_holder: "",
        bank_initial_amount: "",
        bank_open_closed: true,
        person_id: "",
        company_bank_account: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    // Fetch person types from API
    const fetchPersonTypes = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/show_persons/");
            setpersonsData(response.data.data || []);
        } catch (err) {
            //   setError("Failed to load person types data");
        }
    };

    useEffect(() => {
        fetchPersonTypes();
    }, []);


    // Handle form submission for Add/Update
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/insert_update_bank_detail/',
                formData
            );
            if (response.status === 200) {
                fetchdata(); // Reload data
                resetForm();
                closeModal();
            } else {
                alert('Failed to save bank details.');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Error occurred while saving bank details.');
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

    const resetForm = () => {
        setFormData({
            bank_id: "",
            bank_name: "",
            bank_branch: "",
            bank_account_number: "",
            bank_ifsc_code: "",
            bank_account_holder: "",
            bank_initial_amount: "",
            bank_open_closed: true,
            person_id: "",
            company_bank_account: false,
        });
    };


    return (
        <>
            <button
                type="button"
                className="btn btn-sm btn-primary ms-3"
                onClick={openModal}
            >
                Add Bank
            </button>
            {/* Modal for Add/Edit Person */}
            <div
                className="modal fade"
                id="bankModal"
                tabIndex="-1"
                aria-labelledby="bankModalLabel"
                aria-hidden="true"
                ref={modalRef}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="bankModalLabel">
                                {formData.bank_id ? 'Edit Bank' : 'Add Bank'}
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
                                <div className="mb-3">
                                    <label className="form-label">Bank Name:</label>
                                    <input
                                        type="text"
                                        name="bank_name"
                                        value={formData.bank_name}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Branch:</label>
                                    <input
                                        type="text"
                                        name="bank_branch"
                                        value={formData.bank_branch}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Account Number:</label>
                                    <input
                                        type="text"
                                        name="bank_account_number"
                                        value={formData.bank_account_number}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">IFSC Code:</label>
                                    <input
                                        type="text"
                                        name="bank_ifsc_code"
                                        value={formData.bank_ifsc_code}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>

                                {/* <div className="mb-3">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            onChange={(e) =>
                                                handleChange({
                                                    target: { name: "bank_open_closed", value: e.target.checked },
                                                })
                                            }
                                            checked={formData.material_status}
                                            name="bank_open_closed"
                                            type="checkbox"
                                            id="flexCheckChecked"
                                        />
                                        <label className="form-check-label" htmlFor="flexCheckChecked">
                                            Account is Running
                                        </label>
                                    </div>
                                </div> */}

                                <div className="mb-3">
                                    <label className="form-label">Person</label>
                                    <select
                                        className="form-select"
                                        name="person_id"
                                        value={formData.person_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Person</option>
                                        {personsData.map((type) => (
                                            <option
                                                key={type.person_id}
                                                value={type.person_id}
                                            >
                                                {type.person_name}
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
    )
}

export default Bank_insert