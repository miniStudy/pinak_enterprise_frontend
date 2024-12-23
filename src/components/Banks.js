import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from 'bootstrap';
import Bank_cash_insert from './insert_update/bank_cash_insert';
import useLanguageData from "./languagedata";

const Banks = () => {
  const { languageData } = useLanguageData([]);
  const [bankDetails, setBankDetails] = useState([]);
  const [ComapnyBankDeatils, setComapnyBankDeatils] = useState([]);
  const [CreditDebitData, setCreditDebitData] = useState([]);
  const [creditTotalAmount, setcreditTotalAmount] = useState(0);
  const [debitTotalAmount, setdebitTotalAmount] = useState(0);
  const [PersonsData, setPersonsData] = useState([]);
  const [BankCashData, setBankCashData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const modalRef = useRef();
  const deletemodel = useRef();
  const deleteModalBankCash = useRef();
  const [delid, setdelid] = useState("");
  const [delbankcashid,setdelbankcashid] = useState("")
  const [Messages, setMessages] = useState('');


  // Form states
  const [formData, setFormData] = useState({
    bank_id: "",
    bank_name: "",
    bank_branch: "",
    bank_account_number: "",
    bank_ifsc_code: "",
    bank_account_holder: "",
    bank_initial_amount: "",
    bank_open_closed: true,
    person_id: "",
    company_bank_account: "",
  });


  // Fetch bank details
  const fetchBankDetails = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/show_bank_details/"
      );
      setBankDetails(response.data.data);
      setComapnyBankDeatils(response.data.company_bank_details_data || []);
      setCreditDebitData(response.data.credit_debit_data || []);
      setcreditTotalAmount(response.data.bank_credit_total || 0);
      setdebitTotalAmount(response.data.bank_debit_total || 0);
      setPersonsData(response.data.persons || []);
      setBankCashData(response.data.bank_cash_data || []);
      setTitle(response.data.title);
      setLoading(false);
    } catch (err) {
      setError("Failed to load bank details");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankDetails();
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


  // Handle input changes for form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission for insert/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/insert_update_bank_detail/",
        formData
      );

      if (response.status === 200) {
        setMessages(response.data.message)
        fetchBankDetails(); // Reload data
        resetForm();
        closeModal();
      } else {
        alert("Failed to submit form.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error occurred while submitting form.");
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

  const opendeleteModalBankCash = (id) => {
    const modalInstance = new Modal(deleteModalBankCash.current);
    setdelbankcashid(id);
    modalInstance.show();

  };
  const closedeleteModalBankCash = () => {
    const modalInstance = Modal.getInstance(deleteModalBankCash.current);
    if (modalInstance) {
      modalInstance.hide();
    }
  };

  // Fetch data for editing a specific bank record
  const editDetailsGetData = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/insert_update_bank_detail/?getdata_id=${id}`
      );
      setFormData(response.data.data);
      setPersonsData(response.data.persons || []);
      openModal()
    } catch (err) {
      setError("Failed to load bank details");
    }
  };

  const deleteData = async (id) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/delete_bank_detail/?bank_id=${id}`
      );
      setMessages(response.data.message)
      fetchBankDetails();
      closedeleteModal();
    } catch (err) {
      setError("Failed to delete Bank Data")
    }
  }

  const deleteDataBankCash = async (id) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/delete_bank_cash/?bank_cash_id=${id}`
      );
      setMessages(response.data.message)
      fetchBankDetails();
      closedeleteModalBankCash();
    } catch (err) {
      setError("Failed to delete Bank Data")
    }
  }


  // Reset the form state
  const resetForm = () => {
    setFormData({
      bank_id: "",
      bank_name: "",
      bank_branch: "",
      bank_account_number: "",
      bank_ifsc_code: "",
      bank_account_holder: "",
      bank_initial_amount: "",
      bank_open_closed: true,
      person_id: "",
      company_bank_account: "",
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
        <h5 className="text-1xl font-extrabold text-black-600 decoration-dashed tracking-wide">
  BANK ACCOUNTS
</h5>

        {/* Button to open modal */}
        <button
          type="button"
          className="btn btn-sm btn-primary mt-2"
          onClick={openModal}
        >
          Add Bank
        </button>

        <div class="grid grid-cols-1 md:grid-cols-1 gap-3 md:gap-4 mt-3 mb-4">
        <div className="card">
        <h5 className='mb-1'>Company Bank Accounts</h5>
        <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>S.N</th>
              <th>Person Name</th>
              <th>Bank Name</th>
              <th>Branch</th>
              <th>acc No</th>
              <th>IFSC</th>
              <th>Account Holder</th>
              <th>Status</th>
              <th>Contact Number</th>
              <th>Edit</th>
              <th>Delete</th>
      
            </tr>
          </thead>
          <tbody>
            {ComapnyBankDeatils.map((bank,index) => (
              <tr key={bank.bank_id}>
                <td>{index+1}</td>
                <td>{bank.person_id__person_name || 'N/A'}</td>
                <td>{bank.bank_name}</td>
                <td>{bank.bank_branch}</td>
                <td>{bank.bank_account_number}</td>
                <td>{bank.bank_ifsc_code}</td>
                <td>{bank.bank_account_holder || 'N/A'}</td>
                <td><i className="fa-solid fa-indian-rupee-sign"></i> {bank.bank_initial_amount || 0}</td>
                <td>{bank.bank_open_closed ? "Open" : "Closed"}</td>
                
                <td>{bank.person_id__person_contact_number || 'N/A'}</td>
                <td>
                  <i
                    className="fa-regular fa-pen-to-square"
                    onClick={() => editDetailsGetData(bank.bank_id)}
                  ></i>
                </td>
                <td>
                  <i className="fa-regular fa-trash-can" onClick={() => opendeleteModal(bank.bank_id)}></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        </div>
        </div>


        <div class="grid grid-cols-1 md:grid-cols-1 gap-3 md:gap-4 mt-2 mb-4">
        <div className="card">
        <h6 className='mb-1'>Others Acc.</h6>
        <div className="table-responsive mb-3">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>S.N</th>
              <th>Person Name</th>
              <th>Bank Name</th>
              <th>Branch</th>
              <th>Account Number</th>
              <th>IFSC Code</th>
              <th>Account Holder</th>
              <th>Initial Amount</th>
              <th>Status</th>
              <th>Contact number</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {bankDetails.map((bank,index) => (
              <tr key={bank.bank_id}>
                <td>{index+1}</td>
                <td>{bank.person_id__person_name || 'N/A'}</td>
                <td>{bank.bank_name}</td>
                <td>{bank.bank_branch}</td>
                <td>{bank.bank_account_number}</td>
                <td>{bank.bank_ifsc_code}</td>
                <td>{bank.bank_account_holder || 'N/A'}</td>
                <td><i className="fa-solid fa-indian-rupee-sign"></i> {bank.bank_initial_amount || 0}</td>
                <td>{bank.bank_open_closed ? "Open" : "Closed"}</td>
                
                <td>{bank.person_id__person_contact_number || 'N/A'}</td>
                <td>
                  <i
                    className="fa-regular fa-pen-to-square"
                    onClick={() => editDetailsGetData(bank.bank_id)}
                  ></i>
                </td>
                <td>
                  <i className="fa-regular fa-trash-can" onClick={() => opendeleteModal(bank.bank_id)}></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        </div>
        </div>



        <div class="grid grid-cols-1 md:grid-cols-1 gap-3 md:gap-4 mt-2 mb-4">
        <div className="card">
        <h6 className='mb-1'>Cash Transfer</h6>
        <div className="table-responsive">
    <table className="table table-hover">
    <thead>
      <tr>
        <th>S.N</th>
        
        <th>Debit/Credit</th>
        <th>Sender Name</th>
        <th>Receiver Name</th>
        <th>Amount</th>
        <th>Pay type</th>
        <th>Pay Mode</th>
        <th>Date</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      {CreditDebitData.map((bank, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{bank.credit_debit || 'N/A'}</td>
          <td>
            {bank.sender_person_id__person_name} {bank.sender_bank_id__bank_name}
          </td>
          <td>
            {bank.receiver_person_id__person_name} {bank.receiver_bank_id__bank_name}
          </td>
          <td>{bank.credit_debit === 'Credit' ? (
            <span className="text-green-600"><i className="fa-solid fa-indian-rupee-sign"></i> {bank.money_amount}</span>
          ) : (
            <span className="text-red-600"><i className="fa-solid fa-indian-rupee-sign"></i> {bank.money_amount}</span>
          )}</td>
          <td>{bank.pay_type_id__pay_type_name}</td>
          <td>{bank.money_payment_mode || 'N/A'}</td>
          <td>{bank.money_date || 'N/A'}</td>
          <td>{bank.money_payment_details || 'N/A'}</td>
        </tr>
      ))}

      {/* Calculate totals */}
      <tr>
      <td colSpan="4" className="text-end font-bold">Total Credit</td>
      <td>
        <span  className="text-green-600 font-bold"><i className="fa-solid fa-indian-rupee-sign"></i> {creditTotalAmount}</span>
      </td>

      <td colSpan="4"></td>
      </tr>
      <tr>
      <td colSpan="4" className="text-end font-bold">Total Debit</td>
      <td>
      <span  className="text-red-600 font-bold"><i className="fa-solid fa-indian-rupee-sign"></i> {debitTotalAmount}</span>
      </td>
      <td colSpan="4"></td>
      </tr>

    </tbody>
  </table>
        </div>
        </div>
        </div>


<Bank_cash_insert fetchdata={fetchBankDetails} />
<div class="grid grid-cols-1 md:grid-cols-1 gap-3 md:gap-4 mt-3 mb-4">
        <div className="card">
        <h6 className='mb-1'>Bank Transfer</h6>
<div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>S.N</th>
              <th>Credit/Debit</th>
              <th>Amount</th>
              <th>Bank Name</th>
              <th>Date</th>
              <th>Details</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {BankCashData.map((bank,index) => (
              <tr key={bank.bank_cash_id}>
                <td>{index+1}</td>
                <td>{bank.credit_debit || 'N/A'}</td>
                <td><i className="fa-solid fa-indian-rupee-sign"></i> {bank.amount}</td>
                <td>{bank.bank_id__bank_name}</td>
                <td>{bank.date}</td>
                <td>{bank.details}</td>
                <td>
                  <i className="fa-regular fa-trash-can" onClick={() => opendeleteModalBankCash(bank.bank_cash_id)}></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        </div>
        </div>


      </div>

      {/* Modal for Add/Edit Bank */}
      <div
        className="modal fade"
        id="bankModal"
        tabIndex="-1"
        aria-labelledby="bankModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="bankModalLabel">
                {formData.bank_id ? "Edit Bank" : "Add Bank"}
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
                  <label className="form-label">Bank Name:</label>
                  <input
                    type="text"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Branch</label>
                  <input
                    type="text"
                    name="bank_branch"
                    value={formData.bank_branch}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Acc No</label>
                  <input
                    type="text"
                    name="bank_account_number"
                    value={formData.bank_account_number}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">IFSC</label>
                  <input
                    type="text"
                    name="bank_ifsc_code"
                    value={formData.bank_ifsc_code}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Initial Amount</label>
                  <input
                    type="text"
                    name="bank_initial_amount"
                    value={formData.bank_initial_amount}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Acc Holder Name</label>
                  <input
                    type="text"
                    name="bank_account_holder"
                    value={formData.bank_account_holder}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                    <div className="form-check">
                    <input
                        className="form-check-input"
                        onChange={(e) =>
                        handleChange({
                            target: { name: "bank_open_closed", value: e.target.checked },
                        })
                        }
                        checked={formData.bank_open_closed}
                        name="bank_open_closed"
                        type="checkbox"
                        id="flexCheckChecked"
                    />
                    <label className="form-check-label" htmlFor="flexCheckChecked">
                    Account is Running
                    </label>
                    </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Person</label>
                  <select
                    className="form-select"
                    name="person_id"
                    value={formData.person_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Person</option>
                    {PersonsData.map((type) => (
                      <option
                        key={type.person_id}
                        value={type.person_id}
                      >
                        {type.person_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                    <div className="form-check">
                    <input
                        className="form-check-input"
                        onChange={(e) =>
                        handleChange({
                            target: { name: "company_bank_account", value: e.target.checked },
                        })
                        }
                        checked={formData.company_bank_account}
                        name="company_bank_account"
                        type="checkbox"
                        id="flexCheckChecked"
                    />
                    <label className="form-check-label" htmlFor="flexCheckChecked">
                    Company Bank Acc
                    </label>
                    </div>
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
                Delete Bank Data
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Confirm Delete..?<br />

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
        id="Modal"
        tabIndex="-1"
        aria-labelledby="ModalLabel"
        aria-hidden="true"
        ref={deleteModalBankCash}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ModalLabel">
                Delete Bank Cash Data
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Confirm Delete..?<br />

              <div className="mt-2">
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={() => deleteDataBankCash(delbankcashid)}
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

export default Banks;
