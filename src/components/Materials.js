import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from 'bootstrap';

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [workTypes, setWorkTypes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(""); // State to store the title
  const modalRef = useRef();

  const [formData, setFormData] = useState({
    material_id: '',
    material_owner_name: '',
    material_used_date: '',
    material_type_id: '',
    work_type_id: '',
    material_work_number: '',
    material_work_amount: '',
    material_work_total_amount: '',
    total_material_amount: '',
    material_desc: '',
    project_id: '',
});


const fetchMaterials = async () => {
  try {
      const response = await axios.get('http://127.0.0.1:8000/show_materials/');
      setMaterials(response.data.data || []);
      setMaterialTypes(response.data.material_types_data || []);
      setWorkTypes(response.data.work_types_data || []);
      setProjects(response.data.project_types_data || []);
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
        setWorkTypes(response.data.work_types_data || []);
        setProjects(response.data.project_types_data || []);
        openModal();
    } catch (err) {
        alert('Failed to load material details');
    }
};

const resetForm = () => {
  setFormData({
      material_id: '',
      material_owner_name: '',
      material_used_date: '',
      material_type_id: '',
      work_type_id: '',
      material_work_number: '',
      material_work_amount: '',
      material_work_total_amount: '',
      total_material_amount: '',
      material_desc: '',
      project_id: '',
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
      <h1>{title}</h1> {/* Display the title */}
      <button className="btn btn-primary" onClick={openModal}>Add Material</button>
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Material ID</th>
            <th>Owner's Name</th>
            <th>Used Date</th>
            <th>Material Type</th>
            <th>Work Type</th>
            <th>Work Number</th>
            <th>Work Amount</th>
            <th>Total Work Amount</th>
            <th>Total Material Amount</th>
            <th>Description</th>
            <th>Project Name</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {materials.length > 0 ? (
            materials.map((material) => (
              <tr key={material.material_id}>
                <td>{material.material_id || "N/A"}</td>
                <td>{material.material_owner_name || "N/A"}</td>
                <td>{material.material_used_date || "N/A"}</td>
                <td>{material.material_type_id__material_type_name || "N/A"}</td>
                <td>{material.work_type_id__work_type_name || "N/A"}</td>
                <td>{material.material_work_number || "N/A"}</td>
                <td>{material.material_work_amount || "N/A"}</td>
                <td>{material.material_work_total_amount || "N/A"}</td>
                <td>{material.total_material_amount || "N/A"}</td>
                <td>{material.material_desc || "N/A"}</td>
                <td>{material.project_id__project_name || "N/A"}</td>
                <td><i className="fa-regular fa-pen-to-square" onClick={() => editMaterial(material.material_id)}></i></td>
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
                <div>
                <label>Owner's Name:</label>
                    <input
                        type="text"
                        name="material_owner_name"
                        value={formData.material_owner_name}
                        onChange={handleChange}
                        placeholder="Owner Name"
                        required
                    />
                </div>

                <div>
                <label>Used Date:</label>
                    <input
                        type="date"
                        name="material_used_date"
                        value={formData.material_used_date}
                        onChange={handleChange}
                        required
                    />
                  </div>

                  <div>
                  <label>Material work number:</label>
                    <input
                        type="text"
                        name="material_work_number"
                        value={formData.material_work_number}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                <label>Work Amount:</label>
                    <input
                        type="text"
                        name="material_work_amount"
                        value={formData.material_work_amount}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                <label>Total Work Amount:</label>
                    <input
                        type="text"
                        name="material_work_total_amount"
                        value={formData.material_work_total_amount}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                <label>Total Material Amount:</label>
                    <input
                        type="text"
                        name="total_material_amount"
                        value={formData.total_material_amount}
                        onChange={handleChange}
                        required
                    />
                </div>

                    <select
                        name="material_type_id"
                        value={formData.material_type_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Material Type</option>
                        {materialTypes.map((type) => (
                            <option
                                key={type.material_type_id}
                                value={type.material_type_id}
                            >
                                {type.material_type_name}
                            </option>
                        ))}
                    </select>
                    <select
                        name="work_type_id"
                        value={formData.work_type_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Work Type</option>
                        {workTypes.map((type) => (
                            <option key={type.work_type_id} value={type.work_type_id}>
                                {type.work_type_name}
                            </option>
                        ))}
                    </select>

                    <select
                        name="project_id"
                        value={formData.project_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select project type</option>
                        {projects.map((project) => (
                            <option key={project.project_id} value={project.project_id}>
                                {project.project_name}
                            </option>
                        ))}
                    </select>

                    <div>
                    <label>Machine Details:</label>
                        <textarea
                          name="material_desc"
                          value={formData.material_desc}
                          onChange={handleChange}
                        ></textarea>
                    </div>

                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    </div>
</div>
</>
  );
};

export default Materials;
