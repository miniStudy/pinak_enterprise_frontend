import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from 'bootstrap';
import Maintenance_types_insert from './insert_update/maintenance_types_insert';
import Person_insert from './insert_update/person_insert';
import { Link } from 'react-router-dom';
import Select from 'react-select';


const MachineMaintenance = () => {
  const [machineMaintenance, setMachineMaintenance] = useState([]);
  const [maintenanceTypes, setMaintenanceTypes] = useState([]);
  const [machineData, setmachineData] = useState([]);
  const [personData, setpersonData] = useState([]);
  const [driverpersonData, setdriverpersonData] = useState([]);
  const [projectData, setprojectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const modalRef = useRef();
  const deletemodel = useRef();
  const [delid, setdelid] = useState("");
  const [Messages, setMessages] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const machineoptions = machineData.map((machine) => ({
    value: machine.machine_id,
    label: machine.machine_name,
  }));

  const handleMachineChange = (selectedOption) => {
    setFormData({
      ...formData,
      machine_machine_id: selectedOption ? selectedOption.value : "",
    });
  };

  const driverpersonoptions = driverpersonData.map((x) => ({
    value: x.person_id,
    label: x.person_name,
  }));

  const repairpersonoptions = personData.map((x) => ({
    value: x.person_id,
    label: x.person_name,
  }));


  const handleDriverPersonChange = (selectedOption) => {
    setFormData({
      ...formData,
      machine_maintenance_driver_id: selectedOption ? selectedOption.value : "",
    });
  };

  const handleRepairPersonChange = (selectedOption) => {
    setFormData({
      ...formData,
      machine_maintenance_person_id: selectedOption ? selectedOption.value : "",
    });
  };

  const projectoptions = projectData.map((x) => ({
    value: x.project_id,
    label: x.project_name,
  }));

  const handleProjectChange = (selectedOption) => {
    setFormData({
      ...formData,
      project_id: selectedOption ? selectedOption.value : "",
    });
  };


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };


  // Filter data based on search term
  const filter_machineMaintenance = machineMaintenance.filter((item) => {

    const matchesSearchTerm =
      (item?.machine_machine_id__machine_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.machine_machine_id__machine_number_plate?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.machine_machine_id__machine_types_id__machine_type_name?.toString().includes(searchTerm)) ||
      (item?.machine_maintenance_amount?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.machine_maintenance_date?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.machine_maintenance_amount_paid_by?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.machine_maintenance_driver_id__person_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.machine_maintenance_person_id__person_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item?.machine_maintenance_person_id__person_contact_number?.toLowerCase().includes(searchTerm.toLowerCase()));
    (item?.machine_maintenance_types_id__maintenance_type_name?.toLowerCase().includes(searchTerm.toLowerCase()));
    (item?.project_id__project_name?.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearchTerm;
  });


  const [formData, setFormData] = useState({
    machine_maintenance_id: '',
    machine_machine_id: '',
    machine_maintenance_amount: '',
    machine_maintenance_date: '',
    machine_maintenance_amount_paid: false,
    machine_maintenance_amount_paid_by: '',
    machine_maintenance_types_id: '',
    machine_maintenance_details: '',
    machine_maintenance_driver_id: '',
    machine_maintenance_person_id: '',
    project_id: '',
  });

  const fetchMaintenanceDetails = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/show_machine_maintenance/');
      setMachineMaintenance(response.data.data || []);
      setMaintenanceTypes(response.data.maintenance_types_data || []);
      setmachineData(response.data.machines_data || []);
      setpersonData(response.data.persons_data || []);
      setdriverpersonData(response.data.driver_persons_data || []);
      setprojectData(response.data.projects_data || []);
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
    try {


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
    } catch (err) {
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
      setmachineData(response.data.machines_data || []);
      setpersonData(response.data.persons_data || []);
      setdriverpersonData(response.data.driver_persons_data || []);
      setprojectData(response.data.projects_data || []);
      openModal()
    } catch (err) {
      setError('Failed to load machine details');
    }
  };

  const deleteData = async (id) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/delete_machine_maintenance/?machine_maintenance_id=${id}`
      );
      setMessages(response.data.message)
      fetchMaintenanceDetails();
      closedeleteModal();
    } catch (err) {
      setError("Failed to delete document type data")
    }
  }

  const resetForm = () => {
    setFormData({
      machine_maintenance_id: '',
      machine_machine_id: '',
      machine_maintenance_amount: '',
      machine_maintenance_date: '',
      machine_maintenance_amount_paid: false,
      machine_maintenance_amount_paid_by: '',
      machine_maintenance_types_id: '',
      machine_maintenance_details: '',
      machine_maintenance_driver_id: '',
      machine_maintenance_person_id: '',
      project_id: '',
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
        <h3>{title}</h3> {/* Display the title */}
        <div className="d-flex align-items-center mb-3">
          <Link to="/maintenance-types"><img
            src="/static/icons/troubleshooting.png"
            alt="User Icon"
            style={{ height: "30px", width: "auto" }} // Ensure consistent height
          /></Link>
          <button
            type="button"
            className="btn btn-sm btn-primary ms-2"
            onClick={openModal}
            style={{ height: "30px" }} // Adjust the height as needed
          >Add Maintenance</button>
          <div className="input-group" style={{ height: "30px", width: "auto" }}>
            <input type="text" class="form-control ms-2" style={{ height: "30px", width: "100px" }} placeholder="Search" aria-label="Recipient's username" aria-describedby="button-addon2" value={searchTerm} onChange={handleSearchChange} />
            <button className="btn btn-sm btn-outline-primary d-flex align-items-center" type="button" id="button-addon2" style={{ height: "30px", width: "auto" }}><i class="fa-solid fa-magnifying-glass"></i></button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>S.N	</th>
                <th>Machine Name</th>
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
              {filter_machineMaintenance.length > 0 ? (
                filter_machineMaintenance.map((maintenance, index) => (
                  <tr key={maintenance.machine_maintenance_id}>
                    <td>{index + 1}</td>
                    <td>{maintenance.machine_machine_id__machine_name} - {maintenance.machine_machine_id__machine_number_plate} - {maintenance.machine_machine_id__machine_types_id__machine_type_name}</td>
                    <td>{maintenance.machine_maintenance_amount || "N/A"}</td>
                    <td>{maintenance.machine_maintenance_date || "N/A"}</td>
                    <td>{maintenance.machine_maintenance_amount_paid ? "Yes" : "No"}</td>
                    <td>{maintenance.machine_maintenance_amount_paid_by || "N/A"}</td>
                    <td>{maintenance.machine_maintenance_person_id__person_name || "N/A"}</td>
                    <td>{maintenance.machine_maintenance_person_id__person_contact_number || "N/A"}</td>
                    <td>{maintenance.machine_maintenance_driver_id__person_name || "N/A"}</td>
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

              <Maintenance_types_insert fetchdata={fetchMaintenanceDetails} />
              <Person_insert fetchdata={fetchMaintenanceDetails} />

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>

                <Select
                  options={machineoptions}
                  value={machineoptions.find((option) => option.value === formData.machine_machine_id)}
                  onChange={handleMachineChange}
                  placeholder="Select Machine*"
                  isSearchable
                  isClearable
                  className="react-select-container mb-3"
                  classNamePrefix="react-select"
                />


                <div className="mb-3">
                  <label className="form-label">Maintenance Type:</label>
                  <select
                    name="machine_maintenance_types_id"
                    value={formData.machine_maintenance_types_id}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select maintenance types</option>
                    {maintenanceTypes.map((type) => (
                      <option key={type.maintenance_type_id} value={type.maintenance_type_id}>
                        {type.maintenance_type_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Maintenance Amount:</label>
                  <input
                    type="text"
                    name="machine_maintenance_amount"
                    value={formData.machine_maintenance_amount}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Maintenance Date:</label>
                  <input
                    type="date"
                    name="machine_maintenance_date"
                    value={formData.machine_maintenance_date}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="">
                  <input
                    type="checkbox"
                    name="machine_maintenance_amount_paid"
                    checked={formData.machine_maintenance_amount_paid}
                    onChange={handleChange}
                    className="form-check-input"
                    id="machine_maintenance_amount_paid"
                  />
                  <label className="form-label ms-2" for="machine_maintenance_amount_paid">Amount Paid:</label>
                </div>

                <div className="mb-3">
                  <label className="form-label">Paid By:</label>
                  <select
                    name="machine_maintenance_amount_paid_by"
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Machine_Owner">Machine Owner</option>
                    <option value="Pinak_Enterprise">Pinak Enterprise</option>
                    <option value="Pinak">Pinak</option>
                  </select>
                </div>


                <Select
                  options={repairpersonoptions}
                  value={machineoptions.find((option) => option.value === formData.machine_maintenance_person_id)}
                  onChange={handleRepairPersonChange}
                  placeholder="Select Repair Person*"
                  isSearchable
                  isClearable
                  className="react-select-container mb-3"
                  classNamePrefix="react-select"
                />

                <Select
                  options={driverpersonoptions}
                  value={machineoptions.find((option) => option.value === formData.machine_maintenance_driver_id)}
                  onChange={handleDriverPersonChange}
                  placeholder="Select Driver Person*"
                  isSearchable
                  isClearable
                  className="react-select-container mb-3"
                  classNamePrefix="react-select"
                />

                <Select
                  options={projectoptions}
                  value={machineoptions.find((option) => option.value === formData.project_id)}
                  onChange={handleProjectChange}
                  placeholder="Select Project*"
                  isSearchable
                  isClearable
                  className="react-select-container mb-3"
                  classNamePrefix="react-select"
                />



                <div className="mb-3">
                  <label className="form-label">Details:</label>
                  <textarea
                    name="machine_maintenance_details"
                    value={formData.machine_maintenance_details}
                    onChange={handleChange}
                    className="form-control"
                  ></textarea>
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
              are you sure You want to delete this data?<br />

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
