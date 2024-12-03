import React, { useEffect, useState } from "react";
import axios from "axios";

const PayTypes = () => {
  const [payTypes, setPayTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(""); // To store the title from API response

  // Fetch pay types from API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/show_pay_types/") // Adjust the URL if needed
      .then((response) => {
        setPayTypes(response.data.data || []); // Set pay types data
        setTitle("Pay Types"); // Set title from API (or hardcode if not returned)
        setLoading(false); // Stop loading
      })
      .catch((err) => {
        console.error("Error fetching data:", err); // Log error
        setError("Failed to load pay types data"); // Set error message
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

  // Render the pay types table
  return (
    <div>
      <h1>{title}</h1> {/* Display the title */}
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Pay Type ID</th>
            <th>Pay Type Name</th>
            <th>Pay Type Date</th>
          </tr>
        </thead>
        <tbody>
          {payTypes.length > 0 ? (
            payTypes.map((payType) => (
              <tr key={payType.pay_type_id}>
                <td>{payType.pay_type_id || "N/A"}</td>
                <td>{payType.pay_type_name || "N/A"}</td>
                <td>{payType.pay_type_date || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No pay types available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PayTypes;