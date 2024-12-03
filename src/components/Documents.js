import React, { useEffect, useState } from "react";
import axios from "axios";

const Documents = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("Documents"); // Default title

  // Fetch data from the API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/show_documents/") // Adjust the URL if necessary
      .then((response) => {
        setData(response.data.data || []); // Set table data
        setTitle(response.data.title || "Documents"); // Use title from backend if provided
        setLoading(false); // Stop loading
      })
      .catch((err) => {
        console.error("Error fetching data:", err); // Log error
        setError("Failed to load documents."); // Set error message
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
            <th>Document ID</th>
            <th>Document Name</th>
            <th>Document Date</th>
            <th>Document Unique Code</th>
            <th>Document File</th>
            <th>Document Type</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((document) => (
              <tr key={document.document_id}>
                <td>{document.document_id || "N/A"}</td>
                <td>{document.document_name || "N/A"}</td>
                <td>{document.document_date || "N/A"}</td>
                <td>{document.document_unique_code || "N/A"}</td>
                <td>
                  {document.document_file ? (
                    <a href={document.document_file} target="_blank" rel="noopener noreferrer">
                      View File
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>{document.document_type_id__document_type_name || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No documents available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Documents;