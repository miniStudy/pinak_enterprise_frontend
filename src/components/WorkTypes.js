import React, { useEffect, useState } from "react";
import axios from "axios";

const WorkTypes = () => {
  const [workTypes, setWorkTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(""); // State to store the titl

  // Fetch work types data from API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/show_work_types/") // Adjust the URL if needed
      .then((response) => {
        setWorkTypes(response.data.data || []); // Update work types data
        setTitle(response.data.title || ""); // Update title
        setLoading(false); // Stop loading
      })
      .catch((err) => {
        console.error("Error fetching data:", err); // Log error
        setError("Failed to load work types data"); // Set error message
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

  // Render the work types table
  return (
    <div>
      <h1>{title}</h1> {/* Display the title */}
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Work Type ID</th>
            <th>Work Type Name</th>
            <th>Work Type Details</th>
          </tr>
        </thead>
        <tbody>
          {workTypes.length > 0 ? (
            workTypes.map((workType) => (
              <tr key={workType.work_type_id}>
                <td>{workType.work_type_id || "N/A"}</td>
                <td>{workType.work_type_name || "N/A"}</td>
                <td>{workType.work_type_details || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No work types data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WorkTypes;
