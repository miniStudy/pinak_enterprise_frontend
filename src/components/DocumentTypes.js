import React, { useEffect, useState } from "react";
import axios from "axios";

const DocumentTypes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("Document Types"); // Default title

  // Fetch data from the API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/show_document_types/") // Adjust URL if necessary
      .then((response) => {
        setData(response.data.data || []); // Update table data
        setTitle(response.data.title || "Document Types"); // Use backend title if provided
        setLoading(false); // Stop loading
      })
      .catch((err) => {
        console.error("Error fetching data:", err); // Log error
        setError("Failed to load document types."); // Set error message
        setLoading(false); // Stop loading
      });
  }, []);

  // Show loading message while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error message if data fetching failed
  if (error) {
    return <div>{error}</div>;
  }

  // Render the data table
  return (
    <div>
      <h1>{title}</h1> {/* Display title */}
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Document Type ID</th>
            <th>Document Type Name</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.document_type_id}>
                <td>{item.document_type_id || "N/A"}</td>
                <td>{item.document_type_name || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                No document types available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTypes;