import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

const ProjectTypes = () => {
  const [projectTypes, setProjectTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const modalRef = useRef();
  const deletemodel = useRef();
  const [delid,setdelid] = useState("");
  const [Messages, setMessages] = useState('');


  const [formData, setFormData] = useState({
    project_type_id: "",
    project_type_name: "",
    project_type_details: "",
  });
  

  // Fetch project types
  const fetchProjectTypes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/show_project_types/");
      setProjectTypes(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load project types");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectTypes();
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
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission for Add/Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/insert_update_project_type/",
        formData
      );
      if (response.status === 200) {
        alert("Project type saved successfully!");
        fetchProjectTypes(); // Reload data
        resetForm();
        closeModal();
      } else {
        alert("Failed to save project type.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error occurred while saving project type.");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      project_type_id: "",
      project_type_name: "",
      project_type_details: "",
    });
  };

  // Close modal
  const closeModal = () => {
    const modalInstance = Modal.getInstance(modalRef.current);
    if (modalInstance) {
      modalInstance.hide();
    }
  };

  // Open modal
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

  // Edit project type
  const editDetailsGetData = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/insert_update_project_type/?getdata_id=${id}`
      );
      setFormData(response.data.data);
      openModal();
    } catch (err) {
      setError("Failed to load project type details");
    }
  };

  const deleteData = async (id) => {
    try{
      const response = await axios.delete(
        `http://127.0.0.1:8000/delete_project_type/?project_type_id=${id}`
      );
      setMessages(response.data.message)
      fetchProjectTypes();
      closedeleteModal();
    } catch (err){
      setError("Failed to delete document type data")
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

  return (
    <>
      <div>
      {Messages && <div class="alert alert-success alert-dismissible fade show" role="alert">{Messages}</div>}
        <h1>Project Types</h1>
        <button type="button" className="btn btn-primary" onClick={openModal}>
          Add Project Type
        </button>
        <table
          border="1"
          style={{
            width: "80%",
            textAlign: "left",
            margin: "20px auto",
          }}
        >
          <thead>
            <tr>
              <th>Project Type ID</th>
              <th>Project Type Name</th>
              <th>Project Type Details</th>
              <th>Update</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {projectTypes.length > 0 ? (
              projectTypes.map((type) => (
                <tr key={type.project_type_id}>
                  <td>{type.project_type_id || "N/A"}</td>
                  <td>{type.project_type_name || "N/A"}</td>
                  <td>{type.project_type_details || "N/A"}</td>
                  <td>
                    <i
                      className="fa-regular fa-pen-to-square"
                      onClick={() => editDetailsGetData(type.project_type_id)}
                    ></i>
                  </td>
                  <td><i class="fa-regular fa-trash-can" onClick={() => opendeleteModal(type.project_type_id)}></i></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No project types available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Project Type */}
      <div
        className="modal fade"
        id="projectTypeModal"
        tabIndex="-1"
        aria-labelledby="projectTypeModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="projectTypeModalLabel">
                {formData.project_type_id ? "Edit Project Type" : "Add Project Type"}
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
                  <label>Project Type Name:</label>
                  <input
                    type="text"
                    name="project_type_name"
                    value={formData.project_type_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Project Type Details:</label>
                  <textarea
                    name="project_type_details"
                    value={formData.project_type_details}
                    onChange={handleChange}
                    required
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
                Delete Project-Type Data
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              are you sure You want to delete this data?<br/>
            
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

export default ProjectTypes;