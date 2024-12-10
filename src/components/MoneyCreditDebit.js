import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
import Select from 'react-select';
import { Link } from 'react-router-dom';
const MoneyCreditDebit = () => {
    const [MoneyCreditDebit, setMoneyCreditDebit] = useState([]);
    const [PersonData, setPersonData] = useState([]);
    const [PayTypeData, setPayTypeData] = useState([]);
    const [MachineData, setMachineData] = useState([]);
    const [BankData, setBankData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const modalRef = useRef();
    const deletemodel = useRef();
    const [delid, setdelid] = useState("");
    const [Messages, setMessages] = useState('');
    const [SenderPersonId, setSenderPersonId] = useState({ person_id: '' });
    const [ReceiverPersonId, setReceiverPersonId] = useState({ person_id: '' });

    // Form state for Add/Edit
    const [formData, setFormData] = useState({
        money_id: '',
        sender_person_id: '',
        receiver_person_id: '',
        pay_type_id: '',
        money_payment_mode: '',
        money_amount: '',
        money_date: '',
        sender_bank_id: '',
        money_sender_cheque_no: '',
        receiver_bank_id: '',
        money_payment_details: '',
        machine_id: '',
    });

    const sender_options = [
        { value: "", label: "Sender Name" },
        ...PersonData.map((type) => ({
            value: type.person_id,
            label: type.person_name,
        })),
    ];

    const receiver_options = [
        { value: "", label: "Receiver Name" },
        ...PersonData.map((type) => ({
            value: type.person_id,
            label: type.person_name,
        })),
    ];

    const handleSenderChange = async (selectedOption) => {
        const newSenderId = selectedOption ? selectedOption.value : "";
        setSenderPersonId({ person_id: newSenderId }); // Update the state
        
            try {
                const response = await axios.get(`http://127.0.0.1:8000/show_money_debit_credit/?sender_id=${newSenderId}&receiver_id=${ReceiverPersonId.person_id}`);
                setMoneyCreditDebit(response.data.data || []);
            } catch (error) {
                console.error("Error fetching money debit/credit data:", error);
            }
        };

    const handleReceiverChange = async (selectedOption) => {
        const newReceiverId = selectedOption ? selectedOption.value : "";
        setReceiverPersonId({ person_id: newReceiverId }); // Update the state

            try {
                const response = await axios.get(`http://127.0.0.1:8000/show_money_debit_credit/?receiver_id=${newReceiverId}&sender_id=${SenderPersonId.person_id}`);
                setMoneyCreditDebit(response.data.data || []);
            } catch (error) {
                console.error("Error fetching money debit/credit data:", error);
            }
        };


    // Fetch machine details
    const fetchMoneyCreditDebit = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/show_money_debit_credit/');
            setMoneyCreditDebit(response.data.data || []);
            setPersonData(response.data.persons_data || []);
            setPayTypeData(response.data.pay_types_data || []);
            setMachineData(response.data.machines_data || []);
            setBankData(response.data.banks_data || []);
            setTitle(response.data.title);
            setLoading(false);
        } catch (err) {
            setError('Failed to load machine details');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMoneyCreditDebit();
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
                'http://127.0.0.1:8000/insert_update_money_debit_credit/',
                formData
            );
            if (response.status === 200) {
                alert('Money Credit Debit details saved successfully!');
                fetchMoneyCreditDebit(); // Reload data
                resetForm();
                closeModal();
            } else {
                alert('Failed to save money credit debit details.');
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
                `http://127.0.0.1:8000/insert_update_money_debit_credit/?getdata_id=${id}`
            );
            setFormData(response.data.data);
            setPersonData(response.data.persons_data || []);
            setPayTypeData(response.data.pay_types_data || []);
            setMachineData(response.data.machines_data || []);
            setBankData(response.data.banks_data || []);
            openModal()
        } catch (err) {
            setError('Failed to load machine details');
        }
    };


    const deleteData = async (id) => {
        try {
            const response = await axios.delete(
                `http://127.0.0.1:8000/delete_money_debit_credit/?money_id=${id}`
            );
            setMessages(response.data.message)
            fetchMoneyCreditDebit();
            closedeleteModal();
        } catch (err) {
            setError("Failed to delete document type data")
        }
    }

    // Reset the form state
    const resetForm = () => {
        setFormData({
            money_id: '',
            sender_person_id: '',
            receiver_person_id: '',
            pay_type_id: '',
            money_payment_mode: '',
            money_amount: '',
            money_date: '',
            sender_bank_id: '',
            money_sender_cheque_no: '',
            receiver_bank_id: '',
            money_payment_details: '',
            machine_id: '',
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
    <Link to="/person-types"><img 
        src="/static/icons/user.png" 
        alt="User Icon" 
        style={{ height: "30px", width: "auto" }} // Ensure consistent height
    /></Link>
    <button
        type="button"
        className="btn btn-sm btn-primary ms-2"
        onClick={openModal}
        style={{ height: "30px" }} // Adjust the height as needed
    >
        Add Money Credit/Debit
    </button>
    
    <div className="input-group" style={{ height: "30px", width: "auto" }}>
        <input type="text" class="form-control ms-2" style={{ height: "30px", width: "100px" }} placeholder="Search" aria-label="Recipient's username" aria-describedby="button-addon2"/>
         <button className="btn btn-sm btn-outline-primary d-flex align-items-center" type="button" id="button-addon2" style={{ height: "30px", width: "auto" }}><i class="fa-solid fa-magnifying-glass"></i></button>
    </div>

    

</div>


<Select
                options={sender_options}
                value={sender_options.find((option) => option.value === SenderPersonId.person_id)}
                onChange={handleSenderChange}
                placeholder="Select Sender"
                isSearchable
                isClearable
                className="react-select-container mb-3"
                classNamePrefix="react-select"
                styles={{width:"200px"}}
            />


            <Select
                options={receiver_options}
                value={receiver_options.find((option) => option.value === ReceiverPersonId.person_id)}
                onChange={handleReceiverChange}
                placeholder="Select Receiver"
                isSearchable
                isClearable
                className="react-select-container mb-3"
                classNamePrefix="react-select"
            />


                <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>S.N</th>
                            <th>Sender Name</th>
                            <th>Receiver Name</th>
                            <th>Amount</th>
                            <th>Payment Type</th>
                            <th>Payment Mode</th>                          
                            <th>Date</th>
                            <th>Sender Bank Name</th>
                            <th>Sender Cheque No</th>
                            <th>Receiver Bank Name</th>
                            <th>Payment Details</th>
                            <th>Machine</th>
                            <th>Update</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MoneyCreditDebit.length > 0 ? (
                            MoneyCreditDebit.map((y, index) => (
                                <tr key={y.money_id}>
                                    <td>{index+1 || "N/A"}</td>
                                    <td>{y.sender_person_id__person_name || "N/A"}</td>
                                    <td>{y.receiver_person_id__person_name || "N/A"}</td>
                                    <td>{y.money_amount || "N/A"}</td>
                                    <td>{y.pay_type_id__pay_type_name || "N/A"}</td>
                                    <td>{y.money_payment_mode || "N/A"}</td> 
                                    <td>{y.money_date || "N/A"}</td>
                                    <td>{y.sender_bank_id__bank_name || "N/A"}</td>
                                    <td>{y.money_sender_cheque_no || "N/A"}</td>
                                    <td>{y.receiver_bank_id__bank_name || "N/A"}</td>
                                    <td>{y.money_payment_details || "N/A"}</td>
                                    <td>{y.machine_id__machine_name || "N/A"}</td>
                                    <td>
                                        <i
                                            className="fa-regular fa-pen-to-square"
                                            onClick={() => editDetailsGetData(y.money_id)}
                                        ></i>
                                    </td>
                                    <td>
                                        <i className="fa-regular fa-trash-can" onClick={() => opendeleteModal(y.money_id)}></i>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="18">No money transaction details available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </div>


            </div>

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
                                {formData.money_id ? 'Edit Money Debit/Credit' : 'Add Money Debit/Credit'}
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
                                    <select name="sender_person_id" value={formData.sender_person_id} onChange={handleChange} className="form-select" required>
                                        <option value="">Select Sender-Person</option>
                                        {PersonData.length > 0 ? (
                                            PersonData.map((x) => (
                                                <option key={x.person_id} value={x.person_id}>
                                                    {x.person_name}
                                                </option>
                                            ))
                                        ) : (
                                            <></>
                                        )}
                                    </select>
                            </div>

                            <div className="mb-3">
                                    <select name="receiver_person_id" value={formData.receiver_person_id} onChange={handleChange} className="form-select" required>
                                        <option value="">Select Receiver-Person</option>
                                        {PersonData.length > 0 ? (
                                            PersonData.map((x) => (
                                                <option key={x.person_id} value={x.person_id}>
                                                    {x.person_name}
                                                </option>
                                            ))
                                        ) : (
                                            <></>
                                        )}
                                    </select>
                            </div>

                            <div className="mb-3">
                                    <input
                                        type="text"
                                        name="money_amount"
                                        value={formData.money_amount}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Amount*"
                                        required
                                    />
                                </div>


                            <div className="mb-3">
                                <select
                                    name="money_payment_mode"
                                    value={formData.money_payment_mode}
                                    onChange={handleChange}
                                    className="form-select"
                                    required
                                >   <option value="">Select Payment Mode</option>
                                    <option value="CASH">CASH</option>
                                    <option value="BANK">BANK</option>
                                </select>
                            </div>


                            <div className="mb-3">
                                    <select name="pay_type_id" value={formData.pay_type_id} onChange={handleChange} className="form-select" required>
                                        <option value="">Select Pay Type</option>
                                        {PayTypeData.length > 0 ? (
                                            PayTypeData.map((x) => (
                                                <option key={x.pay_type_id} value={x.pay_type_id}>
                                                    {x.pay_type_name}
                                                </option>
                                            ))
                                        ) : (
                                            <></>
                                        )}
                                    </select>
                            </div>

                            
                            <div className="mb-3">
                                    <input
                                        type="date"
                                        name="money_date"
                                        value={formData.money_date}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                {formData.money_payment_mode === "BANK" && (       
                                 <>    
                                <div className="mb-3">
                                    <select name="sender_bank_id" value={formData.sender_bank_id} onChange={handleChange} className="form-select">
                                        <option value="">Select Sender-Bank</option>
                                        {BankData.length > 0 ? (
                                            BankData.map((x) => (
                                                <option key={x.bank_id} value={x.bank_id}>
                                                    {x.bank_name}-{x.bank_account_number}
                                                </option>
                                            ))
                                        ) : (
                                            <></>
                                        )}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="money_sender_cheque_no"
                                        value={formData.money_sender_cheque_no}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Sender Cheque No."
                                    />
                                </div>

                                <div className="mb-3">
                                    <select name="receiver_bank_id" value={formData.receiver_bank_id} onChange={handleChange} className="form-select">
                                        <option value="">Select Receiver-Bank</option>
                                        {BankData.length > 0 ? (
                                            BankData.map((x) => (
                                                <option key={x.bank_id} value={x.bank_id}>
                                                    {x.bank_name}-{x.bank_account_number}
                                                </option>
                                            ))
                                        ) : (
                                            <></>
                                        )}
                                    </select>
                                </div>
                                </>
                                )}

                                <div className="mb-3">
                                    <textarea
                                        name="money_payment_details"
                                        value={formData.money_payment_details}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Payment Details"
                                    />
                                </div>

                                <div className="mb-3">
                                    <select name="machine_id" value={formData.machine_id} onChange={handleChange} className="form-select">
                                        <option value="">Select Machine</option>
                                        {MachineData.length > 0 ? (
                                            MachineData.map((x) => (
                                                <option key={x.machine_id} value={x.machine_id}>
                                                    {x.machine_name}
                                                </option>
                                            ))
                                        ) : (
                                            <></>
                                        )}
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-sm btn-primary">Submit</button>
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
                                Delete Money Credit/Debit Data
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

export default MoneyCreditDebit;