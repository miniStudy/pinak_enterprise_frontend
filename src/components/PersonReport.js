import React, { useState, useEffect } from "react";
import Select from "react-select"; // Make sure you have react-select installed
import axios from "axios";

const PersonReport = () => {
    const [PersonData, setPersonData] = useState([]);
    const [PersonID, setPersonID] = useState("");
    const [PersonTypeData, setPersonTypeData] = useState([]);
    const [PersonType, setPersonType] = useState("");
    const [ProjectData, setProjectData] = useState([]);
    const [MachineData, setMachineData] = useState([]);
    const [SalaryData, setSalaryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [Messages, setMessages] = useState("");

    // Fetch initial data
    const fetchPersonReport = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://127.0.0.1:8000/show_person_report/");
            setPersonData(response.data.persons_data || []);
            setPersonTypeData(response.data.person_types_data || []);
            setProjectData(response.data.projects_data || []);
            setMachineData(response.data.machines_data || []);
            setSalaryData(response.data.salary_data || []);
            setLoading(false);
        } catch (err) {
            setError("Failed to load person report details.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPersonReport();
    }, []);

    useEffect(() => {
        if (Messages) {
            const timer = setTimeout(() => {
                setMessages("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [Messages]);

    // Options for dropdowns
    const personTypeOptions = PersonTypeData.map((type) => ({
        value: type.person_type_name,
        label: type.person_type_name,
    }));

    const personOptions = PersonData.map((person) => ({
        value: person.person_id,
        label: `${person.person_name} (${person.person_contact_number})`,
    }));

    const projectOptions = ProjectData.map((project) => ({
        value: project.project_id,
        label: project.project_name,
    }));

    const machineOptions = MachineData.map((machine) => ({
        value: machine.machine_id,
        label: `${machine.machine_name} (${machine.machine_number_plate})`,
    }));

    const handlePersonTypeChange = async (selectedOption) => {
        const newPersonType = selectedOption ? selectedOption.value : "";
        setPersonType(newPersonType);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/show_person_report/?person_type_name=${newPersonType}`);
            setPersonData(response.data.persons_data || []);
        } catch (error) {
            console.error("Error fetching type person data:", error);
        }
    };

    const handlePersonChange = async (selectedOption) => {
        const newPersonID = selectedOption ? selectedOption.value : "";
        setPersonID(newPersonID);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/show_person_report/?person_id=${newPersonID}`);
            setPersonData(response.data.persons_data || []);
            setSalaryData(response.data.salary_data || []);
        } catch (error) {
            console.error("Error fetching person data:", error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <div>
                <h2>Person Report</h2>
                <div className="form-group">
                    <label>Person Type</label>
                    <Select
                        options={personTypeOptions}
                        value={personTypeOptions.find((option) => option.value === PersonType)}
                        onChange={handlePersonTypeChange}
                        isSearchable
                        isClearable
                        className="react-select-container mb-3"
                        classNamePrefix="react-select"
                    />
                </div>
                <div className="form-group">
                    <label>Person</label>
                    <Select
                        options={personOptions}
                        value={personOptions.find((option) => option.value === PersonID)}
                        onChange={handlePersonChange}
                        isSearchable
                        isClearable
                        className="react-select-container mb-3"
                        classNamePrefix="react-select"
                    />
                </div>
                <div className="form-group">
                    <label>Project</label>
                    <Select
                        options={projectOptions}
                        isSearchable
                        isClearable
                        className="react-select-container mb-3"
                        classNamePrefix="react-select"
                    />
                </div>
                <div className="form-group">
                    <label>Machine</label>
                    <Select
                        options={machineOptions}
                        isSearchable
                        isClearable
                        className="react-select-container mb-3"
                        classNamePrefix="react-select"
                    />
                </div>
                {Messages && <div className="alert alert-success">{Messages}</div>}
            </div>

            {PersonID && (
                <>
                <div className="person-data mt-4">
                    <h3>Person Details</h3>
                    {PersonData.length > 0 ? (
                        <ul className="bg-white shadow rounded-lg p-6 mt-4">
                            {PersonData.map((person) => (
                                <li
                                    key={person.person_id}
                                    className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-200 py-4 last:border-none"
                                >
                                    <div>
                                        <p className="text-lg font-bold text-gray-700">
                                            Name: <span className="font-normal">{person.person_name}</span>
                                        </p>
                                        <p className="font-bold text-gray-700">
                                            Contact: <span className="font-medium">{person.person_contact_number}</span>
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center text-gray-500 mt-6">No person data available.</div>
                    )}

                </div>


<div class="grid grid-cols-1 md:grid-cols-1 gap-3 md:gap-4 mt-3">
                <div className="card">
                    <h5 className='mb-2 text-center'>Person Salary</h5>
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Person</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Working days</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {SalaryData.length > 0 ? (
                                    SalaryData.map((x) => (
                                        <tr key={x.salary_id}>
                                            <td>{x.person_id__person_name || "N/A"} [{x.person_id__person_contact_number}]</td>
                                            <td><i class="fa-solid fa-indian-rupee-sign"></i> {x.salary_amount || "N/A"}</td>
                                            <td>{x.salary_date || "N/A"}</td>
                                            <td>{x.salary_working_days || "N/A"}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9">No debit details available.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {/* <div className='font-semibold text-base'>Total Amount: <i class="fa-solid fa-indian-rupee-sign"></i>{TotalDebit}</div> */}
                    </div>
                </div>
            </div>
            </>      
            )}


        </>
    );
};
export default PersonReport;