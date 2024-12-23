import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from 'bootstrap';
import Select from 'react-select';


const ProjectMachines = ({project_id}) => {
    const [ProjectMachineData, setProjectMachineData] = useState([]);
    const [MachineMaintenanceData, setMachineMaintenanceData] = useState([]);
    const [maintenanceTotalAmount, setmaintenanceTotalAmount] = useState([]);
    const [MachineData, setMachineData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [WorkTypeData, setWorkTypeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState("");
    const modalRef = useRef();
    const maintenancemodalRef = useRef();
    const deletemodel = useRef();
    const [delid, setdelid] = useState("");
    const [Messages, setMessages] = useState('');


    const [maintenanceTypes, setMaintenanceTypes] = useState([]);
    const [machineData, setmachineData] = useState([]);
    const [personData, setpersonData] = useState([]);
    const [driverpersonData, setdriverpersonData] = useState([]);
    const [projectData, setprojectData] = useState([]);

    const [formData, setFormData] = useState({
        project_machine_data_id: "",
        project_machine_date: "",
        machine_project_id: "",
        work_type_id: "",
        project_machine_data_work_number: "",
        project_machine_data_work_price: "",
        project_machine_data_total_amount: "",
        project_machine_data_work_details: "",
        project_machine_data_more_details: "",
        project_id: project_id

    });

    const machineoptions = machineData.map((machine) => ({
        value: machine.machine_id,
        label: machine.machine_name,
      }));
    
    const handleMachineChange = (selectedOption) => {
        setmaintenanceformData({
          ...maintenanceformData,
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
        setmaintenanceformData({
        ...maintenanceformData,
        machine_maintenance_driver_id: selectedOption ? selectedOption.value : "",
    });
    };
    
    const handleRepairPersonChange = (selectedOption) => {
        setmaintenanceformData({
        ...maintenanceformData,
        machine_maintenance_person_id: selectedOption ? selectedOption.value : "",
    });
    };
    
    const projectoptions = projectData.map((x) => ({
    value: x.project_id,
    label: x.project_name,
    }));
    
    const handleProjectChange = (selectedOption) => {
        setmaintenanceformData({
        ...maintenanceformData,
        project_id: selectedOption ? selectedOption.value : "",
    });
    };

    const [maintenanceformData, setmaintenanceformData] = useState({
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
      });


    const resetmaintenanceForm = () => {
        setmaintenanceformData({
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
    });
    };

    const openMaintenanceModal = () => {
        const modalInstance = new Modal(maintenancemodalRef.current);
        modalInstance.show();
    };

    const closeMaintenanceModal = () => {
        const modalInstance = Modal.getInstance(maintenancemodalRef.current);
        if (modalInstance) {
            modalInstance.hide();
        }
    };

    const handlemaintenanceChange = (e) => {
        const { name, value, type, checked } = e.target;
        setmaintenanceformData((prevData) => ({
          ...prevData,
          [name]: type === 'checkbox' ? checked : value,

        }));
      };

    const handlemaintenanSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post(
            `http://127.0.0.1:8000/insert_update_machine_maintenance/?project_id=${project_id}`,
            maintenanceformData
          );
          if (response.status === 200) {
            fetchProjectMachines();
            resetmaintenanceForm();
            closeMaintenanceModal();
          } else {
            alert('Failed to save maintenance details.');
          }
        } catch (err) {
          alert('Error occurred while saving machine details.');
        }
    
      };

    const fetchProjectMachines = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/show_project_machine/?project_id=${project_id}`);
            setProjectMachineData(response.data.data || []);
            setTotalAmount(response.data.total_amount || 0);
            setMachineData(response.data.machines_data || []);
            setWorkTypeData(response.data.work_types_data || []);


            setMachineMaintenanceData(response.data.machine_maintenance_data || []);
            setmaintenanceTotalAmount(response.data.maintenance_total_amount)
            setMaintenanceTypes(response.data.maintenance_types_data || []);
            setmachineData(response.data.machines_data || []);
            setpersonData(response.data.persons_data || []);
            setdriverpersonData(response.data.driver_persons_data || []);
            setprojectData(response.data.projects_data || []);
            setTitle(response.data.title)
            setLoading(false);
        } catch (err) {
            setError('Failed to load project machine details');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectMachines();
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/insert_update_project_machine/',
                formData
            );
            if (response.status === 200) {
                alert(response.data.message);
                fetchProjectMachines();
                resetForm();
                closeModal();
            } else {
                alert('Failed to save project machine data.');
            }
        } catch (err) {
            alert('Error occurred while saving project machine data.');
        }
    };

    const editProjectMachine = async (id) => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/insert_update_project_machine/?getdata_id=${id}`
            );
            setFormData(response.data.data);
            setMachineData(response.data.machines_data || []);
            setWorkTypeData(response.data.work_types_data || []);
            openModal();
        } catch (err) {
            alert('Failed to load project machine data');
        }
    };

    const resetForm = () => {
        setFormData({
            project_machine_data_id: "",
            project_machine_date: "",
            machine_project_id: "",
            work_type_id: "",
            project_machine_data_work_number: "",
            project_machine_data_work_price: "",
            project_machine_data_total_amount: "",
            project_machine_data_work_details: "",
            project_machine_data_more_details: "",
            
        });
    };

    

    const openModal = () => {
        const modalInstance = new Modal(modalRef.current);
        modalInstance.show();
    };

    const closeModal = () => {
        const modalInstance = Modal.getInstance(modalRef.current);
        if (modalInstance) {
            modalInstance.hide();
        }
    };

    const closedeleteModal = () => {
        const modalInstance = Modal.getInstance(deletemodel.current);
        if (modalInstance) {
            modalInstance.hide();
        }
    };

    const openDeleteModal = (id) => {
        const modalInstance = new Modal(deletemodel.current);
        setdelid(id);
        modalInstance.show();

    };

    const deleteData = async (id) => {
        try {
            const response = await axios.delete(
                `http://127.0.0.1:8000/delete_project_machine/?project_machine_data_id=${id}`
            );
            setMessages(response.data.message)
            fetchProjectMachines();
            closedeleteModal();
        } catch (err) {
            setError("Failed to delete project machine data")
        }
    }

    // Show loading message while data is being fetched
    if (loading) {
        return <div>Loading...</div>;
    }

    // Show error message if fetching data failed
    if (error) {
        return <div>{error}</div>;
    }

    // Render the materials table
    return (
        <>
            <div>
                {Messages && <div class="alert alert-success alert-dismissible fade show" role="alert">{Messages}</div>}
                <button
                    type="button"
                    className="btn btn-sm mb-1 mt-3 btn-primary"
                    onClick={openModal}
                >
                    Add Project Machine Data
                </button>
                <button
                    type="button"
                    className="btn btn-sm mb-1 mt-3 btn-primary ms-2"
                    onClick={openMaintenanceModal}
                >
                    Add Machine Maintenance
                </button>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-3">
                <div className="card">
                    <h6 className='mb-2'>PROJECT Machines</h6>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>S.N</th>
                                <th>Date</th>
                                <th>Machine Name</th>
                                <th>Work Type</th>
                                <th>Work Number</th>
                                <th>Work Price</th>
                                <th>Total Amount</th>
                                <th>Work Details</th>
                                <th>More Details</th>
                                <th>Update</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ProjectMachineData.length > 0 ? (
                                ProjectMachineData.map((detail, index) => (
                                    <tr key={detail.project_machine_data_id}>
                                        <td>{index + 1 || "N/A"}</td>
                                        <td>{detail.project_machine_date || "N/A"}</td>
                                        <td>
                                            {detail.machine_project_id__machine_name || "N/A"}
                                        </td>
                                        <td>
                                            {detail.work_type_id__work_type_name || "N/A"}
                                        </td>
                                        <td>{detail.project_machine_data_work_number || "N/A"}</td>
                                        <td>{detail.project_machine_data_work_price || "N/A"}</td>
                                        <td>{detail.project_machine_data_total_amount || "N/A"}</td>
                                        <td>{detail.project_machine_data_work_details || "N/A"}</td>
                                        <td>{detail.project_machine_data_more_details || "N/A"}</td>
                                        <td>
                                            <i
                                                className="fa-regular fa-pen-to-square"
                                                onClick={() => editProjectMachine(detail.project_machine_data_id)}
                                            ></i>
                                        </td>
                                        <td>
                                            <i
                                                className="fa-regular fa-trash-can"
                                                onClick={() => openDeleteModal(detail.project_machine_data_id)}
                                            ></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" style={{ textAlign: "center" }}>
                                        No project machine data available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className='font-semibold text-base text-green-800'>Total Amount: <i class="fa-solid fa-indian-rupee-sign"></i>{totalAmount}</div>
                    </div>
                </div>

                <div className="card">
                <h6 className='mb-2'>MACHINE Maintenance</h6>
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
                {/* <th>Update</th>
                <th>Remove</th> */}
              </tr>
            </thead>
            <tbody>
              {MachineMaintenanceData.length > 0 ? (
                MachineMaintenanceData.map((maintenance, index) => (
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
                    {/* <td><i className="fa-regular fa-pen-to-square" onClick={() => editDetailsGetData(maintenance.machine_maintenance_id)}></i></td>
                    <td><i class="fa-regular fa-trash-can" onClick={() => opendeleteModal(maintenance.machine_maintenance_id)}></i></td> */}
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
          <div className='font-semibold text-base text-green-800'>Total Amount: <i class="fa-solid fa-indian-rupee-sign"></i>{maintenanceTotalAmount}</div>
        </div>

                </div>

                </div>
            </div>
            <div
                className="modal fade"
                id="materialModal"
                tabIndex="-1"
                ref={modalRef}
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {formData.project_machine_data_id ? 'Edit Project-Machine' : 'Add Project-Machine'}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={closeModal}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="workNoInput" className="form-label">Enter Date here*</label>
                                    <input
                                        type="date"
                                        name="project_machine_date"
                                        value={formData.project_machine_date}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <select
                                        name="machine_project_id"
                                        value={formData.machine_project_id}
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Select Machine*</option>
                                        {MachineData.map((type) => (
                                            <option
                                                key={type.machine_id}
                                                value={type.machine_id}
                                            >
                                                {type.machine_name} {type.machine_number_plate}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <select
                                        name="work_type_id"
                                        value={formData.work_type_id}
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Select Work Type*</option>
                                        {WorkTypeData.map((type) => (
                                            <option
                                                key={type.work_type_id}
                                                value={type.work_type_id}
                                            >
                                                {type.work_type_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <input
                                        id="priceInput"
                                        type="text"
                                        name="project_machine_data_work_number"
                                        value={formData.project_machine_data_work_number}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter Work Number*"
                                        required
                                    />
                                </div>

                                {/* Price Field */}
                                <div className="mb-3">
                                    <input
                                        id="priceInput"
                                        type="text"
                                        name="project_machine_data_work_price"
                                        value={formData.project_machine_data_work_price}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter Price*"
                                        required
                                    />
                                </div>

                              

                                {/* Details Textarea */}
                                <div className="mb-3">
                                    <label htmlFor="detailsTextarea" className="form-label">Work Details</label>
                                    <textarea
                                        id="detailsTextarea"
                                        name="project_machine_data_work_details"
                                        value={formData.project_machine_data_work_details}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter additional details (optional)"
                                    ></textarea>
                                </div>

                                {/* Details Textarea */}
                                <div className="mb-3">
                                    <label htmlFor="detailsTextarea" className="form-label">More Details</label>
                                    <textarea
                                        id="detailsTextarea"
                                        name="project_machine_data_more_details"
                                        value={formData.project_machine_data_more_details}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter more details (optional)"
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">
                                        Submit
                                    </button>
                                </div>

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
                                Delete Material Data
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





        <div
        className="modal fade"
        id="maintenanceModal"
        tabIndex="-1"
        aria-labelledby="maintenanceModalLabel"
        aria-hidden="true"
        ref={maintenancemodalRef}
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
              <form onSubmit={handlemaintenanSubmit}>

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
                    onChange={handlemaintenanceChange}
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
                    onChange={handlemaintenanceChange}
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Maintenance Date:</label>
                  <input
                    type="date"
                    name="machine_maintenance_date"
                    value={formData.machine_maintenance_date}
                    onChange={handlemaintenanceChange}
                    className="form-control"
                  />
                </div>

                <div className="">
                  <input
                    type="checkbox"
                    name="machine_maintenance_amount_paid"
                    checked={formData.machine_maintenance_amount_paid}
                    onChange={handlemaintenanceChange}
                    className="form-check-input"
                    id="machine_maintenance_amount_paid"
                  />
                  <label className="form-label ms-2" for="machine_maintenance_amount_paid">Amount Paid:</label>
                </div>

                <div className="mb-3">
                  <label className="form-label">Paid By:</label>
                  <select
                    name="machine_maintenance_amount_paid_by"
                    onChange={handlemaintenanceChange}
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
                    onChange={handlemaintenanceChange}
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

        </>
    );
};

export default ProjectMachines;
