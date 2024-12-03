import React, { useEffect, useState } from "react";
import axios from "axios";

const PersonTypes = () => {
  const [personTypes, setPersonTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(""); // Set title

  // Fetch person types from API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/show_person_types/") // Adjust the URL if needed
      .then((response) => {
        setPersonTypes(response.data.data || []); // Update person types
        setTitle(response.data.title);
        setLoading(false); // Stop loading
      })
      .catch((err) => {
        console.error("Error fetching data:", err); // Log error
        setError("Failed to load person types data"); // Set error message
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

  // Render the person types table
  return (
    <div>
      <h1>{title}</h1> {/* Display the title */}
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Person Type ID</th>
            <th>Person Type Name</th>
          </tr>
        </thead>
        <tbody>
          {personTypes.length > 0 ? (
            personTypes.map((personType) => (
              <tr key={personType.person_type_id}>
                <td>{personType.person_type_id || "N/A"}</td>
                <td>{personType.person_type_name || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                No person types available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PersonTypes;
