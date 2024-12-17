import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

const CreateUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("Manage Users");
  const [messages, setMessages] = useState("");
  const [delId, setDelId] = useState("");
  const modalRef = useRef();
  const deleteModalRef = useRef();

  const [formData, setFormData] = useState({
    user_id: "",
    user_name: "",
    user_email: "",
    user_contact: "",
    user_password: "",
  });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/show_user/");
      setUsers(response.data.data || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to load user data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (messages) {
      const timer = setTimeout(() => setMessages(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  // Input Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Form for Add/Update User
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/insert_update_user/",
        formData
      );
      setMessages(response.data.message);
      fetchUsers();
      resetForm();
      closeModal();
    } catch (err) {
      setError("Failed to save user data.");
    }
  };

  // Fetch single user data for editing
  const editDetails = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/insert_update_user/?getdata=${id}`
      );
      setFormData(response.data.data);
      openModal();
    } catch (err) {
      setError("Failed to load user details.");
    }
  };

  // Delete Confirmation Modal
  const deleteUser = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/delete_user/?user_id=${delId}`);
      setMessages("User deleted successfully!");
      fetchUsers();
      closeDeleteModal();
    } catch (err) {
      setError("Failed to delete user.");
    }
  };

  // Modal Controls
  const openModal = () => {
    const modalInstance = new Modal(modalRef.current);
    modalInstance.show();
  };

  const closeModal = () => {
    const modalInstance = Modal.getInstance(modalRef.current);
    if (modalInstance) modalInstance.hide();
  };

  const openDeleteModal = (id) => {
    setDelId(id);
    const modalInstance = new Modal(deleteModalRef.current);
    modalInstance.show();
  };

  const closeDeleteModal = () => {
    const modalInstance = Modal.getInstance(deleteModalRef.current);
    if (modalInstance) modalInstance.hide();
  };

  const resetForm = () => {
    setFormData({
      user_id: "",
      user_name: "",
      user_email: "",
      user_contact: "",
      user_password: "",
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div>
        {messages && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {messages}
          </div>
        )}
        <h3>{title}</h3>
        <button className="btn btn-primary mb-3" onClick={openModal}>
          Add User
        </button>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>S.N</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.user_id}>
                  <td>{index+1}</td>
                  <td>{user.user_name}</td>
                  <td>{user.user_email}</td>
                  <td>{user.user_contact}</td>
                  <td>
                    <button
                      className="fa-regular fa-pen-to-square"
                      onClick={() => editDetails(user.user_id)}
                    >
                    </button>
                    <button
                      className="fa-regular fa-trash-can ms-4"
                      onClick={() => openDeleteModal(user.user_id)}
                    >
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No Users Found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit User */}
      <div className="modal fade" ref={modalRef} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{formData.user_id ? "Edit User" : "Add User"}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  className="form-control mb-2"
                  placeholder="User Name"
                  required
                />
                <input
                  type="email"
                  name="user_email"
                  value={formData.user_email}
                  onChange={handleChange}
                  className="form-control mb-2"
                  placeholder="User Email"
                  required
                />
                <input
                  type="text"
                  name="user_contact"
                  value={formData.user_contact}
                  onChange={handleChange}
                  className="form-control mb-2"
                  placeholder="User Contact"
                  required
                />
                <input
                  type="password"
                  name="user_password"
                  value={formData.user_password}
                  onChange={handleChange}
                  className="form-control mb-3"
                  placeholder="Password"
                />
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div className="modal fade" ref={deleteModalRef} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Delete User</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">Are you sure you want to delete this user?</div>
            <div className="modal-footer">
              <button className="btn btn-danger" onClick={deleteUser}>
                Delete
              </button>
              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateUser;
