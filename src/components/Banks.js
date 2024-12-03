import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';  // Import axios
import { Modal } from 'bootstrap';

const Banks = () => {
    const [bankDetails, setBankDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
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
    }
    // Fetch bank details using useEffect and axios
    useEffect(() => {
        fetchBankDetails();
    }, []);

    // -----------code for Insert Code---------------------------
    const [formData, setFormData] = useState({
        bank_name: "",
        bank_branch: "",
        bank_account_number: "",
        bank_ifsc_code:"",
        bank_account_holder: "",
        bank_open_closed: false,
      });
    
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

    // ---------------end insert code -------------------------

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
        <div>
            <h1>{title}</h1> {/* Use the 'title' state here */}
            <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Open Modal
      </button>
      
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
                            <td>{bank.bank_open_closed ? 'yes' : 'no'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
        </>
    );
};

export default Banks;