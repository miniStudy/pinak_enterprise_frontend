import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';

function Bank_cash_insert({ fetchdata }) {
    const modalRef = useRef();
    const [BankCashData, setBankCashData] = useState([]);
    const [bankData, setbankData] = useState([]);

    const [formData, setFormData] = useState({
        bank_cash_id: "",
        credit_debit: "",
        amount: "",
        bank_id: "",
        date: "",
        details: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Fetch bank cash data
    const fetchBankCashData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/show_bank_cash/');
            setBankCashData(response.data.data || []);
            setbankData(response.data.bank_details_data || []);
        } catch (err) {
            console.error("Failed to fetch bank cash data", err);
        }
    };

    useEffect(() => {
        fetchBankCashData();
    }, []);

    // Handle form submission for Add/Update
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/insert_update_bank_cash/',
                formData
            );
            if (response.status === 200) {
                fetchdata(); // Reload data
                resetForm();
                closeModal();
            } else {
                alert('Failed to save bank cash details.');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Error occurred while saving bank cash details.');
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

    const resetForm = () => {
        setFormData({
            bank_cash_id: "",
            credit_debit: "",
            amount: "",
            bank_id: "",
            date: "",
            details: "",
        });
    };

    return (
        <>
            <button
                type="button"
                className="btn btn-sm btn-primary mb-3"
                onClick={() => openModal()}
            >
                Add Bank Cash
            </button>
            <div
                className="modal fade"
                id="bankCashModal"
                tabIndex="-1"
                aria-labelledby="bankCashModalLabel"
                aria-hidden="true"
                ref={modalRef}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="bankCashModalLabel">
                                {formData.bank_cash_id ? 'Edit Bank Cash' : 'Add Bank Cash'}
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
                                    <label className="form-label">Credit/Debit:</label>
                                    <select
                                        className="form-select"
                                        name="credit_debit"
                                        value={formData.credit_debit}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="Credit">Credit</option>
                                        <option value="Debit">Debit</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Amount:</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                

                                <div className='mb-3'>
                                    <select name="bank_id" value={formData.bank_id} onChange={handleChange} className='form-select' required>
                                        <option value="">Bank Name</option>
                                        {bankData.length > 0 ? (
                                            bankData.map((x) => (
                                                <option key={x.bank_id} value={x.bank_id}>
                                                    {x.bank_name}
                                                </option>
                                            ))
                                        ) : (
                                            <></>
                                        )}
                                    </select>
                                </div>


                                <div className="mb-3">
                                    <label className="form-label">Date:</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Details:</label>
                                    <textarea
                                        name="details"
                                        value={formData.details}
                                        onChange={handleChange}
                                        className="form-control"
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
}

export default Bank_cash_insert;