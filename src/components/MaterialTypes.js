import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

const MaterialTypes = () => {
  const [materialTypes, setMaterialTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("Material Types");
  const modalRef = useRef();

  const [formData, setFormData] = useState({
    material_type_id: "",
    material_type_name: "",
  });

  // Fetch material types from API
  const fetchMaterialTypes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/show_material_types/");
      setMaterialTypes(response.data.data || []);
      setTitle(response.data.title || "Material Types");
      setLoading(false);
    } catch (err) {
      setError("Failed to load material types data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterialTypes();
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
        "http://127.0.0.1:8000/insert_update_material_type/",
        formData
      );
      if (response.status === 200) {
        alert("Material type saved successfully!");
        fetchMaterialTypes(); // Reload data
        resetForm();
        closeModal();
      } else {
        alert("Failed to save material type.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error occurred while saving material type.");
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

  // Fetch data for editing a specific material type
  const editDetailsGetData = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/insert_update_material_type/?getdata_id=${id}`
      );
      setFormData(response.data.data);
      openModal();
    } catch (err) {
      setError("Failed to load material type details");
    }
  };

  // Reset the form state
  const resetForm = () => {
    setFormData({
      material_type_id: "",
      material_type_name: "",
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

  // Render the material types table
  return (
    <>
      <div>
        <h1>{title}</h1>
        <button type="button" className="btn btn-primary" onClick={openModal}>
          Add Material Type
        </button>
        <table
          border="1"
          style={{ width: "100%", textAlign: "left", marginTop: "20px" }}
        >
          <thead>
            <tr>
              <th>Material Type ID</th>
              <th>Material Type Name</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {materialTypes.length > 0 ? (
              materialTypes.map((materialType) => (
                <tr key={materialType.material_type_id}>
                  <td>{materialType.material_type_id || "N/A"}</td>
                  <td>{materialType.material_type_name || "N/A"}</td>
                  <td>
                    <i
                      className="fa-regular fa-pen-to-square"
                      onClick={() =>
                        editDetailsGetData(materialType.material_type_id)
                      }
                    ></i>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No material types available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Material Type */}
      <div
        className="modal fade"
        id="materialTypeModal"
        tabIndex="-1"
        aria-labelledby="materialTypeModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="materialTypeModalLabel">
                {formData.material_type_id
                  ? "Edit Material Type"
                  : "Add Material Type"}
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
                  <label>Material Type Name:</label>
                  <input
                    type="text"
                    name="material_type_name"
                    value={formData.material_type_name}
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

export default MaterialTypes;