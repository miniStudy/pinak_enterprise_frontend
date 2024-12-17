import React, { useEffect, useState } from "react";
import axios from "axios";

const CompanyDetails = () => {
  const [companyData, setCompanyData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch company details
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/show_comapny_details/"
        );
        if (response.data.status === "success") {
          setCompanyData(response.data.data);
          setUpdatedData(response.data.data); // Pre-fill update fields
        }
      } catch (error) {
        console.error("Error fetching company details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setUpdatedData({
      ...updatedData,
      [name]: files ? files[0] : value,
    });
  };

  // Submit updated data
  const handleUpdate = async () => {
    const formData = new FormData();
    for (const key in updatedData) {
      formData.append(key, updatedData[key]);
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/insert_update_comapny_detail/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data.status === "success") {
        alert(response.data.message);
        setCompanyData(response.data.data);
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error updating company details:", error);
    }
  };

  if (loading) return <p>Loading company details...</p>;

  return (
    <div className="flex justify-center items-start p-7">
  <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
    <h2 className="text-2xl font-bold mb-4 text-blue-800 border-b pb-2">
      Company Details
    </h2>
    <div className="mb-2">
      <img
        src={companyData.company_logo}
        alt="Company Logo"
        className="w-24 h-24 object-cover rounded-full border-2 border-blue-400"
      />
    </div>

    <div className="space-y-2">
      {/* Contact Number */}
      <div className="flex flex-col">
        <label className="text-gray-700 font-medium">Contact Number</label>
        {editMode ? (
          <input
            type="text"
            name="company_contact_number"
            value={updatedData.company_contact_number || ""}
            onChange={handleChange}
            className="border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <p className="text-gray-600">{companyData.company_contact_number}</p>
        )}
      </div>

      {/* Owner Name */}
      <div className="flex flex-col">
        <label className="text-gray-700 font-medium">Owner Name</label>
        {editMode ? (
          <input
            type="text"
            name="company_owner_name"
            value={updatedData.company_owner_name || ""}
            onChange={handleChange}
            className="border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <p className="text-gray-600">{companyData.company_owner_name}</p>
        )}
      </div>

      {/* Owner Contact */}
      <div className="flex flex-col">
        <label className="text-gray-700 font-medium">Owner Contact</label>
        {editMode ? (
          <input
            type="text"
            name="company_owner_contact"
            value={updatedData.company_owner_contact || ""}
            onChange={handleChange}
            className="border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <p className="text-gray-600">{companyData.company_owner_contact}</p>
        )}
      </div>

      {/* Address */}
      <div className="flex flex-col">
        <label className="text-gray-700 font-medium">Address</label>
        {editMode ? (
          <textarea
            name="company_address"
            value={updatedData.company_address || ""}
            onChange={handleChange}
            rows="3"
            className="border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        ) : (
          <p className="text-gray-600">{companyData.company_address}</p>
        )}
      </div>

    </div>

    {/* Buttons */}
    <div className="flex justify-start mt-6 space-x-4">
      {editMode ? (
        <>
          <button
            onClick={handleUpdate}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300"
          >
            Save Changes
          </button>
          <button
            onClick={() => setEditMode(false)}
            className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded transition duration-300"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={() => setEditMode(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300"
        >
          Update
        </button>
      )}
    </div>
  </div>
</div>

  );
};

export default CompanyDetails;