import React, { useEffect, useState } from "react";
import axios from "axios";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(""); // To store the title from API response

  // Fetch projects from API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/show_projects/") // Adjust the URL if needed
      .then((response) => {
        setProjects(response.data.data || []); // Set projects data
        setTitle(response.data.title); // Set title from API
        setLoading(false); // Stop loading
      })
      .catch((err) => {
        console.error("Error fetching data:", err); // Log error
        setError("Failed to load projects data"); // Set error message
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

  // Render the projects table
  return (
    <div>
      <h1>{title}</h1> {/* Display the title */}
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Project ID</th>
            <th>Project Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Amount</th>
            <th>Location</th>
            <th>Company Name</th>
            <th>Person Name</th>
            <th>Status</th>
            <th>Project Type Name</th>
          </tr>
        </thead>
        <tbody>
          {projects.length > 0 ? (
            projects.map((project) => (
              <tr key={project.project_id}>
                <td>{project.project_id || "N/A"}</td>
                <td>{project.project_name || "N/A"}</td>
                <td>{project.project_start_date || "N/A"}</td>
                <td>{project.project_end_date || "N/A"}</td>
                <td>{project.project_amount || "N/A"}</td>
                <td>{project.project_location || "N/A"}</td>
                <td>{project.project_company_name || "N/A"}</td>
                <td>{project.project_person_name || "N/A"}</td>
                <td>{project.project_status || "N/A"}</td>
                <td>{project.project_types_id__project_type_name || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" style={{ textAlign: "center" }}>
                No projects available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Projects;