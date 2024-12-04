import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

const WorkTypes = () => {
  const [workTypes, setWorkTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const modalRef = useRef();

  const [formData, setFormData] = useState({
    work_type_id: "",
    work_type_name: "",
    work_type_details: "",
  });

  // Fetch work types from API
  const fetchWorkTypes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/show_work_types/");
      setWorkTypes(response.data.data || []);
      setTitle(response.data.title);
      setLoading(false);
    } catch (err) {
      setError("Failed to load work types data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkTypes();
  }, []);

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
        "http://127.0.0.1:8000/insert_update_work_type/",
        formData
      );
      if (response.status === 200) {
        alert("Work type saved successfully!");
        fetchWorkTypes(); // Reload data
        resetForm();
        closeModal();
      } else {
        alert("Failed to save work type.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error occurred while saving work type.");
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

  // Fetch data for editing a specific work type
  const editDetailsGetData = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/insert_update_work_type/?getdata_id=${id}`
      );
      setFormData(response.data.data);
      openModal();
    } catch (err) {
      setError("Failed to load work type details");
    }
  };

  // Reset the form state
  const resetForm = () => {
    setFormData({
      work_type_id: "",
      work_type_name: "",
      work_type_details: "",
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

  // Render the work types table
  return (
    <>
      <div>
        <h1>{title}</h1>
        <button type="button" className="btn btn-primary" onClick={openModal}>
          Add Work Type
        </button>
        <table
          border="1"
          style={{ width: "100%", textAlign: "left", marginTop: "20px" }}
        >
          <thead>
            <tr>
              <th>Work Type ID</th>
              <th>Work Type Name</th>
              <th>Work Type Details</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {workTypes.length > 0 ? (
              workTypes.map((workType) => (
                <tr key={workType.work_type_id}>
                  <td>{workType.work_type_id || "N/A"}</td>
                  <td>{workType.work_type_name || "N/A"}</td>
                  <td>{workType.work_type_details || "N/A"}</td>
                  <td>
                    <i
                      className="fa-regular fa-pen-to-square"
                      onClick={() =>
                        editDetailsGetData(workType.work_type_id)
                      }
                    ></i>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No work types available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Work Type */}
      <div
        className="modal fade"
        id="workTypeModal"
        tabIndex="-1"
        aria-labelledby="workTypeModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="workTypeModalLabel">
                {formData.work_type_id ? "Edit Work Type" : "Add Work Type"}
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
                  <label>Work Type Name:</label>
                  <input
                    type="text"
                    name="work_type_name"
                    value={formData.work_type_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Work Type Details:</label>
                  <textarea
                    name="work_type_details"
                    value={formData.work_type_details}
                    onChange={handleChange}
                    required
                  />
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

export default WorkTypes;
