import React, { useEffect, useState } from "react";
import axios from "axios";

const MaterialTypes = () => {
  const [materialTypes, setMaterialTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(""); // State to store the title

  // Fetch material types from API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/show_material_types/") // Adjust the URL if needed
      .then((response) => {
        setMaterialTypes(response.data.data || []); // Update material types data
        setTitle(response.data.title); // Update title or set default
        setLoading(false); // Stop loading
      })
      .catch((err) => {
        console.error("Error fetching data:", err); // Log error
        setError("Failed to load material types data"); // Set error message
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

  // Render the material types table
  return (
    <div>
      <h1>{title}</h1> {/* Display the title */}
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Material Type ID</th>
            <th>Material Type Name</th>
          </tr>
        </thead>
        <tbody>
          {materialTypes.length > 0 ? (
            materialTypes.map((materialType) => (
              <tr key={materialType.material_type_id}>
                <td>{materialType.material_type_id || "N/A"}</td>
                <td>{materialType.material_type_name || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                No material types data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialTypes;