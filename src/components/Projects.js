import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from 'bootstrap';
import { Link } from 'react-router-dom';
import Select from 'react-select';


const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(""); // To store the title from API response
  const [projectTypes, setprojectTypes] = useState([]);
  const [persons, setpersons] = useState([]);
  const modalRef = useRef();
  const deletemodel = useRef();
  const [delid, setdelid] = useState("");
  const [Messages, setMessages] = useState('');
  const [formData, setformData] = useState({
    project_id: "",
    project_name: "",
    project_start_date: "",
    project_end_date: "",
    project_amount: "",
    project_location: "",
    project_types_id: "",
    project_status: "",
    project_owner_name: "",
    project_cgst: "",
    project_sgst: "",
    project_tax: "",
    project_discount: "",
  })

  const projecttypesoptions = projectTypes.map((type) => ({
    value: type.project_type_id,
    label: type.project_type_name,
}));

const personsoptions = persons.map((pers) => ({
  value: pers.person_id,
  label: pers.person_name + pers.person_contact_number,
}));
  // Fetch machine details
  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/show_projects/');
      console.log(response.data.data)
      setProjects(response.data.data || []);
      setprojectTypes(response.data.project_types_data || []);
      setpersons(response.data.persons_data || []);
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
    setformData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleProjectTypeChange = (selectedOption) => {
    setformData({
      ...formData,
      project_types_id: selectedOption ? selectedOption.value : "",
    });
  };

  const handleOwnerChange = (selectedOption) => {
    setformData({
      ...formData,
      project_owner_name: selectedOption ? selectedOption.value : "",
    });
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
        `http://127.0.0.1:8000/insert_update_project/?getdata_id=${id}`
      );
      setformData(response.data.data);
      setprojectTypes(response.data.project_types_data || []);
      openModal()
    } catch (err) {
      setError('Failed to load machine details');
    }
  };

  const deleteData = async (id) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/delete_project/?project_id=${id}`
      );
      setMessages(response.data.message)
      fetchProjects();
      closedeleteModal();
    } catch (err) {
      setError("Failed to delete document type data")
    }
  }


  // Reset the form state
  const resetForm = () => {
    setformData({
      project_id: "",
      project_name: "",
      project_start_date: "",
      project_end_date: "",
      project_amount: "",
      project_location: "",
      project_types_id: "",
      project_status: "",
      project_owner_name: "",
      project_cgst: "",
      project_sgst: "",
      project_tax: "",
      project_discount: "",
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
        {Messages && <div class="alert alert-success alert-dismissible fade show" role="alert">{Messages}</div>}
        <h3>{title}</h3> {/* Display the title */}
        <div className="d-flex align-items-center mb-3">
    <Link to="/project-types"><img 
        src="/static/icons/projecttype2.png" 
        alt="User Icon" 
        style={{ height: "30px", width: "auto" }} // Ensure consistent height
    /></Link>
    <button
        type="button"
        className="btn btn-sm btn-primary ms-2"
        onClick={openModal}
        style={{ height: "30px" }} // Adjust the height as needed
    >
        Add Project
    </button>
    
    <div className="input-group" style={{ height: "30px", width: "auto" }}>
        <input type="text" class="form-control ms-2" style={{ height: "30px", width: "100px" }} placeholder="Search" aria-label="Recipient's username" aria-describedby="button-addon2"/>
         <button className="btn btn-sm btn-outline-primary d-flex align-items-center" type="button" id="button-addon2" style={{ height: "30px", width: "auto" }}><i class="fa-solid fa-magnifying-glass"></i></button>
    </div>

</div>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Project Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Amount</th>
                <th>Location</th>
                <th>Project Type</th>
                <th>Status</th>
                <th>Customer Name</th>
                <th>Customer Contact</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>Tax</th>
                <th>Discount</th>
                <th>Update</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 ? (
                projects.map((project, index) => (
                  <tr key={project.project_id}>
                    <td>{index + 1} {project.project_id}</td>
                    <td><Link to={`/project/${project.project_id}`}>{project.project_name || "N/A"}</Link></td>
                    <td>{project.project_start_date || "N/A"}</td>
                    <td>{project.project_end_date || "N/A"}</td>
                    <td>{project.project_amount || "N/A"}</td>
                    <td>{project.project_location || "N/A"}</td>
                    <td>{project.project_types_id__project_type_name || "N/A"}</td>
                    <td>{project.project_status || "N/A"}</td>
                    <td>{project.project_owner_name__person_name || "N/A"}</td>
                    <td>{project.project_owner_name__person_contact_number || "N/A"}</td>
                    <td>{project.project_cgst || "N/A"}</td>
                    <td>{project.project_sgst || "N/A"}</td>
                    <td>{project.project_tax || "N/A"}</td>
                    <td>{project.project_discount || "N/A"}</td>
                    <td>
                      <i
                        className="fa-regular fa-pen-to-square"
                        onClick={() => editDetailsGetData(project.project_id)}
                      ></i>
                    </td>
                    <td>
                      <i
                        className="fa-regular fa-trash-can"
                        onClick={() => opendeleteModal(project.project_id)}
                      ></i>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="16" style={{ textAlign: "center" }}>
                    No projects available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
                {formData.project_id ? 'Edit Projects' : 'Add Projects'}
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
                  <input
                    type="text"
                    name="project_name"
                    value={formData.project_name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Project Name*"
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    name="project_amount"
                    value={formData.project_amount}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Amount*"
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    name="project_location"
                    value={formData.project_location}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Location*"
                    required
                  />
                </div>

                <div className="mb-3">
            <Select
                options={projecttypesoptions}
                value={projecttypesoptions.find((option) => option.value === formData.project_types_id)}
                onChange={handleProjectTypeChange}
                placeholder="Select Project Type*"
                isSearchable
                isClearable
                className="react-select-container mb-3"
                classNamePrefix="react-select"
            />
        </div>

                <div className="mb-3">
                  <select
                    name="project_status"
                    value={formData.project_status}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Status*</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Closed">Closed</option>
                    <option value="Taken">Taken</option>
                  </select>
                </div>

                <Select
                options={personsoptions}
                value={personsoptions.find((option) => option.value === formData.project_owner_name)}
                onChange={handleOwnerChange}
                placeholder="Select Project Owner*"
                isSearchable
                isClearable
                className="react-select-container mb-3"
                classNamePrefix="react-select"
            />

                <div className="mb-3">
                  <label>Start Date:</label>
                  <input
                    type="date"
                    name="project_start_date"
                    value={formData.project_start_date}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                <label>End Date:</label>
                  <input
                    type="date"
                    name="project_end_date"
                    value={formData.project_end_date}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="End Date"
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    name="project_cgst"
                    value={formData.project_cgst}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="CGST"
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    name="project_sgst"
                    value={formData.project_sgst}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="SGST"
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    name="project_tax"
                    value={formData.project_tax}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Tax"
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    name="project_discount"
                    value={formData.project_discount}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Discount"
                  />
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
                Delete Project Data
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

export default Projects;