import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from 'bootstrap';


const MaintenanceTypes = () => {
  const [maintenanceTypes, setMaintenanceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const modalRef = useRef();
  const deletemodel = useRef();
  const [delid,setdelid] = useState("");
  const [Messages, setMessages] = useState('');

  const [formData, setFormData] = useState({
    maintenance_type_id: "",
    maintenance_type_name: ""
  })


  const fetchMaintenanceTypes = async () => {
    try{
      const response = await axios.get('http://127.0.0.1:8000/show_maintenance_types/');
      setMaintenanceTypes(response.data.data);
      setTitle(response.data.title);
      setLoading(false);

    } catch(err){
      setError('Failed to load maintenance data');
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMaintenanceTypes();
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
        'http://127.0.0.1:8000/insert_update_maintenance_type/',
        formData
      );
      if (response.status === 200) {
        alert('Maintenence type saved successfully!');
        fetchMaintenanceTypes(); // Reload data
        resetForm();
        closeModal();
      } else {
        alert('Failed to save machine type.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error occurred while saving maintenance type.');
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

  // Fetch data for editing a specific machine type
  const editDetailsGetData = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/insert_update_maintenance_type/?getdata_id=${id}`
      );
      setFormData(response.data.data);
      openModal()
    } catch (err) {
      setError('Failed to load maintenance type details');
    }
  };

  const deleteData = async (id) => {
    try{
      const response = await axios.delete(
        `http://127.0.0.1:8000/delete_maintenance_type/?maintenance_type_id=${id}`
      );
      setMessages(response.data.message)
      fetchMaintenanceTypes();
      closedeleteModal();
    } catch (err){
      setError("Failed to delete document type data")
    }
  }

  // Reset the form state
  const resetForm = () => {
    setFormData({
      maintenance_type_id: '',
      maintenance_type_name: '',
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

  // Render the maintenance types table
  return (
    <>
    <div>
    {Messages && <div class="alert alert-success alert-dismissible fade show" role="alert">{Messages}</div>}
      <h1>{title}</h1> {/* Display the title */}
      <button
          type="button"
          className="btn btn-primary"
          onClick={openModal}
        >
          Add Maintenance Type
        </button>
      <table border="1" style={{ width: "50%", textAlign: "left", margin: "20px auto" }}>
        <thead>
          <tr>
            <th>Maintenance Type ID</th>
            <th>Maintenance Type Name</th>
            <th>Update</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {maintenanceTypes.length > 0 ? (
            maintenanceTypes.map((type) => (
              <tr key={type.maintenance_type_id}>
                <td>{type.maintenance_type_id || "N/A"}</td>
                <td>{type.maintenance_type_name || "N/A"}</td>
                <td>
                  <i
                    className="fa-regular fa-pen-to-square"
                    
                    onClick={() => editDetailsGetData(type.maintenance_type_id)}
                  ></i>
                </td>
                <td><i class="fa-regular fa-trash-can" onClick={() => opendeleteModal(type.maintenance_type_id)}></i></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                No maintenance types available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Modal for Add/Edit Machine Type */}
    <div
    className="modal fade"
    id="machineTypeModal"
    tabIndex="-1"
    aria-labelledby="machineTypeModalLabel"
    aria-hidden="true"
    ref={modalRef}
  >
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="machineTypeModalLabel">
            {formData.maintenance_type_id ? 'Edit Maintenance Type' : 'Add Maintenance Type'}
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
              <label>Machine Type:</label>
              <input
                type="text"
                name="maintenance_type_name"
                value={formData.maintenance_type_name}
                onChange={handleChange}
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
                Delete Maintenance-Type Data
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

export default MaintenanceTypes;
