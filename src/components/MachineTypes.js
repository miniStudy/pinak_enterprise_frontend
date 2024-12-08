import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';

const MachineTypes = () => {
  const [machinetypesDetails, setMachineTypesDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const modalRef = useRef();
  const deletemodel = useRef();
  const [delid,setdelid] = useState("");
  const [Messages, setMessages] = useState('');

  // Form state for Add/Edit
  const [formData, setFormData] = useState({
    machine_type_id: '',
    machine_type_name: '',
  });

  // Fetch machine types
  const fetchMachineTypes = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/show_machine_types/');
      setMachineTypesDetails(response.data.data);
      setTitle(response.data.title);
      setLoading(false);
    } catch (err) {
      setError('Failed to load machine types');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachineTypes();
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
        'http://127.0.0.1:8000/insert_update_machine_type/',
        formData
      );
      if (response.status === 200) {
        alert('Machine type saved successfully!');
        fetchMachineTypes(); // Reload data
        resetForm();
        closeModal();
      } else {
        alert('Failed to save machine type.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error occurred while saving machine type.');
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
        `http://127.0.0.1:8000/insert_update_machine_type/?getdata_id=${id}`
      );
      setFormData(response.data.data);
      openModal()
    } catch (err) {
      setError('Failed to load machine type details');
    }
  };

  const deleteData = async (id) => {
    try{
      const response = await axios.delete(
        `http://127.0.0.1:8000/delete_machine_type/?machine_type_id=${id}`
      );
      setMessages(response.data.message)
      fetchMachineTypes();
      closedeleteModal();
    } catch (err){
      setError("Failed to delete document type data")
    }
  }

  // Reset the form state
  const resetForm = () => {
    setFormData({
      machine_type_id: '',
      machine_type_name: '',
    });
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div>
      {Messages && <div class="alert alert-success alert-dismissible fade show" role="alert">{Messages}</div>}
        <h3>{title}</h3>
        {/* Button to open modal */}
        <button
          type="button"
          className="btn btn-sm mb-3 btn-primary"
          onClick={openModal}
        >
          Add Machine Type
        </button>

        {/* Machine Types Table */}
        <div className="table-responsive">
          <table className="table table-hover">
          <thead>
            <tr>
              <th>S.N</th>
              <th>Machine Type</th>
              <th>Update</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {machinetypesDetails.map((type,index) => (
              <tr key={type.machine_type_id}>
                <td>{index+1}</td>
                <td>{type.machine_type_name}</td>
                <td>
                  <i
                    className="fa-regular fa-pen-to-square"
                    
                    onClick={() => editDetailsGetData(type.machine_type_id)}
                  ></i>
                </td>
                <td><i class="fa-regular fa-trash-can" onClick={() => opendeleteModal(type.machine_type_id)}></i></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
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
                {formData.machine_type_id ? 'Edit Machine Type' : 'Add Machine Type'}
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
                  <label className='form-label'>Machine Type:</label>
                  <input
                    type="text"
                    name="machine_type_name"
                    value={formData.machine_type_name}
                    onChange={handleChange}
                    className='form-control'
                  />
                </div>
                <button type="submit" className="btn mt-3 btn-sm btn-primary">
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
                Delete Machine-Type Data
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

export default MachineTypes;