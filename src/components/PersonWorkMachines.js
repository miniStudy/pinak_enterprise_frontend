import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

const PersonWorkMachines = () => {
  const [machines, setMachines] = useState([]);
  const [workingMachines, setWorkingMachines] = useState([]);
  const [personTypes, setPersonTypes] = useState([]);
  const [people, setPeople] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [workTypes, setWorkTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(""); // State to store the title
  const modalRef = useRef();
  const deletemodel = useRef();
  const [delid,setdelid] = useState("");
  const [Messages, setMessages] = useState('');

  const [formData, setFormData] = useState({
    pwm_id: "",
    pwm_machine_name: "",
    pwm_machine_owner_name: "",
    pwm_machine_owner_number: "",
    working_machine_id: "",
    pwm_person_joining_date: "",
    pwm_person_contact_number: "",
    pwm_person_payment_by: "",
    pwm_person_payment_desc: "",
    person_type_id: "",
    person_id: "",
    project_type_id: "",
    project_id: "",
    work_types_id: "",
    pwm_work_number: "",
    pwm_work_amount: "",
    pwm_total_amount: "",
    pwm_work_desc: "",
  });

  const fetchMachines = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/show_person_work_machine/");
      console.log(response.data.data)
      setMachines(response.data.data || []);
      setWorkingMachines(response.data.working_types_data || []);
      setPersonTypes(response.data.person_types_data || []);
      setPeople(response.data.person_data || []);
      setProjectTypes(response.data.project_types_data || []);
      setProjects(response.data.project_data || []);
      setWorkTypes(response.data.work_types_data || []);
      setTitle(response.data.title || "Person Work Machines");
      setLoading(false);
    } catch (err) {
      setError("Failed to load machine details.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
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
        "http://127.0.0.1:8000/insert_update_person_work_machine/",
        formData
      );
      if (response.status === 200) {
        alert(response.data.message);
        fetchMachines();
        resetForm();
        closeModal();
      } else {
        alert("Failed to save machine details.");
      }
    } catch (err) {
      alert("Error occurred while saving machine details.");
    }
  };

  const editDetailsGetData = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/insert_update_person_work_machine/?getdata_id=${id}`
      );
      setFormData(response.data.data);
      setWorkingMachines(response.data.working_types_data || []);
      setPersonTypes(response.data.person_types_data || []);
      setPeople(response.data.person_data || []);
      setProjectTypes(response.data.project_types_data || []);
      setProjects(response.data.project_data || []);
      setWorkTypes(response.data.work_types_data || []);
      openModal();
    } catch (err) {
      alert("Failed to load machine details.");
    }
  };

  const deleteData = async (id) => {
    try{
      const response = await axios.delete(
        `http://127.0.0.1:8000/delete_person_work_machine/?pwm_id=${id}`
      );
      setMessages(response.data.message)
      fetchMachines();
      closedeleteModal();
    } catch (err){
      setError("Failed to delete document type data")
    }
  }

  const resetForm = () => {
    setFormData({
      pwm_id: "",
      pwm_machine_name: "",
      pwm_machine_owner_name: "",
      pwm_machine_owner_number: "",
      working_machine_id: "",
      pwm_person_joining_date: "",
      pwm_person_contact_number: "",
      pwm_person_payment_by: "",
      pwm_person_payment_desc: "",
      person_type_id: "",
      person_id: "",
      project_type_id: "",
      project_id: "",
      work_types_id: "",
      pwm_work_number: "",
      pwm_work_amount: "",
      pwm_total_amount: "",
      pwm_work_desc: "",
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

  // Show loading message while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error message if fetching data failed
  if (error) {
    return <div>{error}</div>;
  }

  // Render the data table
  return (
    <>
    <div>
    {Messages && <div class="alert alert-success alert-dismissible fade show" role="alert">{Messages}</div>}
      <h1>{title}</h1> {/* Display the title */}
      <button type="button" className="btn btn-primary" onClick={openModal}>Add Person Work Machine</button>
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Machine Name</th>
            <th>Owner Name</th>
            <th>Owner Contact</th>
            <th>Working Machine Name</th>
            <th>Joining Date</th>
            <th>Person Contact</th>
            <th>Payment By</th>
            <th>Payment Description</th>
            <th>Person Type</th>
            <th>Person Name</th>
            <th>Project Type</th>
            <th>Project Name</th>
            <th>Work Type</th>
            <th>Work Number</th>
            <th>Work Amount</th>
            <th>Total Amount</th>
            <th>Work Description</th>
            <th>Update</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {machines.length > 0 ? (
            machines.map((item) => (
              <tr key={item.pwm_id}>
                <td>{item.pwm_id || "N/A"}</td>
                <td>{item.pwm_machine_name || "N/A"}</td>
                <td>{item.pwm_machine_owner_name || "N/A"}</td>
                <td>{item.pwm_machine_owner_number || "N/A"}</td>
                <td>{item.working_machine_id__working_machine_name || "N/A"}</td>
                <td>{item.pwm_person_joining_date || "N/A"}</td>
                <td>{item.pwm_person_contact_number || "N/A"}</td>
                <td>{item.pwm_person_payment_by || "N/A"}</td>
                <td>{item.pwm_person_payment_desc || "N/A"}</td>
                <td>{item.person_type_id__person_type_name || "N/A"}</td>
                <td>{item.person_id__person_name || "N/A"}</td>
                <td>{item.project_type_id__project_type_name || "N/A"}</td>
                <td>{item.project_id__project_name || "N/A"}</td>
                <td>{item.work_types_id__work_type_name || "N/A"}</td>
                <td>{item.pwm_work_number || "N/A"}</td>
                <td>{item.pwm_work_amount || "N/A"}</td>
                <td>{item.pwm_total_amount || "N/A"}</td>
                <td>{item.pwm_work_desc || "N/A"}</td>
                <td><i className="fa-regular fa-pen-to-square" onClick={() => editDetailsGetData(item.pwm_id)}></i></td>
                <td><i class="fa-regular fa-trash-can" onClick={() => opendeleteModal(item.pwm_id)}></i></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="18" style={{ textAlign: "center" }}>
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    <div className="modal fade" id="machineModal" tabIndex="-1" ref={modalRef} aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">{formData.pwm_id ? "Edit Machine" : "Add Machine"}</h5>
        <button type="button" className="btn-close" onClick={closeModal}></button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Machine Name:</label>
            <input
              type="text"
              name="pwm_machine_name"
              value={formData.pwm_machine_name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label>Machine Owner Name:</label>
            <input
              type="text"
              name="pwm_machine_owner_name"
              value={formData.pwm_machine_owner_name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label>Machine Owner Number:</label>
            <input
              type="text"
              name="pwm_machine_owner_number"
              value={formData.pwm_machine_owner_number}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label>Working Machine:</label>
            <select
              name="working_machine_id"
              value={formData.working_machine_id}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select a working machine</option>
              {workingMachines.map((machine) => (
                <option key={machine.working_machine_id} value={machine.working_machine_id}>
                  {machine.working_machine_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label>Joining Date:</label>
            <input
              type="date"
              name="pwm_person_joining_date"
              value={formData.pwm_person_joining_date}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Contact Number:</label>
            <input
              type="text"
              name="pwm_person_contact_number"
              value={formData.pwm_person_contact_number}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label>Payment By:</label>
            <select
              name="pwm_person_payment_by"
              value={formData.pwm_person_payment_by}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select payment option</option>
              <option value="Company_Owner">Company Owner</option>
              <option value="Pinak_Enterprise">Pinak Enterprise</option>
              <option value="Pinak">Pinak</option>
            </select>
          </div>
          <div className="mb-3">
            <label>Payment Description:</label>
            <textarea
              name="pwm_person_payment_desc"
              value={formData.pwm_person_payment_desc}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Person Type:</label>
            <select
              name="person_type_id"
              value={formData.person_type_id}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select a person type</option>
              {personTypes.map((type) => (
                <option key={type.person_type_id} value={type.person_type_id}>
                  {type.person_type_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label>Person:</label>
            <select
              name="person_id"
              value={formData.person_id}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select a person</option>
              {people.map((person) => (
                <option key={person.person_id} value={person.person_id}>
                  {person.person_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label>Project Type:</label>
            <select
              name="project_type_id"
              value={formData.project_type_id}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select a project type</option>
              {projectTypes.map((type) => (
                <option key={type.project_type_id} value={type.project_type_id}>
                  {type.project_type_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label>Project:</label>
            <select
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.project_id} value={project.project_id}>
                  {project.project_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label>Work Type:</label>
            <select
              name="work_types_id"
              value={formData.work_types_id}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select a work type</option>
              {workTypes.map((type) => (
                <option key={type.work_type_id} value={type.work_type_id}>
                  {type.work_type_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label>Work Number:</label>
            <input
              type="text"
              name="pwm_work_number"
              value={formData.pwm_work_number}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label>Work Amount:</label>
            <input
              type="text"
              name="pwm_work_amount"
              value={formData.pwm_work_amount}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label>Total Amount:</label>
            <input
              type="text"
              name="pwm_total_amount"
              value={formData.pwm_total_amount}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label>Work Description:</label>
            <textarea
              name="pwm_work_desc"
              value={formData.pwm_work_desc}
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
                Delete Person-Work-Machine Data
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              are you sure You want to delete this data?<br/>
            
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

export default PersonWorkMachines;