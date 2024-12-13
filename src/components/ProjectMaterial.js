import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from 'bootstrap';

const ProjectMaterial = ({project_id}) => {
    const [ProjectMaterialData, setProjectMaterialData] = useState([]);
    const [MaterialData, setMaterialData] = useState([]);
    const [MaterialTypeData, setMaterialTypeData] = useState([]);
    const [WorkTypeData, setWorkTypeData] = useState([]);
    const [PersonData, setPersonData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState("");
    const modalRef = useRef();
    const deletemodel = useRef();
    const [delid, setdelid] = useState("");
    const [Messages, setMessages] = useState('');

    const [formData, setFormData] = useState({
        project_material_id: "",
        project_material_date: "",
        project_material_material_id: "",
        project_material_material_type_id: "",
        project_material_work_type_id: "",
        project_material_work_no: "",
        project_material_price: "",
        project_material_total_amount: "",
        project_material_agent: true,
        project_material_agent_id: "",
        person_material_agent_amount: "",
        person_material_information: "",
        project_id: project_id

    });

    const fetchProjectMaterials = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/show_project_material/?project_id=${project_id}`);
            setProjectMaterialData(response.data.data || []);
            setMaterialData(response.data.materials_data || []);
            setMaterialTypeData(response.data.material_types_data || []);
            setWorkTypeData(response.data.work_types_data || []);
            setPersonData(response.data.persons_data || []);
            setTitle(response.data.title)
            setLoading(false);
        } catch (err) {
            setError('Failed to load project material details');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectMaterials();
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
                'http://127.0.0.1:8000/insert_update_project_material/',
                formData
            );
            if (response.status === 200) {
                alert(response.data.message);
                fetchProjectMaterials();
                resetForm();
                closeModal();
            } else {
                alert('Failed to save project material data.');
            }
        } catch (err) {
            alert('Error occurred while saving project material data.');
        }
    };

    const editProjectMaterial = async (id) => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/insert_update_project_material/?getdata_id=${id}`
            );
            setFormData(response.data.data);
            setMaterialData(response.data.materials_data || []);
            setMaterialTypeData(response.data.material_types_data || []);
            setWorkTypeData(response.data.work_types_data || []);
            setPersonData(response.data.persons_data || []);
            openModal();
        } catch (err) {
            alert('Failed to load project material data');
        }
    };

    const resetForm = () => {
        setFormData({
            project_material_id: "",
            project_material_date: "",
            project_material_material_id: "",
            project_material_material_type_id: "",
            project_material_work_type_id: "",
            project_material_work_no: "",
            project_material_price: "",
            project_material_total_amount: "",
            project_material_agent: true,
            project_material_agent_id: "",
            person_material_agent_amount: "",
            person_material_information: "",
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

    const opendeleteModal = (id) => {
        const modalInstance = new Modal(deletemodel.current);
        setdelid(id);
        modalInstance.show();

    };

    const deleteData = async (id) => {
        try {
            const response = await axios.delete(
                `http://127.0.0.1:8000/delete_project_material/?project_material_id=${id}`
            );
            setMessages(response.data.message)
            fetchProjectMaterials();
            closedeleteModal();
        } catch (err) {
            setError("Failed to delete project material data")
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
                    Add Project Material Data
                </button>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>S.N</th>
                                <th>Date</th>
                                <th>Material Name</th>
                                <th>Material Type</th>
                                <th>Work Type</th>
                                <th>Work No</th>
                                <th>Price</th>
                                <th>Total Amount</th>
                                <th>Agent Status</th>
                                <th>Agent Name</th>
                                <th>Agent Amount</th>
                                <th>Details</th>
                                <th>Update</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ProjectMaterialData.length > 0 ? (
                                ProjectMaterialData.map((detail, index) => (
                                    <tr key={detail.project_material_id}>
                                        <td>{index + 1 || "N/A"}</td>
                                        <td>{detail.project_material_date || "N/A"}</td>
                                        <td>{detail.project_material_material_id__material_person_id__person_name || "N/A"}</td>
                                        <td>{detail.project_material_material_type_id__material_type_name || "N/A"}</td>
                                        <td>{detail.project_material_work_type_id__work_type_name || "N/A"}</td>
                                        <td>{detail.project_material_work_no || "N/A"}</td>
                                        <td>{detail.project_material_price || "N/A"}</td>
                                        <td>{detail.project_material_total_amount || "N/A"}</td>
                                        <td>{detail.project_material_agent ? 'Active' : 'Inactive'}</td>
                                        <td>{detail.project_material_agent_id__person_name || "N/A"}</td>
                                        <td>{detail.person_material_agent_amount || "N/A"}</td>
                                        <td>{detail.person_material_information || "N/A"}</td>
                                        <td>
                                            <i
                                                className="fa-regular fa-pen-to-square"
                                                onClick={() => editProjectMaterial(detail.project_material_id)}
                                            ></i>
                                        </td>
                                        <td>
                                            <i
                                                className="fa-regular fa-trash-can"
                                                onClick={() => opendeleteModal(detail.project_material_id)}
                                            ></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="13" style={{ textAlign: "center" }}>
                                        No project material data available.
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
                                {formData.project_material_id ? 'Edit Project-Material' : 'Add Project-Material'}
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
                                        name="project_material_date"
                                        value={formData.project_material_date}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <select
                                        name="project_material_material_id"
                                        value={formData.project_material_material_id}
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Select Material Person*</option>
                                        {MaterialData.map((type) => (
                                            <option
                                                key={type.material_id}
                                                value={type.material_id}
                                            >
                                                {type.material_person_id__person_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <select
                                        name="project_material_material_type_id"
                                        value={formData.project_material_material_type_id}
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Select Material Type*</option>
                                        {MaterialTypeData.map((type) => (
                                            <option
                                                key={type.material_type_id}
                                                value={type.material_type_id}
                                            >
                                                {type.material_type_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <select
                                        name="project_material_work_type_id"
                                        value={formData.project_material_work_type_id}
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

                                {/* Price Field */}
                                <div className="mb-3">
                                    <input
                                        id="priceInput"
                                        type="text"
                                        name="project_material_price"
                                        value={formData.project_material_price}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter Price*"
                                        required
                                    />
                                </div>

                               
                                <div className="mb-3">
                                <div className="form-check">
                                <input
                                    className="form-check-input"
                                    onChange={(e) =>
                                    handleChange({
                                        target: { name: "project_material_agent", value: e.target.checked },
                                    })
                                    }
                                    checked={formData.project_material_agent}
                                    name="project_material_agent"
                                    type="checkbox"
                                    id="flexCheckChecked"
                                />
                                <label className="form-check-label" htmlFor="flexCheckChecked">
                                    Active
                                </label>
                                </div>
                            </div>

                            <div className="mb-3">
                                    <select
                                        name="project_material_agent_id"
                                        value={formData.project_material_agent_id}
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Select Agent*</option>
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
                                    <input
                                        id="totalPriceInput"
                                        type="text"
                                        name="person_material_agent_amount"
                                        value={formData.person_material_agent_amount}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter Agent Amount"
                                    />
                                </div>


                                {/* Details Textarea */}
                                <div className="mb-3">
                                    <label htmlFor="detailsTextarea" className="form-label">Information</label>
                                    <textarea
                                        id="detailsTextarea"
                                        name="person_material_information"
                                        value={formData.person_material_information}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter additional information (optional)"
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

export default ProjectMaterial;
