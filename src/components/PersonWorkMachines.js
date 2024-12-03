import React, { useEffect, useState } from "react";
import axios from "axios";

const PersonWorkMachine = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(""); // State to store the title

  // Fetch data from the API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/show_person_work_machine/") // Adjust URL if needed
      .then((response) => {
        setData(response.data.data || []); // Update table data
        setTitle(response.data.title || "Person Work Machine"); // Update title or set default
        setLoading(false); // Stop loading
      })
      .catch((err) => {
        console.error("Error fetching data:", err); // Log error
        setError("Failed to load data"); // Set error message
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

  // Render the data table
  return (
    <div>
      <h1>{title}</h1> {/* Display the title */}
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Machine Name</th>
            <th>Owner Name</th>
            <th>Owner Contact</th>
            <th>Working Machine Name</th>
            <th>Joining Date</th>
            <th>Person Contact</th>
            <th>Payment By</th>
            <th>Payment Description</th>
            <th>Person Type</th>
            <th>Person Name</th>
            <th>Project Type</th>
            <th>Project Name</th>
            <th>Work Type</th>
            <th>Work Number</th>
            <th>Work Amount</th>
            <th>Total Amount</th>
            <th>Work Description</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.pwm_id}>
                <td>{item.pwm_id || "N/A"}</td>
                <td>{item.pwm_machine_name || "N/A"}</td>
                <td>{item.pwm_machine_owner_name || "N/A"}</td>
                <td>{item.pwm_machine_owner_number || "N/A"}</td>
                <td>{item.working_machine_id__working_machine_name || "N/A"}</td>
                <td>{item.pwm_person_joining_date || "N/A"}</td>
                <td>{item.pwm_person_contact_number || "N/A"}</td>
                <td>{item.pwm_person_payment_by || "N/A"}</td>
                <td>{item.pwm_person_payment_desc || "N/A"}</td>
                <td>{item.person_type_id__person_type_name || "N/A"}</td>
                <td>{item.person_id__person_name || "N/A"}</td>
                <td>{item.project_type_id__project_type_name || "N/A"}</td>
                <td>{item.project_id__project_name || "N/A"}</td>
                <td>{item.work_types_id__work_type_name || "N/A"}</td>
                <td>{item.pwm_work_number || "N/A"}</td>
                <td>{item.pwm_work_amount || "N/A"}</td>
                <td>{item.pwm_total_amount || "N/A"}</td>
                <td>{item.pwm_work_desc || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="18" style={{ textAlign: "center" }}>
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PersonWorkMachine;