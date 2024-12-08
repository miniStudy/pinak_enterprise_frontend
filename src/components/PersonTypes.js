import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

const PersonTypes = () => {
  const [personTypes, setPersonTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const modalRef = useRef();
  const deletemodel = useRef();
  const [delid,setdelid] = useState("");
  const [Messages, setMessages] = useState('');

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

  const deleteData = async (id) => {
    try{
      const response = await axios.delete(
        `http://127.0.0.1:8000/delete_person_type/?person_type_id=${id}`
      );
      setMessages(response.data.message)
      fetchPersonTypes();
      closedeleteModal();
    } catch (err){
      setError("Failed to delete document type data")
    }
  }

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
      {Messages && <div class="alert alert-success alert-dismissible fade show" role="alert">{Messages}</div>}
      <h3>{title}</h3>
        <button type="button" className="btn btn-primary btn-sm mb-3" onClick={openModal}>
          Add Person Type
        </button>
        <div className="table-responsive">
            <table className="table table-hover">
          <thead>
            <tr>
              <th>S.N</th>
              <th>Person Type Name</th>
              <th>Update</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {personTypes.length > 0 ? (
              personTypes.map((personType,index) => (
                <tr key={personType.person_type_id}>
                  <td>{index+1}</td>
                  <td>{personType.person_type_name || "N/A"}</td>
                  <td>
                    <i
                      className="fa-regular fa-pen-to-square"
                      onClick={() =>
                        editDetailsGetData(personType.person_type_id)
                      }
                    ></i>
                  </td>
                  <td><i class="fa-regular fa-trash-can" onClick={() => opendeleteModal(personType.person_type_id)}></i></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No person types available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
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
                Delete Person-Type Data
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

export default PersonTypes;