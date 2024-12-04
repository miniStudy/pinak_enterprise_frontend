import React, { useEffect, useState } from 'react';
import axios from 'axios';  // Import axios

const Banks = () => {
    const [bankDetails, setBankDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');

    // Fetch bank details using useEffect and axios
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/show_bank_details/') // Update with your API URL
            .then((response) => {
                setBankDetails(response.data.data); // Assuming 'data' is the key that holds the bank details
                setTitle(response.data.title); // Assuming 'title' is part of the response
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
                        <th>Bank Name</th>
                        <th>Branch</th>
                        <th>Account Number</th>
                        <th>IFSC Code</th>
                        <th>Account Holder</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {bankDetails.map((bank) => (
                        <tr key={bank.bank_id}>
                            <td>{bank.bank_id}</td>
                            <td>{bank.bank_name}</td>
                            <td>{bank.bank_branch}</td>
                            <td>{bank.bank_account_number}</td>
                            <td>{bank.bank_ifsc_code}</td>
                            <td>{bank.bank_account_holder}</td>
                            <td>{bank.bank_open_closed}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Banks;
