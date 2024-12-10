import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from 'bootstrap';
import { Link } from 'react-router-dom';

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [Persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(""); // State to store the title
  const modalRef = useRef();
  const deletemodel = useRef();
  const [delid, setdelid] = useState("");
  const [Messages, setMessages] = useState('');

  const [formData, setFormData] = useState({
    'material_id': '',
    'material_type_id': '',
    'material_person_id': '',
    'material_status': true,
    'material_details': '',

  });


  const fetchMaterials = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/show_materials/');
      setMaterials(response.data.data || []);
      setMaterialTypes(response.data.material_types_data || []);
      setPersons(response.data.persons_data || []);
      setTitle(response.data.title)
      setLoading(false);
    } catch (err) {
      setError('Failed to load material details');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/insert_update_material/',
        formData
      );
      if (response.status === 200) {
        alert(response.data.message);
        fetchMaterials();
        resetForm();
        closeModal();
      } else {
        alert('Failed to save material details.');
      }
    } catch (err) {
      alert('Error occurred while saving material details.');
    }
  };

  const editMaterial = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/insert_update_material/?getdata_id=${id}`
      );
      setFormData(response.data.data);
      setMaterialTypes(response.data.material_types_data || []);
      setPersons(response.data.persons_data || []);
      openModal();
    } catch (err) {
      alert('Failed to load material details');
    }
  };

  const resetForm = () => {
    setFormData({
      'material_id': '',
      'material_type_id': '',
      'material_person_id': '',
      'material_status': true,
      'material_details': '',
    });
  };

  const openModal = () => {
    const modalInstance = new Modal(modalRef.current);
    modalInstance.show();
  };

  const closeModal = () => {
    const modalInstance = Modal.getInstance(modalRef.current);
    if (modalInstance) {
      modalInstance.hide();
    }
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

  const deleteData = async (id) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/delete_material/?material_id=${id}`
      );
      setMessages(response.data.message)
      fetchMaterials();
      closedeleteModal();
    } catch (err) {
      setError("Failed to delete document type data")
    }
  }

  // Show loading message while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error message if fetching data failed
  if (error) {
    return <div>{error}</div>;
  }

  // Render the materials table
  return (
    <>
      <div>
        {Messages && <div class="alert alert-success alert-dismissible fade show" role="alert">{Messages}</div>}
        <h3>{title}</h3>
        <div className="d-flex align-items-center mb-3">
    <Link to="/material-types"><img 
        src="/static/icons/material_type.png" 
        alt="User Icon" 
        style={{ height: "30px", width: "auto" }} // Ensure consistent height
    /></Link>
    <button
        type="button"
        className="btn btn-sm btn-primary ms-2"
        onClick={openModal}
        style={{ height: "30px" }} // Adjust the height as needed
    >
        Add Material
    </button>
    
    <div className="input-group" style={{ height: "30px", width: "auto" }}>
        <input type="text" class="form-control ms-2" style={{ height: "30px", width: "100px" }} placeholder="Search" aria-label="Recipient's username" aria-describedby="button-addon2"/>
         <button className="btn btn-sm btn-outline-primary d-flex align-items-center" type="button" id="button-addon2" style={{ height: "30px", width: "auto" }}><i class="fa-solid fa-magnifying-glass"></i></button>
    </div>

</div>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>S.N</th>
                <th>Material Type</th>
                <th>Owner's Name</th>
                <th>Status</th>
                <th>Details</th>
                <th>Update</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {materials.length > 0 ? (
                materials.map((material, index) => (
                  <tr key={material.material_id}>
                    <td>{index + 1 || "N/A"}</td>
                    <td>{material.material_type_id__material_type_name || "N/A"}</td>
                    <td>{material.material_person_id__person_name || "N/A"}</td>
                    <td>{material.material_status ? "Active" : "Inactive"}</td>
                    <td>{material.material_details || "N/A"}</td>
                    <td><i className="fa-regular fa-pen-to-square" onClick={() => editMaterial(material.material_id)}></i></td>
                    <td><i class="fa-regular fa-trash-can" onClick={() => opendeleteModal(material.material_id)}></i></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center" }}>
                    No materials data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className="modal fade"
        id="materialModal"
        tabIndex="-1"
        ref={modalRef}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {formData.material_id ? 'Edit Material' : 'Add Material'}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>

              <div className="mb-3">
                    <select
                        name="material_type_id"
                        value={formData.material_type_id}
                        onChange={handleChange}
                        className="form-select"
                        required
                    >
                        <option value="">Select Material Type*</option>
                        {materialTypes.map((type) => (
                            <option
                                key={type.material_type_id}
                                value={type.material_type_id}
                            >
                                {type.material_type_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <select
                        name="material_person_id"
                        value={formData.material_person_id}
                        onChange={handleChange}
                        className="form-select"
                        required
                    >
                        <option value="">Select Person Type*</option>
                        {Persons.map((type) => (
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
                            target: { name: "material_status", value: e.target.checked },
                          })
                        }
                        checked={formData.material_status}
                        name="material_status"
                        type="checkbox"
                        id="flexCheckChecked"
                      />
                      <label className="form-check-label" htmlFor="flexCheckChecked">
                        Active
                      </label>
                    </div>
                  </div>

                <div className="mb-3">
                  <textarea
                    name="material_details"
                    value={formData.material_details}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Material Details"
                  ></textarea>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
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
                Delete Material Data
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

export default Materials;
