import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from 'bootstrap';


const Banks = () => {
  const [bankDetails, setBankDetails] = useState([]);
  const [PersonsData, setPersonsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const modalRef = useRef();
  const deletemodel = useRef();
  const [delid, setdelid] = useState("");
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
  });


  // Fetch bank details
  const fetchBankDetails = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/show_bank_details/"
      );
      setBankDetails(response.data.data);
      setPersonsData(response.data.persons || []);
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
          className="btn btn-sm btn-primary mb-3"
          onClick={openModal}
        >
          Add Bank
        </button>

        {/* Bank Details Table */}
        <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>S.N</th>
              <th>Person</th>
              <th>Bank</th>
              <th>Branch</th>
              <th>Acc.No</th>
              <th>IFSC</th>
              <th>Acc.Holder</th>
              <th>Initial Amt</th>
              <th>Status</th>
              <th>Contact</th>
              <th>Update</th>
              <th>Remove</th>
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
                <td>{bank.bank_initial_amount || 'N/A'}</td>
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
                  <label className="form-label">બેંકનું નામ:</label>
                  <input
                    type="text"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Branch:</label>
                  <input
                    type="text"
                    name="bank_branch"
                    value={formData.bank_branch}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Account Number:</label>
                  <input
                    type="text"
                    name="bank_account_number"
                    value={formData.bank_account_number}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">IFSC Code:</label>
                  <input
                    type="text"
                    name="bank_ifsc_code"
                    value={formData.bank_ifsc_code}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Initial Amount:</label>
                  <input
                    type="text"
                    name="bank_initial_amount"
                    value={formData.bank_initial_amount}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Account Holder:</label>
                  <input
                    type="text"
                    name="bank_account_holder"
                    value={formData.bank_account_holder}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
          
                <div className="mb-3">
                    <div class="form-check">
                    <input class="form-check-input" onChange={handleChange} checked={formData.bank_open_closed} name="bank_open_closed" type="checkbox" id="flexCheckChecked" />
                    <label class="form-check-label" for="flexCheckChecked">
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
    </>
  );
};

export default Banks;
