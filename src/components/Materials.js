import React, { useEffect, useState } from "react";
import axios from "axios";

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(""); // State to store the title

  // Fetch materials from API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/show_materials/") // Adjust the URL if needed
      .then((response) => {
        setMaterials(response.data.data || []); // Update materials data
        setTitle(response.data.title || "Materials"); // Update title or set default
        setLoading(false); // Stop loading
      })
      .catch((err) => {
        console.error("Error fetching data:", err); // Log error
        setError("Failed to load materials data"); // Set error message
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

  // Render the materials table
  return (
    <div>
      <h1>{title}</h1> {/* Display the title */}
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
  );
};

export default Materials;
