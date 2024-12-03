import React, { useEffect, useState } from 'react';
import axios from 'axios';  // Import axios
const Machines = () => {
    const [machinesDetails, setMachinesDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/show_company_machines/')
            .then((response) => {
                setMachinesDetails(response.data.data || []);
                setTitle(response.data.title);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load bank details');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>{title}</h1> {/* Use the 'title' state here */}
            <table>
                <thead>
                    <tr>
                        <th>Machine ID</th>
                        <th>Owner's Name</th>
                        <th>Purchase Date</th>
                        <th>Machine Condition</th>
                        <th>Number Plate</th>                       
                        <th>Contact Number</th>
                        <th>Sold Out Date</th>
                        <th>Sold Amount</th>
                        <th>Machine Working</th>
                        <th>Machine Type Name</th>
                        <th>Machine Details</th>
                    </tr>
                </thead>
                <tbody>
                {machinesDetails.length > 0 ? (
                        machinesDetails.map((y) => (
                            <tr key={y.machine_id}>
                                <td>{y.machine_id || "N/A"}</td>
                                <td>{y.machine_owner || "N/A"}</td>
                                <td>{y.machine_buy_date || "N/A"}</td>
                                <td>{y.machine_condition || "N/A"}</td>
                                <td>{y.machine_number_plate || "N/A"}</td>
                                <td>{y.machine_contact_number || "N/A"}</td>
                                <td>{y.machine_sold_out_date || "N/A"}</td>
                                <td>{y.machine_sold_price || "N/A"}</td>
                                <td>{y.machine_working ? "Yes" : "No"}</td>
                                <td>{y.machine_types_id__machine_type_name || "N/A"}</td>
                                <td>{y.machine_details || "N/A"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="11">No machine details available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Machines;
