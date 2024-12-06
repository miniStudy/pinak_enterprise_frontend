import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from 'bootstrap';


const MachineMaintenance = () => {
  const [machineMaintenance, setMachineMaintenance] = useState([]);
  const [maintenanceTypes, setMaintenanceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const modalRef = useRef();
  const deletemodel = useRef();
  const [delid,setdelid] = useState("");
  const [Messages, setMessages] = useState('');


  const [formData, setFormData] = useState({
    machine_maintenance_id: '',
    machine_maintenance_amount: '',
    machine_maintenance_date: '',
    machine_maintenance_amount_paid: false,
    machine_maintenance_amount_paid_by: '',
    machine_maintenance_person: '',
    machine_maintenance_contact: '',
    machine_maintenance_driver: '',
    machine_maintenance_details: '',
    machine_maintenance_types_id: '',
  });

  const fetchMaintenanceDetails = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/show_machine_maintenance/');
      setMachineMaintenance(response.data.data || []);
      setMaintenanceTypes(response.data.maintenance_types_data || []);
      setTitle(response.data.title);
      setLoading(false);
    } catch (err) {
      setError('Failed to load maintenance details.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceDetails();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  useEffect(() => {
    if (Messages) {
      const timer = setTimeout(() => {
        setMessages('');  // Clear success message after 3 seconds
      }, 3000);  // 3000 milliseconds = 3 seconds

      // Cleanup the timer if the component is unmounted or successMessage changes
      return () => clearTimeout(timer);
    }
  }, [Messages]);

  // Handle form submission for Add/Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{

    
      const response = await axios.post(
        'http://127.0.0.1:8000/insert_update_machine_maintenance/',
        formData
      );
      if (response.status === 200) {
        alert('Maintenance details saved successfully!');
        fetchMaintenanceDetails(); // Reload data
        resetForm();
        closeModal();
      } else {
        alert('Failed to save maintenance details.');
      }
    } catch(err){
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
        `http://127.0.0.1:8000/insert_update_machine_maintenance/?getdata_id=${id}`
      );
      setFormData(response.data.data);
      setMaintenanceTypes(response.data.maintenance_types_data || []);
      openModal()
    } catch (err) {
      setError('Failed to load machine details');
    }
  };

  const deleteData = async (id) => {
    try{
      const response = await axios.delete(
        `http://127.0.0.1:8000/delete_machine_maintenance/?machine_maintenance_id=${id}`
      );
      setMessages(response.data.message)
      fetchMaintenanceDetails();
      closedeleteModal();
    } catch (err){
      setError("Failed to delete document type data")
    }
  }

  const resetForm = () => {
    setFormData({
      machine_maintenance_id: '',
      machine_maintenance_amount: '',
      machine_maintenance_date: '',
      machine_maintenance_amount_paid: false,
      machine_maintenance_amount_paid_by: '',
      machine_maintenance_person: '',
      machine_maintenance_contact: '',
      machine_maintenance_driver: '',
      machine_maintenance_details: '',
      machine_maintenance_types_id: '',
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

  // Render the machine maintenance table
  return (
    <>
      <div>
      {Messages && <div class="alert alert-success alert-dismissible fade show" role="alert">{Messages}</div>}
        <h1>{title}</h1> {/* Display the title */}
        <button type="button" className="btn btn-primary" onClick={openModal}>Add Maintenance</button>

        <table border="1" style={{ width: "100%", textAlign: "left", margin: "20px auto" }}>
          <thead>
            <tr>
              <th>Maintenance ID</th>
              <th>Maintenance Amount</th>
              <th>Maintenance Date</th>
              <th>Amount Paid</th>
              <th>Paid By</th>
              <th>Maintenance Person</th>
              <th>Contact</th>
              <th>Driver</th>
              <th>Details</th>
              <th>Type Name</th>
              <th>Update</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {machineMaintenance.length > 0 ? (
              machineMaintenance.map((maintenance) => (
                <tr key={maintenance.machine_maintenance_id}>
                  <td>{maintenance.machine_maintenance_id || "N/A"}</td>
                  <td>{maintenance.machine_maintenance_amount || "N/A"}</td>
                  <td>{maintenance.machine_maintenance_date || "N/A"}</td>
                  <td>{maintenance.machine_maintenance_amount_paid ? "Yes" : "No"}</td>
                  <td>{maintenance.machine_maintenance_amount_paid_by || "N/A"}</td>
                  <td>{maintenance.machine_maintenance_person || "N/A"}</td>
                  <td>{maintenance.machine_maintenance_contact || "N/A"}</td>
                  <td>{maintenance.machine_maintenance_driver || "N/A"}</td>
                  <td>{maintenance.machine_maintenance_details || "N/A"}</td>
                  <td>{maintenance.machine_maintenance_types_id__maintenance_type_name || "N/A"}</td>
                  <td><i className="fa-regular fa-pen-to-square" onClick={() => editDetailsGetData(maintenance.machine_maintenance_id)}></i></td>
                  <td><i class="fa-regular fa-trash-can" onClick={() => opendeleteModal(maintenance.machine_maintenance_id)}></i></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" style={{ textAlign: "center" }}>
                  No machine maintenance records available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modal for Add/Edit Maintenance */}
      <div
        className="modal fade"
        id="maintenanceModal"
        tabIndex="-1"
        aria-labelledby="maintenanceModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="maintenanceModalLabel">
                {formData.machine_maintenance_id ? 'Edit Maintenance' : 'Add Maintenance'}
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
                  <label>Maintenance Amount:</label>
                  <input
                    type="text"
                    name="machine_maintenance_amount"
                    value={formData.machine_maintenance_amount}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Maintenance Date:</label>
                  <input
                    type="date"
                    name="machine_maintenance_date"
                    value={formData.machine_maintenance_date}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Amount Paid:</label>
                  <input
                    type="checkbox"
                    name="machine_maintenance_amount_paid"
                    checked={formData.machine_maintenance_amount_paid}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Paid By:</label>
                  <select
                    name="machine_maintenance_amount_paid_by" onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="Machine_Owner">Machine Owner</option>
                    <option value="Pinak_Enterprise">Pinak Enterprise</option>
                    <option value="Pinak">Pinak</option>
                  </select>
                </div>
                <div>
                  <label>Maintenance Person:</label>
                  <input
                    type="text"
                    name="machine_maintenance_person"
                    value={formData.machine_maintenance_person}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Contact:</label>
                  <input
                    type="text"
                    name="machine_maintenance_contact"
                    value={formData.machine_maintenance_contact}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Driver:</label>
                  <input
                    type="text"
                    name="machine_maintenance_driver"
                    value={formData.machine_maintenance_driver}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Details:</label>
                  <textarea
                    name="machine_maintenance_details"
                    value={formData.machine_maintenance_details}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div>
                  <label>Maintenance Type:</label>
                  <select name="machine_maintenance_types_id" value={formData.machine_maintenance_types_id} onChange={handleChange} required>
                  <option value="">Select maintenance types</option>
                    {maintenanceTypes.map((type) => (
                      <option key={type.maintenance_type_id} value={type.maintenance_type_id}>
                        {type.maintenance_type_name}
                      </option>
                    ))}
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
                Delete Machine-Maintenance Data
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

export default MachineMaintenance;
