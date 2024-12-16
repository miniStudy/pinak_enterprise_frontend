import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

function Maintenance_types_insert({fetchdata}) {
    const modalRef = useRef();
    const [formData, setFormData] = useState({
        maintenance_type_id: "",
        maintenance_type_name: ""
      });

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
        "http://127.0.0.1:8000/insert_update_maintenance_type/",
        formData
      );
      if (response.status === 200) {
        fetchdata()
        resetForm();
        closeModal();
      } else {
        alert("Failed to save maintenance type.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error occurred while saving maintenance type.");
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

  // Reset the form state
  const resetForm = () => {
    setFormData({
        maintenance_type_id: "",
        maintenance_type_name: ""
    });
  };

  return (
    <>
    <button type="button" className="btn btn-sm ms-2 btn-primary" onClick={openModal}>Add Maintenance Type
    </button>
    <div
        className="modal fade"
        id="maintenanceTypeModal"
        tabIndex="-1"
        aria-labelledby="maintenanceTypeModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog typesmodel">
          <div className="modal-content typesmodel">
            <div className="modal-header">
              <h5 className="modal-title" id="maintenanceTypeModalLabel">
                {formData.maintenance_type_id ? "Edit Maintenance Type" : "Add Maintenance Type"}
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
                  <label className="form-label">Maintenance Type Name:</label>
                  <input
                    type="text"
                    name="maintenance_type_name"
                    value={formData.maintenance_type_name}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-sm mt-2 btn-primary">
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
      </div></>
  )
}
export default Maintenance_types_insert