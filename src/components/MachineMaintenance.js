import React, { useEffect, useState } from "react";
import axios from "axios";

const MachineMaintenance = () => {
  const [machineMaintenance, setMachineMaintenance] = useState([]); // State for machine maintenance data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error message
  const [title, setTitle] = useState(""); // State for title from API response

  // Fetch machine maintenance data from API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/show_machine_maintenance/")
      .then((response) => {
        console.log("API Response:", response.data); // Debug API response
        setMachineMaintenance(response.data.data || []); // Update machine maintenance data
        setTitle(response.data.title); // Update title
        setLoading(false); // Stop loading
      })
      .catch((err) => {
        console.error("Error fetching data:", err); // Log error
        setError("Failed to load machine maintenance data"); // Set error message
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

  // Render the machine maintenance table
  return (
    <div>
      <h1>{title}</h1> {/* Display the title */}
      <table border="1" style={{ width: "100%", textAlign: "left", margin: "20px auto" }}>
        <thead>
          <tr>
            <th>Maintenance ID</th>
            <th>Maintenance Amount</th>
            <th>Maintenance Date</th>
            <th>Amount Paid</th>
            <th>Paid By</th>
            <th>Maintenance Person</th>
            <th>Contact</th>
            <th>Driver</th>
            <th>Details</th>
            <th>Type ID</th>
            <th>Type Name</th>
          </tr>
        </thead>
        <tbody>
          {machineMaintenance.length > 0 ? (
            machineMaintenance.map((maintenance) => (
              <tr key={maintenance.machine_maintenance_id}>
                <td>{maintenance.machine_maintenance_id || "N/A"}</td>
                <td>{maintenance.machine_maintenance_amount || "N/A"}</td>
                <td>{maintenance.machine_maintenance_date || "N/A"}</td>
                <td>{maintenance.machine_maintenance_amount_paid ? "Yes" : "No"}</td>
                <td>{maintenance.machine_maintenance_amount_paid_by || "N/A"}</td>
                <td>{maintenance.machine_maintenance_person || "N/A"}</td>
                <td>{maintenance.machine_maintenance_contact || "N/A"}</td>
                <td>{maintenance.machine_maintenance_driver || "N/A"}</td>
                <td>{maintenance.machine_maintenance_details || "N/A"}</td>
                <td>{maintenance.machine_maintenance_types_id__maintenance_type_id || "N/A"}</td>
                <td>{maintenance.machine_maintenance_types_id__maintenance_type_name || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" style={{ textAlign: "center" }}>
                No machine maintenance records available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MachineMaintenance;
