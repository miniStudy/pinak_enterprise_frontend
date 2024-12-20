import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';


function Machine_insert({ fetchdata, persontype }) {
    const modalRef = useRef();
    const [machineTypes, setmachineTypes] = useState([]);
    const [formData, setFormData] = useState({
        machine_id: '',
        machine_name: '',
        machine_number_plate: '',
        machine_register_date: '',
        machine_own: '',
        machine_condition: '',
        machine_working: true,
        machine_types_id: '',
        machine_details: '',
        machine_owner_name: '',
        machine_owner_contact: '',
        machine_buy_price: '',
        machine_buy_date: '',
        machine_sold_price: '',
        machine_sold_out_date: '',
        machine_other_details: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    // Fetch person types from API
    const fetchMachineTypes = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/show_machine_types/");
            setmachineTypes(response.data.data || []);
        } catch (err) {
            //   setError("Failed to load person types data");
        }
    };

    useEffect(() => {
        fetchMachineTypes();
    }, []);


    // Handle form submission for Add/Update
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/insert_update_machine/',
                formData
            );
            if (response.status === 200) {
                fetchdata();
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

    const resetForm = () => {
        setFormData({
            machine_id: '',
            machine_name: '',
            machine_number_plate: '',
            machine_register_date: '',
            machine_own: '',
            machine_condition: '',
            machine_working: true,
            machine_types_id: '',
            machine_details: '',
            machine_owner_name: '',
            machine_owner_contact: '',
            machine_buy_price: '',
            machine_buy_date: '',
            machine_sold_price: '',
            machine_sold_out_date: '',
            machine_other_details: '',
        });
    };


    return (
        <>
            <button
                type="button"
                className="btn btn-sm btn-primary ms-3"
                onClick={openModal}
            >
                Add Machine
            </button>
            {/* Modal for Add/Edit Person */}
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
                                <div className='mb-3'>
                                    <input
                                        type="text"
                                        name="machine_name"
                                        value={formData.machine_name}
                                        onChange={handleChange}
                                        placeholder='Machine Name*'
                                        className='form-control'
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

                                {persontype === 'employee' && (

                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            name="person_salary"
                                            value={formData.person_salary}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="Person Salary"
                                        />
                                    </div>
                                )}



                                <div className="mb-3 d-none">
                                    <textarea
                                        name="person_address"
                                        value={formData.person_address}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Person Address"
                                    ></textarea>
                                </div>

                                <div className="mb-3 d-none">
                                    <input
                                        type="text"
                                        name="person_business_job_name"
                                        value={formData.person_business_job_name}
                                        onChange={handleChange}
                                        placeholder="Job/Business Name"
                                        className="form-control"
                                    />
                                </div>

                                <div className="mb-3 d-none">
                                    <input
                                        type="text"
                                        name="person_business_job_company_num"
                                        value={formData.person_business_job_company_num}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Business/Job Number"
                                    />
                                </div>

                                <div className="mb-3 d-none">
                                    <textarea
                                        name="person_business_job_address"
                                        value={formData.person_business_job_address}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Business/Job Address"

                                    ></textarea>
                                </div>

                                <div className="mb-3 d-none">
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

                                <div className="mb-3 d-none">
                                    <select
                                        name="person_types_for_project"
                                        value={formData.person_types_for_project}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="">Select Person Type For Project*</option>
                                        <option value="Worker">Worker</option>
                                        <option value="Project">Project</option>
                                        <option value="Material">Material</option>
                                        <option value="Machine">Machine</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="mb-3 d-none">
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


                                <div className="mb-3 d-none">
                                    <textarea
                                        name="person_other_details"
                                        value={formData.person_other_details}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Addtional details..."
                                    ></textarea>
                                </div>
                                <button type="submit" className="mt-3 btn btn-sm btn-primary">
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

export default Machine_insert