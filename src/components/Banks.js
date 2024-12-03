import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from 'bootstrap';


const Banks = () => {
  const [bankDetails, setBankDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const modalRef = useRef();

    const fetchBankDetails = async () => {
        axios.get('http://127.0.0.1:8000/show_bank_details/') // Update with your API URL
            .then((response) => {
                setBankDetails(response.data.data); // Assuming 'data' is the key that holds the bank details
                console.log(response.data)
                setTitle(response.data.title); // Assuming 'title' is part of the response
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load bank details');
                setLoading(false);
            });
  // Form states
  const [formData, setFormData] = useState({
    bank_id: "",
    bank_name: "",
    bank_branch: "",
    bank_account_number: "",
    bank_ifsc_code: "",
    bank_account_holder: "",
    bank_open_closed: false,
  });

  // Fetch bank details
  const fetchBankDetails = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/show_bank_details/"
      );
      setBankDetails(response.data.data);
      setTitle(response.data.title);
      setLoading(false);
    } catch (err) {
      setError("Failed to load bank details");
      setLoading(false);
    }
  };
    
      // Handle input changes
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
    
      // Handle form submission
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch("http://127.0.0.1:8000/insert_update_bank_detail/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
    
          if (response.ok) {
            alert("Form submitted successfully!");
            fetchBankDetails();
            // const modalInstance = Modal.getInstance(modalRef.current);
            // modalInstance.hide();
            setFormData({
                bank_name: '',
                bank_branch: '',
                bank_account_number: '',
                bank_ifsc_code: '',
                bank_account_holder: '',
                bank_open_closed: false,
              });
          } else {
            alert("Failed to submit form.");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };
  useEffect(() => {
    fetchBankDetails();
  }, []);

  // Fetch data for editing a specific bank record
  const editDetailsGetData = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/insert_update_bank_detail/?getdata_id=${id}`
      );
      setFormData(response.data.data);
    } catch (err) {
      setError("Failed to load bank details");
    }
  };

  // Reset the form state
  const resetForm = () => {
    setFormData({
      bank_id: "",
      bank_name: "",
      bank_branch: "",
      bank_account_number: "",
      bank_ifsc_code: "",
      bank_account_holder: "",
      bank_open_closed: false,
    });
  };

  // Close the modal
  const closeModal = () => {
    const modalInstance = Modal.getInstance(modalRef.current);
    if (modalInstance) {
      modalInstance.hide();
    }
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
          data-bs-toggle="modal"
          data-bs-target="#bankModal"
          onClick={resetForm}
        >
          Add Bank
        </button>

        {/* Bank Details Table */}
        <table>
          <thead>
            <tr>
              <th>Bank ID</th>
              <th>Bank Name</th>
              <th>Branch</th>
              <th>Account Number</th>
              <th>IFSC Code</th>
              <th>Account Holder</th>
              <th>Status</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {bankDetails.map((bank) => (
              <tr key={bank.bank_id}>
                <td>{bank.bank_id}</td>
                <td>{bank.bank_name}</td>
                <td>{bank.bank_branch}</td>
                <td>{bank.bank_account_number}</td>
                <td>{bank.bank_ifsc_code}</td>
                <td>{bank.bank_account_holder}</td>
                <td>{bank.bank_open_closed ? "Yes" : "No"}</td>
                <td>
                  <i
                    className="fa-regular fa-pen-to-square"
                    data-bs-toggle="modal"
                    data-bs-target="#bankModal"
                    onClick={() => editDetailsGetData(bank.bank_id)}
                  ></i>
                </td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
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
                <div>
                  <label>Bank Name:</label>
                  <input
                    type="text"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Branch:</label>
                  <input
                    type="text"
                    name="bank_branch"
                    value={formData.bank_branch}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Account Number:</label>
                  <input
                    type="text"
                    name="bank_account_number"
                    value={formData.bank_account_number}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>IFSC Code:</label>
                  <input
                    type="text"
                    name="bank_ifsc_code"
                    value={formData.bank_ifsc_code}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Account Holder:</label>
                  <input
                    type="text"
                    name="bank_account_holder"
                    value={formData.bank_account_holder}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Bank Open/Closed:</label>
                  <input
                    type="checkbox"
                    name="bank_open_closed"
                    checked={formData.bank_open_closed}
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



        {/* Insert code for Add Form  */}
                <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
                ref={modalRef}
            >
                <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                        Bank Status
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
            <label>bank_name:</label>
            <input
                type="text"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleChange}
            />
            </div>
            <div>
            <label>bank_branch:</label>
            <input
                type="text"
                name="bank_branch"
                value={formData.bank_branch}
                onChange={handleChange}
            />
            </div>

            <div>
            <label>bank_account_number:</label>
            <input
                type="text"
                name="bank_account_number"
                value={formData.bank_account_number}
                onChange={handleChange}
            />
            </div>

            <div>
            <label>bank_ifsc_code:</label>
            <input
                type="text"
                name="bank_ifsc_code"
                value={formData.bank_ifsc_code}
                onChange={handleChange}
            />
            </div>

            <div>
            <label>bank_account_holder:</label>
            <input
                type="text"
                name="bank_account_holder"
                value={formData.bank_account_holder}
                onChange={handleChange}
            />
            </div>

            <div>
        <label>Bank Open/Closed:</label>
        <input
            type="checkbox"
            name="bank_open_closed"
            checked={formData.bank_open_closed} // Bind to a boolean value in state
            onChange={(e) =>
            setFormData((prevFormData) => ({
                ...prevFormData,
                bank_open_closed: e.target.checked, // Update with true/false
            }))
            }
        />
        </div>
        
            <button type="submit">Submit</button>
        </form>
        </div>
        </div></div>
        </div>
      </div>
    </>
  );
};

export default Banks;
