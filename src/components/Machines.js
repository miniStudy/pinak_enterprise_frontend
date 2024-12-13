import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
import { Link } from 'react-router-dom';
const Machines = () => {
    const [machinesDetails, setMachinesDetails] = useState([]);
    const [projectmachineData, setprojectmachineData] = useState([]);
    const [FilterMachineName, setFilterMachineName] = useState('');
    const [totalProjectMachineAmount, settotalProjectMachineAmount] = useState([]);
    const [machinemaintenanceData, setmachinemaintenanceData] = useState([]);
    const [totalMachineMaintenance, settotalMachineMaintenance] = useState([]);
    const [profitlossonmachine, setprofitlossonmachine] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const [machine_types, setmachine_types] = useState([]);
    const modalRef = useRef();
    const deletemodel = useRef();
    const [delid, setdelid] = useState("");
    const [Messages, setMessages] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };


    // Filter data based on search term
    const filter_machinesDetails = machinesDetails.filter((item) => {

        const matchesSearchTerm =
                (item?.machine_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item?.machine_number_plate?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item?.machine_register_date?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item?.machine_own?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item?.machine_condition?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item?.machine_types_id__machine_type_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item?.machine_owner_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item?.machine_owner_contact?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item?.machine_buy_price?.toLowerCase().includes(searchTerm.toLowerCase()));
                (item?.machine_buy_date?.toLowerCase().includes(searchTerm.toLowerCase()));
                (item?.machine_sold_price?.toLowerCase().includes(searchTerm.toLowerCase()));
                (item?.machine_sold_out_date?.toLowerCase().includes(searchTerm.toLowerCase()));
        
            return matchesSearchTerm;
        });


    // Form state for Add/Edit
    const [formData, setFormData] = useState({
        machine_id: '',
        machine_name: '',
        machine_number_plate: '',
        machine_register_date: '',
        machine_own: '',
        machine_condition: '',
        machine_working: true,
        machine_types_id: '',
        machine_details: '',
        machine_owner_name: '',
        machine_owner_contact: '',
        machine_buy_price: '',
        machine_buy_date: '',
        machine_sold_price: '',
        machine_sold_out_date: '',
        machine_other_details: '',
    });

 


    // Fetch machine details
    const fetchMachines = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/show_machines/');
            setMachinesDetails(response.data.data || []);
            setmachine_types(response.data.machine_types || []);
            setTitle(response.data.title);
            setLoading(false);
        } catch (err) {
            setError('Failed to load machine details');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMachines();
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
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle form submission for Add/Update
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/insert_update_machine/',
                formData
            );
            if (response.status === 200) {
                alert('Machine details saved successfully!');
                fetchMachines(); // Reload data
                resetForm();
                closeModal();
            } else {
                alert('Failed to save machine details.');
            }
        } catch (err) {
            console.error('Error:', err);
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
                `http://127.0.0.1:8000/insert_update_machine/?getdata_id=${id}`
            );
            setFormData(response.data.data);
            setmachine_types(response.data.machine_types || []);
            openModal()
        } catch (err) {
            setError('Failed to load machine details');
        }
    };


const displayData = async (id, machine_name) => {
    try {
        const projectResponse = await axios.get(
            `http://127.0.0.1:8000/show_project_machine/?machine_id=${id}`
        );

        const maintenanceResponse = await axios.get(
            `http://127.0.0.1:8000/show_machine_maintenance/?machine_id=${id}`
        );

        // Calculate totals for project machine data
        const projectData = projectResponse.data.data || [];
        const totalProjectAmount = projectData.reduce(
            (sum, x) => sum + parseFloat(x.project_machine_data_total_amount || 0),
            0
        );

        // Calculate totals for maintenance data
        const maintenanceData = maintenanceResponse.data.data || [];
        const totalMaintenanceAmount = maintenanceData.reduce(
            (sum, x) => sum + parseFloat(x.machine_maintenance_amount || 0),
            0
        );

        // Set the project and maintenance data to state
        setprojectmachineData(projectData);
        setmachinemaintenanceData(maintenanceData);
        setFilterMachineName(machine_name);
        settotalProjectMachineAmount(totalProjectAmount);
        settotalMachineMaintenance(totalMaintenanceAmount);


        // Calculate profit/loss and display it
        const profitLoss = totalProjectAmount - totalMaintenanceAmount;
        setprofitlossonmachine(profitLoss);

    } catch (err) {
        setError('Failed to load maintenance details.');
        setLoading(false);
    }
};

    const deleteData = async (id) => {
        try {
            const response = await axios.delete(
                `http://127.0.0.1:8000/delete_machine/?machine_id=${id}`
            );
            setMessages(response.data.message)
            fetchMachines();
            closedeleteModal();
        } catch (err) {
            setError("Failed to delete document type data")
        }
    }

    // Reset the form state
    const resetForm = () => {
        setFormData({
            machine_id: '',
            machine_name: '',
            machine_number_plate: '',
            machine_register_date: '',
            machine_own: '',
            machine_condition: '',
            machine_working: true,
            machine_types_id: '',
            machine_details: '',
            machine_owner_name: '',
            machine_owner_contact: '',
            machine_buy_price: '',
            machine_buy_date: '',
            machine_sold_price: '',
            machine_sold_out_date: '',
            machine_other_details: '',
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
                <div className="d-flex align-items-center mb-3">
    <Link to="/machine-types"><img 
        src="/static/icons/machine_type.png" 
        alt="User Icon" 
        style={{ height: "30px", width: "auto" }} // Ensure consistent height
    /></Link>
        <button
        type="button"
        className="btn btn-sm btn-primary ms-2"
        onClick={openModal}
        style={{ height: "30px" }} // Adjust the height as needed
    >Add Machine</button>
    <div className="input-group" style={{ height: "30px", width: "auto" }}>
        <input type="text" class="form-control ms-2" style={{ height: "30px", width: "100px" }} placeholder="Search" aria-label="Recipient's username" aria-describedby="button-addon2" value={searchTerm} onChange={handleSearchChange} />
         <button className="btn btn-sm btn-outline-primary d-flex align-items-center" type="button" id="button-addon2" style={{ height: "30px", width: "auto" }}><i class="fa-solid fa-magnifying-glass"></i></button>
    </div>
        </div>
                <div className="table-responsive">
        <table className="table table-hover">
                
                    <thead>
                        <tr>
                            <th>Machine ID</th>
                            <th>Machine Name</th>
                            <th>Machine Own</th>
                            <th>Number Plate</th>
                            <th>Register Date</th>
                            <th>Owner's Name</th>
                            <th>Contact Number</th>
                            <th>Machine Condition</th>
                            <th>Machine Type</th>
                            <th>Machine Details</th>
                            <th>Purchase Price</th>
                            <th>Purchase Date</th>
                            <th>Sold Price</th>
                            <th>Sold Out Date</th>
                            <th>Other Details</th>
                            <th>Machine Working</th>
                            <th>Update</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filter_machinesDetails.length > 0 ? (
                            filter_machinesDetails.map((y) => (
                                <tr key={y.machine_id}>
                                    <td>{y.machine_id || "N/A"}</td>

                                    <td onClick={() => displayData(y.machine_id, `Machine - ${y.machine_name} ${y.machine_number_plate} ${y.machine_types_id__machine_type_name}`)}>{y.machine_name || "N/A"}</td>
                                    <td>{y.machine_own || "N/A"}</td>
                                    <td>{y.machine_number_plate || "N/A"}</td>
                                    <td>{y.machine_register_date || "N/A"}</td>
                                    <td>{y.machine_owner_name || "N/A"}</td>
                                    <td>{y.machine_owner_contact || "N/A"}</td>
                                    <td>{y.machine_condition || "N/A"}</td>
                                    <td>{y.machine_types_id__machine_type_name || "N/A"}</td>
                                    <td>{y.machine_details || "N/A"}</td>
                                    <td>{y.machine_buy_price || "N/A"}</td>
                                    <td>{y.machine_buy_date || "N/A"}</td>
                                    <td>{y.machine_sold_price || "N/A"}</td>
                                    <td>{y.machine_sold_out_date || "N/A"}</td>
                                    <td>{y.machine_other_details || "N/A"}</td>
                                    <td>{y.machine_working ? "Yes" : "No"}</td>
                                    <td>
                                        <i
                                            className="fa-regular fa-pen-to-square"
                                            onClick={() => editDetailsGetData(y.machine_id)}
                                        ></i>
                                    </td>
                                    <td>
                                        <i className="fa-regular fa-trash-can" onClick={() => opendeleteModal(y.machine_id)}></i>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="18">No machine details available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                    </div>
            </div>
        {FilterMachineName && (
            <div className='mt-3'> 
            <h5>{FilterMachineName}</h5>
            <h5>{profitlossonmachine > 0 ? <span className='text-success'>Profit: <i class="fa-solid fa-indian-rupee-sign"></i> {profitlossonmachine}</span> : <span className='text-danger'>Loss: <i class="fa-solid fa-indian-rupee-sign"></i> {profitlossonmachine}</span>}</h5>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-3">
                    <div className="card">
                        <h5>Machine Earning</h5>
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>S.N</th>
                                        <th>Date</th>
                                        <th>Work Type</th>
                                        <th>Work No.</th>
                                        <th>Price</th>
                                        <th>Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projectmachineData.length > 0 ? (
                                        projectmachineData.map((x, index) => (
                                            <tr key={x.project_machine_data_id}>
                                                <td>{index + 1}</td>
                                                <td>{x.project_machine_date || "N/A"}</td>
                                                <td>{x.work_type_id__work_type_name || "N/A"}</td>
                                                <td>{x.project_machine_data_work_number || "N/A"}</td>
                                                <td>{x.project_machine_data_work_price || "N/A"}</td>
                                                <td>{x.project_machine_data_total_amount || "N/A"}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9">No data available.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <div className='font-semibold text-base'>Total Amt: <i class="fa-solid fa-indian-rupee-sign"></i>{totalProjectMachineAmount}</div>
                        </div>
                    </div>
    
                    <div className="card">
                        <h5>Machine Maintenance Cost</h5>
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>S.N</th>
                                        <th>Date</th>
                                        <th>Type Name</th>
                                        <th>Amount</th>
                                        <th>Paid By</th>
                                        <th>Maintenance Person</th>
                                        <th>Driver</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {machinemaintenanceData.length > 0 ? (
                                        machinemaintenanceData.map((x, index) => (
                                            <tr key={x.machine_maintenance_id}>
                                                <td>{index + 1}</td>
                                                <td>{x.machine_maintenance_date || "N/A"}</td>
                                                <td>{x.machine_maintenance_types_id__maintenance_type_name || "N/A"}</td>
                                                <td>{x.machine_maintenance_amount || "N/A"}</td>
                                                <td>{x.machine_maintenance_amount_paid_by || "N/A"}</td>
                                                <td>{x.machine_maintenance_person_id__person_name || "N/A"}</td>
                                                <td>{x.machine_maintenance_driver_name || "N/A"}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9">No data available.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <div className='font-semibold text-base'>Total Amt: <i class="fa-solid fa-indian-rupee-sign"></i>{totalMachineMaintenance}</div>
    
                        </div>
                    </div>
    
    
                </div>
            </div>
        )}
        
          

            {/* Modal for Add/Edit Machine */}
            <div
                className="modal fade"
                id="machineModal"
                tabIndex="-1"
                aria-labelledby="machineModalLabel"
                aria-hidden="true"
                ref={modalRef}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="machineModalLabel">
                                {formData.machine_id ? 'Edit Machine' : 'Add Machine'}
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

                                <div className='mb-3'>
                                    <input
                                        type="text"
                                        name="machine_name"
                                        value={formData.machine_name}
                                        onChange={handleChange}
                                        placeholder='Machine Name'
                                        className='form-control'
                                    />
                                </div>

                                <div className='mb-3'>
                                    <select name="machine_own" value={formData.machine_own} onChange={handleChange} className='form-select'>
                                        <option value="">Company/Rended</option>
                                        <option value="Company">Company</option>
                                        <option value="Rented">Rented</option>
                                    </select>
                                </div>

                                <div className='mb-3'>
                                    <input
                                        type="text"
                                        name="machine_owner_name"
                                        value={formData.machine_owner_name}
                                        onChange={handleChange}
                                        className='form-control'
                                        placeholder='Machine Owner Name'
                                    />
                                </div>

                                <div className='mb-3'>
                                    <input
                                        type="text"
                                        name="machine_owner_contact"
                                        value={formData.machine_owner_contact}
                                        onChange={handleChange}
                                        placeholder='Contact Number'
                                        className='form-control'
                                    />
                                </div>

                                <div className='mb-3'>
                                    <input
                                        type="date"
                                        name="machine_register_date"
                                        value={formData.machine_register_date}
                                        onChange={handleChange}
                                        className='form-control'
                                    />
                                </div>

                                <div className='mb-3'>
                                    <select name="machine_condition" value={formData.machine_condition} onChange={handleChange} className='form-select'>
                                        <option value="">New/Second-hand</option>
                                        <option value="New">New</option>
                                        <option value="Second_hand">Second hand</option>
                                    </select>
                                </div>

                                <div className='mb-3'>
                                    <input
                                        type="text"
                                        name="machine_number_plate"
                                        value={formData.machine_number_plate}
                                        onChange={handleChange}
                                        placeholder='Number Plate'
                                        className='form-control'
                                    />
                                </div>

                                

                                <div className='mb-3'>
                                    <input
                                        type="number"
                                        name="machine_buy_price"
                                        value={formData.machine_buy_price}
                                        onChange={handleChange}
                                        className='form-control'
                                        placeholder='Buy Price'
                                    />
                                </div>

                                <div className='mb-3'>
                                    <input
                                        type="date"
                                        name="machine_buy_date"
                                        value={formData.machine_buy_date}
                                        onChange={handleChange}
                                        className='form-control'
                                        placeholder='Buy Date'
                                    />
                                </div>

                                <div className='mb-3'>
                                    <input
                                        type="date"
                                        name="machine_sold_out_date"
                                        value={formData.machine_sold_out_date}
                                        onChange={handleChange}
                                        className='form-control'
                                        placeholder='Sold Date'
                                    />
                                </div>

                                <div className='mb-3'>
                                    <input
                                        type="number"
                                        name="machine_sold_price"
                                        value={formData.machine_sold_price}
                                        onChange={handleChange}
                                        placeholder='sold Price'
                                        className='form-control'
                                    />
                                </div>

    

                                <div className="mb-3">
                    <div class="form-check">
                    <input class="form-check-input" onChange={handleChange} checked={formData.machine_working} name="machine_working" type="checkbox" id="flexCheckChecked" />
                    <label class="form-check-label" for="flexCheckChecked">
                      Machine is Working
                    </label>
                  </div>
                </div>

                                <div className='mb-3'>
                                    <select name="machine_types_id" value={formData.machine_types_id} onChange={handleChange} className='form-select' required>
                                        <option value="">machine type</option>
                                        {machine_types.length > 0 ? (
                                            machine_types.map((x) => (
                                                <option key={x.machine_type_id} value={x.machine_type_id}>
                                                    {x.machine_type_name}
                                                </option>
                                            ))
                                        ) : (
                                            <></>
                                        )}
                                    </select>
                                </div>

                                <div className='mb-3'>
                                    <textarea
                                        className='form-control'
                                        name="machine_details"
                                        value={formData.machine_details}
                                        onChange={handleChange}
                                        
                                    ></textarea>
                                </div>

                                <div className='mb-3'>
                                    <textarea
                                        name="machine_other_details"
                                        value={formData.machine_other_details}
                                        onChange={handleChange}
                                        className='form-control'
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn btn-sm btn-primary">
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
                                Delete Company-Machine Data
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

export default Machines;