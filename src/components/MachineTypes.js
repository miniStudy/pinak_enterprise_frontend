import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';

const MachineTypes = () => {
  const [machinetypesDetails, setMachineTypesDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const modalRef = useRef();

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
        <h1>{title}</h1>
        {/* Button to open modal */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={openModal}
        >
          Add Machine Type
        </button>

        {/* Machine Types Table */}
        <table>
          <thead>
            <tr>
              <th>Machine Type ID</th>
              <th>Machine Type</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {machinetypesDetails.map((type) => (
              <tr key={type.machine_type_id}>
                <td>{type.machine_type_id}</td>
                <td>{type.machine_type_name}</td>
                <td>
                  <i
                    className="fa-regular fa-pen-to-square"
                    data-bs-toggle="modal"
                    data-bs-target="#machineTypeModal"
                    onClick={() => editDetailsGetData(type.machine_type_id)}
                  ></i>
                </td>
              </tr>
            ))}
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
                  <label>Machine Type:</label>
                  <input
                    type="text"
                    name="machine_type_name"
                    value={formData.machine_type_name}
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
    </>
  );
};

export default MachineTypes;