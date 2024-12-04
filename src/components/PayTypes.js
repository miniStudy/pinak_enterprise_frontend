import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

const PayTypes = () => {
  const [payTypes, setPayTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(""); // To store the title from the API response
  const modalRef = useRef();

  const [formData, setFormData] = useState({
    pay_type_id: "",
    pay_type_name: "",
    pay_type_date: "",
  });

  // Fetch pay types from API
  const fetchPayTypes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/show_pay_types/");
      setPayTypes(response.data.data || []);
      setTitle(response.data.title);
      setLoading(false);
    } catch (err) {
      setError("Failed to load pay types data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayTypes();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission for Add/Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/insert_update_pay_type/",
        formData
      );
      if (response.status === 200) {
        alert("Pay type saved successfully!");
        fetchPayTypes(); // Reload data
        resetForm();
        closeModal();
      } else {
        alert("Failed to save pay type.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error occurred while saving pay type.");
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

  // Fetch data for editing a specific pay type
  const editDetailsGetData = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/insert_update_pay_type/?getdata_id=${id}`
      );
      setFormData(response.data.data);
      openModal();
    } catch (err) {
      setError("Failed to load pay type details");
    }
  };

  // Reset the form state
  const resetForm = () => {
    setFormData({
      pay_type_id: "",
      pay_type_name: "",
      pay_type_date: "",
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

  // Render the pay types table
  return (
    <>
      <div>
        <h1>{title}</h1> {/* Display the title */}
        <button type="button" className="btn btn-primary" onClick={openModal}>
          Add Pay Type
        </button>
        <table
          border="1"
          style={{ width: "100%", textAlign: "left", marginTop: "20px" }}
        >
          <thead>
            <tr>
              <th>Pay Type ID</th>
              <th>Pay Type Name</th>
              <th>Pay Type Date</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {payTypes.length > 0 ? (
              payTypes.map((payType) => (
                <tr key={payType.pay_type_id}>
                  <td>{payType.pay_type_id || "N/A"}</td>
                  <td>{payType.pay_type_name || "N/A"}</td>
                  <td>{payType.pay_type_date || "N/A"}</td>
                  <td>
                    <i
                      className="fa-regular fa-pen-to-square"
                      onClick={() => editDetailsGetData(payType.pay_type_id)}
                    ></i>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No pay types available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Pay Type */}
      <div
        className="modal fade"
        id="payTypeModal"
        tabIndex="-1"
        aria-labelledby="payTypeModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="payTypeModalLabel">
                {formData.pay_type_id ? "Edit Pay Type" : "Add Pay Type"}
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
                  <label>Pay Type Name:</label>
                  <input
                    type="text"
                    name="pay_type_name"
                    value={formData.pay_type_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Pay Type Date:</label>
                  <input
                    type="date"
                    name="pay_type_date"
                    value={formData.pay_type_date}
                    onChange={handleChange}
                    required
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
};

export default PayTypes;