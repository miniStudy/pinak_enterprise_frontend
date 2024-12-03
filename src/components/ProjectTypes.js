import React, { useEffect, useState } from "react";
import axios from "axios";

const ProjectTypes = () => {
  const [projectTypes, setProjectTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch project types from API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/show_project_types/") // Adjust the URL if needed
      .then((response) => {
        setProjectTypes(response.data.data || []); // Set project types
        setLoading(false); // Stop loading
      })
      .catch((err) => {
        console.error("Error fetching data:", err); // Log error
        setError("Failed to load project types"); // Set error message
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

  // Render the project types table
  return (
    <div>
      <h1>Project Types</h1>
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Project Type ID</th>
            <th>Project Type Name</th>
            <th>Project Type Details</th>
          </tr>
        </thead>
        <tbody>
          {projectTypes.length > 0 ? (
            projectTypes.map((project) => (
              <tr key={project.project_type_id}>
                <td>{project.project_type_id || "N/A"}</td>
                <td>{project.project_type_name || "N/A"}</td>
                <td>{project.project_type_details || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No project types available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTypes;
