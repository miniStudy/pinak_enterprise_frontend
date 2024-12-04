import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

const PersonTypes = () => {
  const [personTypes, setPersonTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const modalRef = useRef();

  const [formData, setFormData] = useState({
    person_type_id: "",
    person_type_name: "",
  });

  // Fetch person types from API
  const fetchPersonTypes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/show_person_types/");
      setPersonTypes(response.data.data || []);
      setTitle(response.data.title);
      setLoading(false);
    } catch (err) {
      setError("Failed to load person types data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonTypes();
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
        "http://127.0.0.1:8000/insert_update_person_type/",
        formData
      );
      if (response.status === 200) {
        alert("Person type saved successfully!");
        fetchPersonTypes(); // Reload data
        resetForm();
        closeModal();
      } else {
        alert("Failed to save person type.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error occurred while saving person type.");
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

  // Fetch data for editing a specific person type
  const editDetailsGetData = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/insert_update_person_type/?getdata_id=${id}`
      );
      setFormData(response.data.data);
      openModal();
    } catch (err) {
      setError("Failed to load person type details");
    }
  };

  // Reset the form state
  const resetForm = () => {
    setFormData({
      person_type_id: "",
      person_type_name: "",
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

  // Render the person types table
  return (
    <>
      <div>
      <h1>{title}</h1>
        <button type="button" className="btn btn-primary" onClick={openModal}>
          Add Person Type
        </button>
        <table
          border="1"
          style={{ width: "100%", textAlign: "left", marginTop: "20px" }}
        >
          <thead>
            <tr>
              <th>Person Type ID</th>
              <th>Person Type Name</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {personTypes.length > 0 ? (
              personTypes.map((personType) => (
                <tr key={personType.person_type_id}>
                  <td>{personType.person_type_id || "N/A"}</td>
                  <td>{personType.person_type_name || "N/A"}</td>
                  <td>
                    <i
                      className="fa-regular fa-pen-to-square"
                      onClick={() =>
                        editDetailsGetData(personType.person_type_id)
                      }
                    ></i>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No person types available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Person Type */}
      <div
        className="modal fade"
        id="personTypeModal"
        tabIndex="-1"
        aria-labelledby="personTypeModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="personTypeModalLabel">
                {formData.person_type_id ? "Edit Person Type" : "Add Person Type"}
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
                  <label>Person Type Name:</label>
                  <input
                    type="text"
                    name="person_type_name"
                    value={formData.person_type_name}
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

export default PersonTypes;