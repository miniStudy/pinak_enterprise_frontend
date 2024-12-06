import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';

const MoneyCreditDebit = () => {
    const [MoneyCreditDebit, setMoneyCreditDebit] = useState([]);
    const [PersonData, setPersonData] = useState([]);
    const [PayTypeData, setPayTypeData] = useState([]);
    const [MachineData, setMachineData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const modalRef = useRef();
    const deletemodel = useRef();
    const [delid, setdelid] = useState("");
    const [Messages, setMessages] = useState('');

    // Form state for Add/Edit
    const [formData, setFormData] = useState({
        money_id: '',
        money_credit_debit: '',
        person_id: '',
        pay_type_id: '',
        money_payment_mode: '',
        money_amount: '',
        money_date: '',
        money_sender_bank_name: '',
        money_sender_bank_account_no: '',
        money_sender_ifsc_code: '',
        money_sender_cheque_no: '',
        money_receiver_bank_name: '',
        money_receiver_bank_account_no: '',
        money_receiver_ifsc_code: '',
        money_payment_details: '',
        machine_id: '',
    });


    // Fetch machine details
    const fetchMoneyCreditDebit = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/show_money_debit_credit/');
            setMoneyCreditDebit(response.data.data || []);
            setPersonData(response.data.persons_data || []);
            setPayTypeData(response.data.pay_types_data || []);
            setMachineData(response.data.machines_data || []);
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
            money_credit_debit: '',
            person_id: '',
            pay_type_id: '',
            money_payment_mode: '',
            money_amount: '',
            money_date: '',
            money_sender_bank_name: '',
            money_sender_bank_account_no: '',
            money_sender_ifsc_code: '',
            money_sender_cheque_no: '',
            money_receiver_bank_name: '',
            money_receiver_bank_account_no: '',
            money_receiver_ifsc_code: '',
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
                <h1>{title}</h1>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={openModal}
                >
                    Add Machine
                </button>
                <table>
                    <thead>
                        <tr>
                            <th>S.N</th>
                            <th>Credit/Debit</th>
                            <th>Person</th>
                            <th>Payment Type</th>
                            <th>Payment Mode</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Sender Bank Name</th>
                            <th>Sender Bank Account No</th>
                            <th>Sender IFSC Code</th>
                            <th>Sender Cheque No</th>
                            <th>Receiver Bank Name</th>
                            <th>Receiver Bank Account No</th>
                            <th>Receiver IFSC Code</th>
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
                                    <td>{y.money_credit_debit || "N/A"}</td>
                                    <td>{y.person_id__person_name || "N/A"}</td>
                                    <td>{y.pay_type_id__pay_type_name || "N/A"}</td>
                                    <td>{y.money_payment_mode || "N/A"}</td>
                                    <td>{y.money_amount || "N/A"}</td>
                                    <td>{y.money_date || "N/A"}</td>
                                    <td>{y.money_sender_bank_name || "N/A"}</td>
                                    <td>{y.money_sender_bank_account_no || "N/A"}</td>
                                    <td>{y.money_sender_ifsc_code || "N/A"}</td>
                                    <td>{y.money_sender_cheque_no || "N/A"}</td>
                                    <td>{y.money_receiver_bank_name || "N/A"}</td>
                                    <td>{y.money_receiver_bank_account_no || "N/A"}</td>
                                    <td>{y.money_receiver_ifsc_code || "N/A"}</td>
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
                                <div>
                                    <label>Credit/Debit:</label>
                                    <select
                                        name="money_credit_debit"
                                        value={formData.money_credit_debit}
                                        onChange={handleChange}
                                    >
                                        <option value="CREDIT">CREDIT</option>
                                        <option value="DEBIT">DEBIT</option>
                                    </select>
                                </div>

                                <div>
                                    <label>Person:</label>
                                    <select name="person_id" value={formData.person_id} onChange={handleChange}>
                                        <option value="">Select person</option>
                                        {PersonData.length > 0 ? (
                                            PersonData.map((x) => (
                                                <option key={x.person_id} value={x.person_id}>
                                                    {x.person_name}
                                                </option>
                                            ))
                                        ) : (
                                            <option>Data not available</option>
                                        )}
                                    </select>
                                </div>

                                <div>
                                    <label>Pay Type:</label>
                                    <select name="pay_type_id" value={formData.pay_type_id} onChange={handleChange}>
                                        <option value="">Select pay type</option>
                                        {PayTypeData.length > 0 ? (
                                            PayTypeData.map((x) => (
                                                <option key={x.pay_type_id} value={x.pay_type_id}>
                                                    {x.pay_type_name}
                                                </option>
                                            ))
                                        ) : (
                                            <option>Data not available</option>
                                        )}
                                    </select>
                                </div>

                                <div>
                                    <label>Payment Mode:</label>
                                    <select
                                        name="money_payment_mode"
                                        value={formData.money_payment_mode}
                                        onChange={handleChange}
                                    >
                                        <option value="CASH">CASH</option>
                                        <option value="BANK">BANK</option>
                                    </select>
                                </div>

                                <div>
                                    <label>Amount:</label>
                                    <input
                                        type="text"
                                        name="money_amount"
                                        value={formData.money_amount}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label>Date:</label>
                                    <input
                                        type="date"
                                        name="money_date"
                                        value={formData.money_date}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label>Sender's Bank Name:</label>
                                    <input
                                        type="text"
                                        name="money_sender_bank_name"
                                        value={formData.money_sender_bank_name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label>Sender's Bank Account No:</label>
                                    <input
                                        type="text"
                                        name="money_sender_bank_account_no"
                                        value={formData.money_sender_bank_account_no}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label>Sender's IFSC Code:</label>
                                    <input
                                        type="text"
                                        name="money_sender_ifsc_code"
                                        value={formData.money_sender_ifsc_code}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label>Sender's Cheque No:</label>
                                    <input
                                        type="text"
                                        name="money_sender_cheque_no"
                                        value={formData.money_sender_cheque_no}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label>Receiver's Bank Name:</label>
                                    <input
                                        type="text"
                                        name="money_receiver_bank_name"
                                        value={formData.money_receiver_bank_name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label>Receiver's Bank Account No:</label>
                                    <input
                                        type="text"
                                        name="money_receiver_bank_account_no"
                                        value={formData.money_receiver_bank_account_no}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label>Receiver's IFSC Code:</label>
                                    <input
                                        type="text"
                                        name="money_receiver_ifsc_code"
                                        value={formData.money_receiver_ifsc_code}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label>Payment Details:</label>
                                    <textarea
                                        name="money_payment_details"
                                        value={formData.money_payment_details}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label>Machine:</label>
                                    <select name="machine_id" value={formData.machine_id} onChange={handleChange}>
                                        <option value="">Select machine</option>
                                        {MachineData.length > 0 ? (
                                            MachineData.map((x) => (
                                                <option key={x.machine_id} value={x.machine_id}>
                                                    {x.machine_name}
                                                </option>
                                            ))
                                        ) : (
                                            <option>Data not available</option>
                                        )}
                                    </select>
                                </div>
                                <button type="submit">Submit</button>
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

export default MoneyCreditDebit;