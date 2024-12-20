import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { Link } from "react-router-dom";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState("");
  const [formData, setFormData] = useState({
    document_id: "",
    document_name: "",
    document_unique_code: "",
    document_file: null,
    document_type_id: "",
    person_id: "",
  });
  const [document_types,setdocument_types] = useState([])

  const modalRef = useRef();
  const deleteModalRef = useRef();
  const [deleteId, setDeleteId] = useState("");

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/show_documents/");
      setDocuments(response.data.data);
      setdocument_types(response.data.document_types)
      setLoading(false);
    } catch (err) {
      setError("Failed to load documents.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (messages) {
      const timer = setTimeout(() => setMessages(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle form submit for adding/updating document
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = formData.document_id ? "put" : "post";
    const url = formData.document_id
      ? `http://127.0.0.1:8000/insert_update_documents/?pk=${formData.document_id}`
      : "http://127.0.0.1:8000/insert_update_documents/";

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await axios({
        method,
        url,
        data: formDataToSend,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessages(response.data.message)
      fetchDocuments();
      resetForm();
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Error saving document.");
    }
  };

  // Open modal for adding/editing
  const openModal = (doc = null) => {
    if (doc) setFormData(doc);
    const modalInstance = new Modal(modalRef.current);
    modalInstance.show();
  };

  const closeModal = () => {
    const modalInstance = Modal.getInstance(modalRef.current);
    if (modalInstance) modalInstance.hide();
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    const modalInstance = new Modal(deleteModalRef.current);
    modalInstance.show();
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/delete_document/?document_id=${deleteId}/`);
      setMessages(response.data.message);
      fetchDocuments();
      closeDeleteModal();
    } catch (err) {
      setError("Failed to delete document.");
    }
  };

  const closeDeleteModal = () => {
    const modalInstance = Modal.getInstance(deleteModalRef.current);
    if (modalInstance) modalInstance.hide();
  };

  const resetForm = () => {
    setFormData({
      document_id: "",
      document_name: "",
      document_unique_code: "",
      document_file: null,
      document_type_id: "",
      person_id: "",
    });
  };

  return (
    <div className="">
      {messages && <div className="alert alert-success">{messages}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <h5 className="text-1xl font-extrabold text-black-600 decoration-dashed tracking-wide">DOCUMENTS DATA</h5>
      <button
        className="btn btn-primary mb-3 mt-3"
        onClick={() => openModal()}
      >
        Add Document
      </button>

      {/* Documents Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Unique Code</th>
            <th>Date</th>
            <th>File</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.document_id}>
              <td>{doc.document_id}</td>
              <td>{doc.document_name}</td>
              <td>{doc.document_unique_code}</td>
              <td>{doc.document_date}</td>
              <td><Link to={`http://127.0.0.1:8000/media/${doc.document_file}`}>Open</Link></td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => openDeleteModal(doc.document_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Add/Edit */}
      <div
        className="modal fade"
        ref={modalRef}
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {formData.document_id ? "Edit Document" : "Add Document"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-3">
                  <label>Name</label>
                  <input
                    type="text"
                    name="document_name"
                    value={formData.document_name}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className='mb-3'>
                                    <select name="document_type_id" value={formData.document_type_id} onChange={handleChange} className='form-select'>
                                        <option value="">Document Type</option>
                                        {document_types.length > 0 && (
                                            document_types.map((x) => (
                                        <option value={x.document_type_id}>{x.document_type_name}</option>
                                            )))}
                                    </select>
                                </div>
                <div className="mb-3">
                  <label>Unique Code</label>
                  <input
                    type="text"
                    name="document_unique_code"
                    value={formData.document_unique_code}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label>Upload File</label>
                  <input
                    type="file"
                    name="document_file"
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <button type="submit" className="btn btn-success">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <div
        className="modal fade"
        ref={deleteModalRef}
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Delete</h5>
              <button type="button" className="btn-close"></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this document?</p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
