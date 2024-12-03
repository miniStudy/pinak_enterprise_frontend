import React, { useEffect, useState } from "react";
import axios from "axios";

const Persons = () => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(); // Set title dynamically if required

  // Fetch persons data from API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/show_persons/") // Adjust the URL if needed
      .then((response) => {
        setPersons(response.data.data || []); // Update persons data
        setTitle(response.data.title);
        setLoading(false); // Stop loading
      })
      .catch((err) => {
        console.error("Error fetching data:", err); // Log error
        setError("Failed to load persons data"); // Set error message
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

  // Render the persons table
  return (
    <div>
      <h1>{title}</h1> {/* Display the title */}
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Person ID</th>
            <th>Person Name</th>
            <th>Contact Number</th>
            <th>Work Type</th>
            <th>Person Type Name</th>
          </tr>
        </thead>
        <tbody>
          {persons.length > 0 ? (
            persons.map((person) => (
              <tr key={person.person_id}>
                <td>{person.person_id || "N/A"}</td>
                <td>{person.person_name || "N/A"}</td>
                <td>{person.person_contact_number || "N/A"}</td>
                <td>{person.person_work_type || "N/A"}</td>
                <td>{person.person_type_id__person_type_name || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No persons data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Persons;