import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

function SingleProject() {
    const [singleprojectdata, setSingleProjectData] = useState({});  
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState(""); // To store the title from API response

    const fetchProject = async (projectId) => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/single_project_data/', {
                params: { project_id: projectId } // Pass project_id as a query parameter
            });
            console.log(response.data.data);
            setSingleProjectData(response.data.data || {});
            setTitle(response.data.title);
            setLoading(false);
        } catch (err) {
            setError('Failed to load project details');
            setLoading(false);
        }
    };

    // Fetch project data on component mount
    useEffect(() => {
        const projectId = 3; // Replace this with dynamic ID if needed (e.g., from route params)
        fetchProject(projectId);
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h3>Project : {title}</h3>

            <Link to="/project-machines">project-machines</Link>
            <Link to="/project-day-details">project-day-details</Link>
            <Link to="/project-persons">project-persons</Link>
            <Link to="/project-materials">project-materials</Link>
            
            <ul>
                <li><strong>Project ID:</strong> {singleprojectdata.project_id}</li>
                <li><strong>Project Name:</strong> {singleprojectdata.project_name}</li>
                <li><strong>Amount:</strong> {singleprojectdata.project_amount}</li>
                <li><strong>Location:</strong> {singleprojectdata.project_location}</li>
                <li><strong>Type:</strong> {singleprojectdata.project_type_name}</li>
                <li><strong>Status:</strong> {singleprojectdata.project_status}</li>
                <li><strong>Start Date:</strong> {singleprojectdata.project_start_date}</li>
                <li><strong>End Date:</strong> {singleprojectdata.project_end_date}</li>
                <li><strong>Owner Name:</strong> {singleprojectdata.project_owner_name || 'N/A'}</li>
                <li><strong>Owner Contact:</strong> {singleprojectdata.project_owner_contact_number || 'N/A'}</li>
                <li><strong>CGST:</strong> {singleprojectdata.project_cgst}</li>
                <li><strong>SGST:</strong> {singleprojectdata.project_sgst}</li>
                <li><strong>Tax:</strong> {singleprojectdata.project_tax}</li>
                <li><strong>Discount:</strong> {singleprojectdata.project_discount}</li>
            </ul>
        </div>
    );
}

export default SingleProject;
