import React, { useEffect, useState } from 'react';
import axios from 'axios';  // Import axios
const WorkingMachines = () => {
    const [workingmachinesDetails, setWorkingMachinesDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/show_working_machines/')
            .then((response) => {
                setWorkingMachinesDetails(response.data.data || []);
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
                    <th>Machine Name</th>
                    <th>Owner's Name</th>
                    <th>Plate Number</th>
                    <th>Machine Type</th>
                    <th>Ownership</th>
                    <th>Owner Contact</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Rented Amount</th>
                    <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                {workingmachinesDetails.length > 0 ? (
                        workingmachinesDetails.map((x) => (
                            <tr key={x.working_machine_id}>
                            <td>{x.working_machine_id || "N/A"}</td>
                            <td>{x.working_machine_name || "N/A"}</td>
                            <td>{x.working_machine_owner_name || "N/A"}</td>
                            <td>{x.working_machine_plate_number || "N/A"}</td>
                            <td>{x.machine_type_id__machine_type_name || "N/A"}</td>
                            <td>{x.working_machine_ownership || "N/A"}</td>
                            <td>{x.working_machine_owner_contact || "N/A"}</td>
                            <td>{x.working_machine_start_date || "N/A"}</td>
                            <td>{x.working_machine_end_date || "N/A"}</td>
                            <td>{x.working_machine_rented_amount || "N/A"}</td>
                            <td>{x.working_machine_details || "N/A"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="11">No working machine details available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
export default WorkingMachines;
