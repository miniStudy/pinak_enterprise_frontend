import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from 'bootstrap';

const ProjectPersons = () => {
    const [ProjectPersonData, setProjectPersonData] = useState([]);
    const [PersonData, setPersonData] = useState([]);
    const [WorkTypeData, setWorkTypeData] = useState([]);
    const [ProjectMachineData, setProjectMachineData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState("");
    const modalRef = useRef();
    const deletemodel = useRef();
    const [delid, setdelid] = useState("");
    const [Messages, setMessages] = useState('');

    const [formData, setFormData] = useState({
        project_person_id: "",
        person_id: "",
        project_person_date: "",
        work_type_id: "",
        project_machine_data_id: "",
        project_person_work_num: "",
        project_person_price: "",
        project_person_total_price: "",
        project_person_paid_by: "",
        project_person_payment_details: "",
        project_person_more_details: "",


    });


    const fetchProjectPersons = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/show_project_person/');
            setProjectPersonData(response.data.data || []);
            setPersonData(response.data.persons_data || []);
            setWorkTypeData(response.data.work_types_data || []);
            setProjectMachineData(response.data.project_machine_data || []);
            setTitle(response.data.title)
            setLoading(false);
        } catch (err) {
            setError('Failed to load project person details');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectPersons();
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
                'http://127.0.0.1:8000/insert_update_project_person/',
                formData
            );
            if (response.status === 200) {
                alert(response.data.message);
                fetchProjectPersons();
                resetForm();
                closeModal();
            } else {
                alert('Failed to save project person data.');
            }
        } catch (err) {
            alert('Error occurred while saving project person data.');
        }
    };

    const editProjectPerson = async (id) => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/insert_update_project_person/?getdata_id=${id}`
            );
            setFormData(response.data.data);
            setPersonData(response.data.persons_data || []);
            setWorkTypeData(response.data.work_types_data || []);
            setProjectMachineData(response.data.project_machine_data || []);
            openModal();
        } catch (err) {
            alert('Failed to load project person data');
        }
    };

    const resetForm = () => {
        setFormData({
            project_person_id: "",
            person_id: "",
            project_person_date: "",
            work_type_id: "",
            project_machine_data_id: "",
            project_person_work_num: "",
            project_person_price: "",
            project_person_total_price: "",
            project_person_paid_by: "",
            project_person_payment_details: "",
            project_person_more_details: "",
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
                `http://127.0.0.1:8000/delete_project_machine/?project_person_id=${id}`
            );
            setMessages(response.data.message)
            fetchProjectPersons();
            closedeleteModal();
        } catch (err) {
            setError("Failed to delete project person data")
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
                    Add Project Person Data
                </button>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>S.N</th>
                                <th>Date</th>
                                <th>Person</th>
                                <th>Machine Name</th>
                                <th>Work Type</th>
                                <th>Work Number</th>
                                <th>Work Price</th>
                                <th>Total Price</th>
                                <th>Paid By</th>
                                <th>Payment Details</th>
                                <th>More Details</th>
                                <th>Update</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ProjectPersonData.length > 0 ? (
                                ProjectPersonData.map((detail, index) => (
                                    <tr key={detail.project_person_id}>
                                        <td>{index + 1 || "N/A"}</td>
                                        <td>{detail.project_person_date || "N/A"}</td>
                                        <td>
                                            {detail.person_id__person_name || "N/A"}
                                        </td>
                                        <td>
                                            {detail.project_machine_data_id__machine_project_id__machine_name || "N/A"}
                                        </td>
                                        <td>
                                            {detail.work_type_id__work_type_name || "N/A"}
                                        </td>
                                        <td>{detail.project_person_work_num || "N/A"}</td>
                                        <td>{detail.project_person_price || "N/A"}</td>
                                        <td>{detail.project_person_total_price || "N/A"}</td>
                                        <td>{detail.project_person_paid_by || "N/A"}</td>
                                        <td>{detail.project_person_payment_details || "N/A"}</td>
                                        <td>{detail.project_person_more_details || "N/A"}</td>
                                        <td>
                                            <i
                                                className="fa-regular fa-pen-to-square"
                                                onClick={() => editProjectPerson(detail.project_person_id)}
                                            ></i>
                                        </td>
                                        <td>
                                            <i
                                                className="fa-regular fa-trash-can"
                                                onClick={() => openDeleteModal(detail.project_person_id)}
                                            ></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="13" style={{ textAlign: "center" }}>
                                        No project person data available.
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
                                {formData.project_person_id ? 'Edit Project-Person' : 'Add Project-Person'}
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
                                        name="project_person_date"
                                        value={formData.project_person_date}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <select
                                        name="person_id"
                                        value={formData.person_id}
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Select Person*</option>
                                        {PersonData.map((type) => (
                                            <option
                                                key={type.person_id}
                                                value={type.person_id}
                                            >
                                                {type.person_name}
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
                                    <select
                                        name="project_machine_data_id"
                                        value={formData.project_machine_data_id}
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Select Project Machine*</option>
                                        {ProjectMachineData.map((type) => (
                                            <option
                                                key={type.project_machine_data_id}
                                                value={type.project_machine_data_id}
                                            >
                                                {type.machine_project_id__machine_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <input
                                        id="workNoInput"
                                        type="text"
                                        name="project_person_work_num"
                                        value={formData.project_person_work_num}
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
                                        name="project_person_price"
                                        value={formData.project_person_price}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter Price*"
                                        required
                                    />
                                </div>


                                {/* Details Textarea */}
                                <div className="mb-3">
                                    <label htmlFor="detailsTextarea" className="form-label">Work Details</label>
                                    <textarea
                                        id="detailsTextarea"
                                        name="project_person_payment_details"
                                        value={formData.project_person_payment_details}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter payment details (optional)"
                                    ></textarea>
                                </div>

                                <div className="mb-3">
                                <select
                                    name="project_person_paid_by"
                                    value={formData.project_person_paid_by}
                                    onChange={handleChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="">Select Person Paid By*</option>
                                    <option value="Project_Owner">Project_Owner</option>
                                    <option value="Pinak">Pinak</option>
                                    <option value="Office">Office</option>
                                </select>
                            </div>

                                {/* Details Textarea */}
                                <div className="mb-3">
                                    <label htmlFor="detailsTextarea" className="form-label">More Details</label>
                                    <textarea
                                        id="detailsTextarea"
                                        name="project_person_more_details"
                                        value={formData.project_person_more_details}
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

export default ProjectPersons;
