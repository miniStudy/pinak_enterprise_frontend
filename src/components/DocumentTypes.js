import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

const DocumentTypes = () => {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const modalRef = useRef();

  const [formData, setFormData] = useState({
    document_type_id: "",
    document_type_name: "",
  });

  // Fetch document types from API
  const fetchDocumentTypes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/show_document_types/");
      setDocumentTypes(response.data.data || []);
      setTitle(response.data.title);
      setLoading(false);
    } catch (err) {
      setError("Failed to load document types data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentTypes();
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
        "http://127.0.0.1:8000/insert_update_document_type/",
        formData
      );
      if (response.status === 200) {
        alert("Document type saved successfully!");
        fetchDocumentTypes(); // Reload data
        resetForm();
        closeModal();
      } else {
        alert("Failed to save document type.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error occurred while saving document type.");
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

  // Fetch data for editing a specific document type
  const editDetailsGetData = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/insert_update_document_type/?getdata_id=${id}`
      );
      setFormData(response.data.data);
      openModal();
    } catch (err) {
      setError("Failed to load document type details");
    }
  };

  // Reset the form state
  const resetForm = () => {
    setFormData({
      document_type_id: "",
      document_type_name: "",
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

  // Render the document types table
  return (
    <>
      <div>
        <h1>{title}</h1>
        <button type="button" className="btn btn-primary" onClick={openModal}>
          Add Document Type
        </button>
        <table
          border="1"
          style={{ width: "100%", textAlign: "left", marginTop: "20px" }}
        >
          <thead>
            <tr>
              <th>Document Type ID</th>
              <th>Document Type Name</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {documentTypes.length > 0 ? (
              documentTypes.map((documentType) => (
                <tr key={documentType.document_type_id}>
                  <td>{documentType.document_type_id || "N/A"}</td>
                  <td>{documentType.document_type_name || "N/A"}</td>
                  <td>
                    <i
                      className="fa-regular fa-pen-to-square"
                      onClick={() =>
                        editDetailsGetData(documentType.document_type_id)
                      }
                    ></i>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No document types available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Document Type */}
      <div
        className="modal fade"
        id="documentTypeModal"
        tabIndex="-1"
        aria-labelledby="documentTypeModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="documentTypeModalLabel">
                {formData.document_type_id ? "Edit Document Type" : "Add Document Type"}
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
                  <label>Document Type Name:</label>
                  <input
                    type="text"
                    name="document_type_name"
                    value={formData.document_type_name}
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

export default DocumentTypes;