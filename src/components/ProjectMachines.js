import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from 'bootstrap';

const ProjectMachines = () => {
    const [ProjectMachineData, setProjectMachineData] = useState([]);
    const [MachineData, setMachineData] = useState([]);
    const [WorkTypeData, setWorkTypeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState("");
    const modalRef = useRef();
    const deletemodel = useRef();
    const [delid, setdelid] = useState("");
    const [Messages, setMessages] = useState('');

    const [formData, setFormData] = useState({
        project_machine_data_id: "",
        project_machine_date: "",
        machine_project_id: "",
        work_type_id: "",
        project_machine_data_work_number: "",
        project_machine_data_work_price: "",
        project_machine_data_total_amount: "",
        project_machine_data_work_details: "",
        project_machine_data_more_details: "",


    });


    const fetchProjectMachines = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/show_project_machine/');
            setProjectMachineData(response.data.data || []);
            setMachineData(response.data.machines_data || []);
            setWorkTypeData(response.data.work_types_data || []);
            setTitle(response.data.title)
            setLoading(false);
        } catch (err) {
            setError('Failed to load project machine details');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectMachines();
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/insert_update_project_machine/',
                formData
            );
            if (response.status === 200) {
                alert(response.data.message);
                fetchProjectMachines();
                resetForm();
                closeModal();
            } else {
                alert('Failed to save project machine data.');
            }
        } catch (err) {
            alert('Error occurred while saving project machine data.');
        }
    };

    const editProjectMachine = async (id) => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/insert_update_project_machine/?getdata_id=${id}`
            );
            setFormData(response.data.data);
            setMachineData(response.data.machines_data || []);
            setWorkTypeData(response.data.work_types_data || []);
            openModal();
        } catch (err) {
            alert('Failed to load project machine data');
        }
    };

    const resetForm = () => {
        setFormData({
            project_machine_data_id: "",
            project_machine_date: "",
            machine_project_id: "",
            work_type_id: "",
            project_machine_data_work_number: "",
            project_machine_data_work_price: "",
            project_machine_data_total_amount: "",
            project_machine_data_work_details: "",
            project_machine_data_more_details: "",
        });
    };

    const openModal = () => {
        const modalInstance = new Modal(modalRef.current);
        modalInstance.show();
    };

    const closeModal = () => {
        const modalInstance = Modal.getInstance(modalRef.current);
        if (modalInstance) {
            modalInstance.hide();
        }
    };

    const closedeleteModal = () => {
        const modalInstance = Modal.getInstance(deletemodel.current);
        if (modalInstance) {
            modalInstance.hide();
        }
    };

    const openDeleteModal = (id) => {
        const modalInstance = new Modal(deletemodel.current);
        setdelid(id);
        modalInstance.show();

    };

    const deleteData = async (id) => {
        try {
            const response = await axios.delete(
                `http://127.0.0.1:8000/delete_project_machine/?project_machine_data_id=${id}`
            );
            setMessages(response.data.message)
            fetchProjectMachines();
            closedeleteModal();
        } catch (err) {
            setError("Failed to delete project machine data")
        }
    }

    // Show loading message while data is being fetched
    if (loading) {
        return <div>Loading...</div>;
    }

    // Show error message if fetching data failed
    if (error) {
        return <div>{error}</div>;
    }

    // Render the materials table
    return (
        <>
            <div>
                {Messages && <div class="alert alert-success alert-dismissible fade show" role="alert">{Messages}</div>}
                <h3>{title}</h3>
                <button
                    type="button"
                    className="btn btn-sm mb-3 btn-primary"
                    onClick={openModal}
                >
                    Add Project Machine Data
                </button>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>S.N</th>
                                <th>Date</th>
                                <th>Machine Name</th>
                                <th>Work Type</th>
                                <th>Work Number</th>
                                <th>Work Price</th>
                                <th>Total Amount</th>
                                <th>Work Details</th>
                                <th>More Details</th>
                                <th>Update</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ProjectMachineData.length > 0 ? (
                                ProjectMachineData.map((detail, index) => (
                                    <tr key={detail.project_machine_data_id}>
                                        <td>{index + 1 || "N/A"}</td>
                                        <td>{detail.project_machine_date || "N/A"}</td>
                                        <td>
                                            {detail.machine_project_id__machine_name || "N/A"}
                                        </td>
                                        <td>
                                            {detail.MachineDatawork_type_id__work_type_name || "N/A"}
                                        </td>
                                        <td>{detail.project_machine_data_work_number || "N/A"}</td>
                                        <td>{detail.project_machine_data_work_price || "N/A"}</td>
                                        <td>{detail.project_machine_data_total_amount || "N/A"}</td>
                                        <td>{detail.project_machine_data_work_details || "N/A"}</td>
                                        <td>{detail.project_machine_data_more_details || "N/A"}</td>
                                        <td>
                                            <i
                                                className="fa-regular fa-pen-to-square"
                                                onClick={() => editProjectMachine(detail.project_machine_data_id)}
                                            ></i>
                                        </td>
                                        <td>
                                            <i
                                                className="fa-regular fa-trash-can"
                                                onClick={() => openDeleteModal(detail.project_machine_data_id)}
                                            ></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" style={{ textAlign: "center" }}>
                                        No project machine data available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>



                </div>
            </div>
            <div
                className="modal fade"
                id="materialModal"
                tabIndex="-1"
                ref={modalRef}
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {formData.project_machine_data_id ? 'Edit Project-Machine' : 'Add Project-Machine'}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={closeModal}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="workNoInput" className="form-label">Enter Date here*</label>
                                    <input
                                        type="date"
                                        name="project_machine_date"
                                        value={formData.project_machine_date}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <select
                                        name="machine_project_id"
                                        value={formData.machine_project_id}
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Select Machine*</option>
                                        {MachineData.map((type) => (
                                            <option
                                                key={type.machine_id}
                                                value={type.machine_id}
                                            >
                                                {type.machine_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <select
                                        name="work_type_id"
                                        value={formData.work_type_id}
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Select Work Type*</option>
                                        {WorkTypeData.map((type) => (
                                            <option
                                                key={type.work_type_id}
                                                value={type.work_type_id}
                                            >
                                                {type.work_type_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <input
                                        id="workNoInput"
                                        type="text"
                                        name="project_material_work_no"
                                        value={formData.project_material_work_no}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter Work Number*"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <input
                                        id="priceInput"
                                        type="text"
                                        name="project_machine_data_work_number"
                                        value={formData.project_machine_data_work_number}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter Work Number*"
                                        required
                                    />
                                </div>

                                {/* Price Field */}
                                <div className="mb-3">
                                    <input
                                        id="priceInput"
                                        type="text"
                                        name="project_machine_data_work_price"
                                        value={formData.project_machine_data_work_price}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter Price*"
                                        required
                                    />
                                </div>

                                {/* Total Price Field */}
                                <div className="mb-3">
                                    <input
                                        id="totalPriceInput"
                                        type="text"
                                        name="project_machine_data_total_amount"
                                        value={formData.project_machine_data_total_amount}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter Total Price*"
                                        required
                                    />
                                </div>


                                {/* Details Textarea */}
                                <div className="mb-3">
                                    <label htmlFor="detailsTextarea" className="form-label">Work Details</label>
                                    <textarea
                                        id="detailsTextarea"
                                        name="project_machine_data_work_details"
                                        value={formData.project_machine_data_work_details}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter additional details (optional)"
                                    ></textarea>
                                </div>

                                {/* Details Textarea */}
                                <div className="mb-3">
                                    <label htmlFor="detailsTextarea" className="form-label">More Details</label>
                                    <textarea
                                        id="detailsTextarea"
                                        name="project_machine_data_more_details"
                                        value={formData.project_machine_data_more_details}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter more details (optional)"
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">
                                        Submit
                                    </button>
                                </div>

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
                                Delete Material Data
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

export default ProjectMachines;
