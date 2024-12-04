import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from 'bootstrap';


const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(""); // To store the title from API response
  const [projectTypes, setprojectTypes] = useState([]);
  const modalRef = useRef();

  const [formData, setformData] = useState({
    project_id : '',
    project_name : '',
    project_start_date : '',
    project_end_date : '',
    project_amount : '',
    project_location : '',
    project_company_name : '',
    project_person_name : '',
    project_status : '',
    project_types_id : '',
  })

   // Fetch machine details
   const fetchProjects = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/show_projects/');
        console.log(response.data.data)
        setProjects(response.data.data || []);
        setprojectTypes(response.data.project_types_data || []);
        setTitle(response.data.title);
        setLoading(false);
    } catch (err) {
        setError('Failed to load project details');
        setLoading(false);
    }
};

useEffect(() => {
  fetchProjects();
}, []);

// Handle input changes
const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setformData((prevData) => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
    }));
};

// Handle form submission for Add/Update
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(
            'http://127.0.0.1:8000/insert_update_project/',
            formData
        );
        if (response.status === 200) {
            alert('Project details saved successfully!');
            fetchProjects(); // Reload data
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
            `http://127.0.0.1:8000/insert_update_project/?getdata_id=${id}`
        );
        setformData(response.data.data);
        setprojectTypes(response.data.project_types_data || []);
        openModal()
    } catch (err) {
        setError('Failed to load machine details');
    }
};

// Reset the form state
const resetForm = () => {
    setformData({
      project_id : '',
      project_name : '',
      project_start_date : '',
      project_end_date : '',
      project_amount : '',
      project_location : '',
      project_company_name : '',
      project_person_name : '',
      project_status : '',
      project_types_id : '',
    });
};

  // Show loading message while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error message if fetching data failed
  if (error) {
    return <div>{error}</div>;
  }

  // Render the projects table
  return (
    <>
    <div>
      <h1>{title}</h1> {/* Display the title */}
      <button type="button" className="btn btn-primary" onClick={openModal}>Add Machine</button>
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Project ID</th>
            <th>Project Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Amount</th>
            <th>Location</th>
            <th>Company Name</th>
            <th>Person Name</th>
            <th>Status</th>
            <th>Project Type Name</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {projects.length > 0 ? (
            projects.map((project) => (
              <tr key={project.project_id}>
                <td>{project.project_id || "N/A"}</td>
                <td>{project.project_name || "N/A"}</td>
                <td>{project.project_start_date || "N/A"}</td>
                <td>{project.project_end_date || "N/A"}</td>
                <td>{project.project_amount || "N/A"}</td>
                <td>{project.project_location || "N/A"}</td>
                <td>{project.project_company_name || "N/A"}</td>
                <td>{project.project_person_name || "N/A"}</td>
                <td>{project.project_status || "N/A"}</td>
                <td>{project.project_types_id__project_type_name || "N/A"}</td>
                <td><i className="fa-regular fa-pen-to-square" onClick={() => editDetailsGetData(project.project_id)}></i></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" style={{ textAlign: "center" }}>
                No projects available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    {/* Modal for Add/Edit Project */}
<div
    className="modal fade"
    id="projectModal"
    tabIndex="-1"
    aria-labelledby="projectModalLabel"
    aria-hidden="true"
    ref={modalRef}
>
    <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="projectModalLabel">
                    {formData.project_id ? 'Edit Project' : 'Add Project'}
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
                        <label>Project Name:</label>
                        <input
                            type="text"
                            name="project_name"
                            value={formData.project_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Start Date:</label>
                        <input
                            type="date"
                            name="project_start_date"
                            value={formData.project_start_date}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>End Date:</label>
                        <input
                            type="date"
                            name="project_end_date"
                            value={formData.project_end_date}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Project Amount:</label>
                        <input
                            type="text"
                            name="project_amount"
                            value={formData.project_amount}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Location:</label>
                        <input
                            type="text"
                            name="project_location"
                            value={formData.project_location}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Company Name:</label>
                        <input
                            type="text"
                            name="project_company_name"
                            value={formData.project_company_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Contact Person:</label>
                        <input
                            type="text"
                            name="project_person_name"
                            value={formData.project_person_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Status:</label>
                        <select name="project_status" onChange={handleChange} required>
                            <option value="">-----</option>
                            <option value="Ongoing" selected={formData.project_status === "Ongoing"}>Ongoing</option>
                            <option value="Closed" selected={formData.project_status === "Closed"}>Closed</option>
                            <option value="Taken" selected={formData.project_status === "Taken"}>Taken</option>
                        </select>
                    </div>
                    <div>
                    <label>Machine Type ID:</label>
                                    <select name="project_types_id" onChange={handleChange} required>
                                    <option value="">Select project types</option>
                                    {projectTypes.length > 0 ? (
                                        projectTypes.map((x) => (
                                        <option value={x.project_type_id} selected={formData.project_type_id === x.project_type_id}>{x.project_type_name}</option>
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

export default Projects;