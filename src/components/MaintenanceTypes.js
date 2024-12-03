import React, { useEffect, useState } from "react";
import axios from "axios";

const MaintenanceTypes = () => {
  const [maintenanceTypes, setMaintenanceTypes] = useState([]); // State for maintenance types
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error message
  const [title, setTitle] = useState(""); // State for title from the API response

  // Fetch maintenance types from API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/show_maintenance_types/")
      .then((response) => {
        setMaintenanceTypes(response.data.data || []); // Update maintenance types
        setTitle(response.data.title); // Update title
        setLoading(false); // Stop loading
      })
      .catch((err) => {
        console.error("Error fetching data:", err); // Log error
        setError("Failed to load maintenance types"); // Set error message
        setLoading(false); // Stop loading
      });
  }, []);

  // Show loading message while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error message if fetching data failed
  if (error) {
    return <div>{error}</div>;
  }

  // Render the maintenance types table
  return (
    <div>
      <h1>{title}</h1> {/* Display the title */}
      <table border="1" style={{ width: "50%", textAlign: "left", margin: "20px auto" }}>
        <thead>
          <tr>
            <th>Maintenance Type ID</th>
            <th>Maintenance Type Name</th>
          </tr>
        </thead>
        <tbody>
          {maintenanceTypes.length > 0 ? (
            maintenanceTypes.map((type) => (
              <tr key={type.maintenance_type_id}>
                <td>{type.maintenance_type_id || "N/A"}</td>
                <td>{type.maintenance_type_name || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                No maintenance types available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceTypes;
