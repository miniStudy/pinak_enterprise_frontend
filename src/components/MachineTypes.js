import React, { useEffect, useState } from 'react';
import axios from 'axios';  // Import axios

const MachineTypes = () => {
    const [machinetypesDetails, setMachineTypesDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/show_machine_types/')
            .then((response) => {
                setMachineTypesDetails(response.data.data);
                setTitle(response.data.title);
                setLoading(false);
            })
            .catch((err) => {
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
                        <th>Bank ID</th>
                        <th>Machine Type</th>
                    </tr>
                </thead>
                <tbody>
                    {machinetypesDetails.map((x) => (
                        <tr key={x.machine_type_id}>
                            <td>{x.machine_type_id}</td>
                            <td>{x.machine_type_name}</td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MachineTypes;
