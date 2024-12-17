import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select'; // Ensure you have installed 'react-select'

const Reports = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);
    const [projectID, setProjectID] = useState('');


    const [projectMachineData, setProjectMachineData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [ProjectDayDetailsData, setProjectDayDetailsData] = useState([]);
    const [ProjectDayDetailsTotalAmount, setProjectDayDetailsTotalAmount] = useState(0);
    const [ProjectPersonData, setProjectPersonData] = useState([]);
    const [ProjectPersonTotalAmount, setProjectPersonTotalAmount] = useState(0);
    const [finalTotalAmount, setFinalTotalAmount] = useState(0);
    const [ProjectExpenseData, setProjectExpenseData] = useState(0);
    const [ProjectExpenseTotalAmount, setProjectExpenseTotalAmount] = useState(0);

    const [showProjectMachine, setShowProjectMachine] = useState(true);
    const [showProjectDayDetails, setShowProjectDayDetails] = useState(true);
    const [showProjectPerson, setShowProjectPerson] = useState(true);
    const [showProjectExpense, setShowProjectExpense] = useState(true);


    const projectOptions = [
        { value: '', label: 'Select Project' },
        ...projects.map((project) => ({
            value: project.project_id,
            label: project.project_name,
        })),
    ];

    useEffect(() => {
        axios
            .get('http://127.0.0.1:8000/show_reports/')
            .then((response) => {
                if (response.data.status === 'success') {
                    setProjects(response.data.data);
                } else {
                    console.error('Failed to fetch projects');
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching projects:', error);
                setLoading(false);
                setError('Failed to load projects.');
            });
    }, []);



    const handleProjectChange = async (selectedOption) => {
        const newProjectID = selectedOption ? selectedOption.value : '';
        setProjectID(newProjectID); // Update the state

        if (!newProjectID) {
            setProjectMachineData([]);
            setProjectDayDetailsData([]);
            setTotalAmount(0);
            return;
        }

        setLoading(true); // Show loading indicator
        try {
            const project_machine_response = await axios.get(
                `http://127.0.0.1:8000/show_project_machine/?project_id=${newProjectID}`
            );
            setProjectMachineData(project_machine_response.data.data || []);
            setTotalAmount(project_machine_response.data.total_amount || 0);

            const project_day_detail_response = await axios.get(
                `http://127.0.0.1:8000/show_project_day_details/?project_id=${newProjectID}`
            );
            setProjectDayDetailsData(project_day_detail_response.data.data || []);
            setProjectDayDetailsTotalAmount(project_day_detail_response.data.total_amount || 0);

            const project_person_response = await axios.get(`http://127.0.0.1:8000/show_project_person/?project_id=${newProjectID}`);
            setProjectPersonData(project_person_response.data.data || []);
            setProjectPersonTotalAmount(project_person_response.data.total_amount || 0);

            const project_expense_response = await axios.get(`http://127.0.0.1:8000/show_project_expense/?project_id=${newProjectID}`);
            setProjectExpenseData(project_expense_response.data.data || []);
            setProjectExpenseTotalAmount(project_expense_response.data.total_amount || 0);

            setError(null);
        } catch (err) {
            console.error('Error fetching project machine data:', err);
            setError('Failed to load project machine details');
        } finally {
            setLoading(false); // Hide loading
        }
    };
    useEffect(() => {
        let total = 0;

        if (showProjectMachine) {
            total += totalAmount;
        }
        if (showProjectDayDetails) {
            total += ProjectDayDetailsTotalAmount;
        }
        if (showProjectPerson) {
            total += ProjectPersonTotalAmount;
        }

        setFinalTotalAmount(total);
    }, [totalAmount, ProjectDayDetailsTotalAmount, ProjectPersonTotalAmount, showProjectMachine, showProjectDayDetails, showProjectPerson]);


    return (
        <div>
            <h3>Reports</h3>
            <Select
                options={projectOptions}
                value={projectOptions.find((option) => option.value === projectID)}
                onChange={handleProjectChange}
                placeholder="Select Project"
                isSearchable
                isClearable
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{ container: (base) => ({ ...base, width: '300px' }) }}
            />
            <div className="mt-4">
                <label>
                    <input
                        type="checkbox"
                        checked={showProjectMachine}
                        onChange={() => setShowProjectMachine(!showProjectMachine)}
                    />
                    Project Machine
                </label>
                <label className="ml-4">
                    <input
                        type="checkbox"
                        checked={showProjectDayDetails}
                        onChange={() => setShowProjectDayDetails(!showProjectDayDetails)}
                    />
                    Project Day Details
                </label>
                <label className="ml-4">
                    <input
                        type="checkbox"
                        checked={showProjectPerson}
                        onChange={() => setShowProjectPerson(!showProjectPerson)}
                    />
                    Project Person
                </label>
                <label className="ml-4">
                    <input
                        type="checkbox"
                        checked={showProjectExpense}
                        onChange={() => setShowProjectExpense(!showProjectExpense)}
                    />
                    Project Expense
                </label>
            </div>

            <div className="mt-4 flex space-x-4">
                <div className="max-w-xs p-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold">Project Machine Total Amt</h2>
                    <div className="text-2xl font-bold mt-2">
                        <i className="fa-solid fa-indian-rupee-sign"></i>
                        {totalAmount}
                    </div>
                </div>

                <div className="max-w-xs p-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold">Final Total Amount</h2>
                    <div className="text-2xl font-bold mt-2">
                        <i className="fa-solid fa-indian-rupee-sign"></i>
                        {finalTotalAmount}
                    </div>
                </div>
            </div>




            {showProjectMachine && (
                <div className="grid grid-cols-1 md:grid-cols-1 gap-3 md:gap-4 mt-4">
                    <div className="card">
                        <h6 className="mb-2">Project Machines</h6>
                        <div className="table-responsive">
                            {loading ? (
                                <div>Loading...</div>
                            ) : (
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>S.N</th>
                                            <th>Date</th>
                                            <th>Machine Name</th>
                                            <th>Work Type</th>
                                            <th>Work Number</th>
                                            <th>Work Price</th>
                                            <th>Total Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projectMachineData.length > 0 ? (
                                            projectMachineData.map((detail, index) => (
                                                <tr key={detail.project_machine_data_id}>
                                                    <td>{index + 1 || 'N/A'}</td>
                                                    <td>{detail.project_machine_date || 'N/A'}</td>
                                                    <td>{detail.machine_project_id__machine_name || 'N/A'}</td>
                                                    <td>{detail.work_type_id__work_type_name || 'N/A'}</td>
                                                    <td>{detail.project_machine_data_work_number || 'N/A'}</td>
                                                    <td>{detail.project_machine_data_work_price || 'N/A'}</td>
                                                    <td>{detail.project_machine_data_total_amount || 'N/A'}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" style={{ textAlign: 'center' }}>
                                                    No project machine data available.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                            <div className="font-semibold text-base text-green-800">
                                Total Amount:{' '}
                                <i className="fa-solid fa-indian-rupee-sign"></i>
                                {totalAmount}
                            </div>
                        </div>
                    </div>
                </div>)}

            {showProjectDayDetails && (
                <div class="grid grid-cols-1 md:grid-cols-1 gap-3 md:gap-4 mt-4">
                    <div className="card">
                        <h6 className='mb-2'>PROJECT Day Details</h6>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>S.N</th>
                                        <th>Date</th>
                                        <th>Machine Name</th>
                                        <th>Work Type</th>
                                        <th>Work No</th>
                                        <th>Price</th>
                                        <th>Total Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ProjectDayDetailsData.length > 0 ? (
                                        ProjectDayDetailsData.map((detail, index) => (
                                            <tr key={detail.project_day_detail_id}>
                                                <td>{index + 1 || "N/A"}</td>
                                                <td>{detail.proejct_day_detail_date || "N/A"}</td>
                                                <td>{detail.project_day_detail_machine_id__machine_name || "N/A"}</td>
                                                <td>{detail.project_day_detail_work_type__work_type_name || "N/A"}</td>
                                                <td>{detail.project_day_detail_work_no || "N/A"}</td>
                                                <td>{detail.project_day_detail_price || "N/A"}</td>
                                                <td>{detail.project_day_detail_total_price || "N/A"}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="10" style={{ textAlign: "center" }}>
                                                No project day details data available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <div className='font-semibold text-base text-green-800'>Total Amount: <i class="fa-solid fa-indian-rupee-sign"></i>{ProjectDayDetailsTotalAmount}</div>
                        </div>
                    </div>
                </div>)}

            {showProjectPerson && (
                <div class="grid grid-cols-1 md:grid-cols-1 gap-3 md:gap-4 mt-4">
                    <div className="card">
                        <h6 className='mb-2'>PROJECT Persons</h6>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>S.N</th>
                                        <th>Date</th>
                                        <th>Person</th>
                                        <th>Machine Name</th>
                                        <th>Work Type</th>
                                        <th>Work Number</th>
                                        <th>Work Price</th>
                                        <th>Total Price</th>
                                        <th>Paid By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ProjectPersonData.length > 0 ? (
                                        ProjectPersonData.map((detail, index) => (
                                            <tr key={detail.project_person_id}>
                                                <td>{index + 1 || "N/A"}</td>
                                                <td>{detail.project_person_date || "N/A"}</td>
                                                <td>
                                                    {detail.person_id__person_name || "N/A"}
                                                </td>
                                                <td>
                                                    {detail.project_machine_data_id__machine_project_id__machine_name || "N/A"}
                                                </td>
                                                <td>
                                                    {detail.work_type_id__work_type_name || "N/A"}
                                                </td>
                                                <td>{detail.project_person_work_num || "N/A"}</td>
                                                <td>{detail.project_person_price || "N/A"}</td>
                                                <td>{detail.project_person_total_price || "N/A"}</td>
                                                <td>{detail.project_person_paid_by || "N/A"}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="13" style={{ textAlign: "center" }}>
                                                No project person data available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <div className='font-semibold text-base text-green-800' >Total Amount: <i class="fa-solid fa-indian-rupee-sign"></i>{ProjectPersonTotalAmount}</div>
                        </div>
                    </div>
                </div>)}

            {showProjectExpense && (
                <div class="grid grid-cols-1 md:grid-cols-1 gap-3 md:gap-4 mt-4">
                <div className="card">
                    <h6 className='mb-2'>PROJECT Expense</h6>
                <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>S.N</th>
                            <th>Expense Name</th>
                            <th>Project Name</th>
                            <th>Expense Date</th>
                            <th>Expense Amount</th>
                            <th>Payment Mode</th>
                            <th>Bank Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ProjectExpenseData.length > 0 ? (
                            ProjectExpenseData.map((y, index) => (
                                <tr key={y.project_expense_id}>
                                    <td>{index + 1}</td>
                                    <td>{y.project_expense_name || "N/A"}</td>
                                    <td>{y.project_id__project_name || "N/A"}</td>
                                    <td>{y.project_expense_date || "N/A"}</td>
                                    <td>{y.project_expense_amount || "N/A"}</td>
                                    <td>{y.project_payment_mode || "N/A"}</td>
                                    <td>{y.bank_id__bank_name || "N/A"}</td>
                                    
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10">No expense details available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className='font-semibold text-base text-green-800' >Total Amount: <i class="fa-solid fa-indian-rupee-sign"></i>{ProjectExpenseTotalAmount}</div>

            </div>
            </div>
        </div>


            )}


        </div>
    );
};

export default Reports;