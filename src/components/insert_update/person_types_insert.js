import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

function Person_types_insert({fetchPersons}) {
    const modalRef = useRef();
    const [formData, setFormData] = useState({
        person_type_id: "",
        person_type_name: "",
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
        "http://127.0.0.1:8000/insert_update_person_type/",
        formData
      );
      if (response.status === 200) {
        alert("Person type saved successfully!");
        fetchPersons()
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

  // Reset the form state
  const resetForm = () => {
    setFormData({
      person_type_id: "",
      person_type_name: "",
    });
  };

  return (
    <>
    <button type="button" className="btn btn-primary" onClick={openModal}>
                                    Add Person Type
                                </button>
    <div
        className="modal fade"
        id="personTypeModal"
        tabIndex="-1"
        aria-labelledby="personTypeModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog typesmodel">
          <div className="modal-content typesmodel">
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
      </div></>
  )
}

export default Person_types_insert