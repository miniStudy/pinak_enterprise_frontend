import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select'; // Ensure you have installed 'react-select'

const Reports = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);
    const [projectID, setProjectID] = useState('');

    const [singleprojectdata, setsingleprojectdata] = useState(null)
    const [projectMachineData, setProjectMachineData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [ProjectDayDetailsData, setProjectDayDetailsData] = useState([]);
    const [ProjectDayDetailsTotalAmount, setProjectDayDetailsTotalAmount] = useState(0);
    const [ProjectPersonData, setProjectPersonData] = useState([]);
    const [ProjectPersonTotalAmount, setProjectPersonTotalAmount] = useState(0);
    const [finalTotalAmount, setFinalTotalAmount] = useState(0);
    const [ProjectExpenseData, setProjectExpenseData] = useState([]);
    const [ProjectExpenseTotalAmount, setProjectExpenseTotalAmount] = useState(0);
    const [MachineMaintenanceData, setMachineMaintenanceData] = useState([]);
    const [MachineMaintenanceTotalAmount, setMachineMaintenanceTotalAmount] = useState(0);
    const [ProjectMaterialData, setProjectMaterialData] = useState([]);
    const [ProjectMaterialTotalAmount, setProjectMaterialTotalAmount] = useState(0);

    const [showProjectMachine, setShowProjectMachine] = useState(true);
    const [showProjectDayDetails, setShowProjectDayDetails] = useState(true);
    const [showProjectPerson, setShowProjectPerson] = useState(true);
    const [showProjectExpense, setShowProjectExpense] = useState(true);
    const [showProjectMachineMaintenance, setShowProjectMachineMaintenance] = useState(true);
    const [showProjectMaterial, setShowProjectMaterial] = useState(true);


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

            setsingleprojectdata(project_person_response.data.project_data)
            setProjectPersonData(project_person_response.data.data || []);
            setProjectPersonTotalAmount(project_person_response.data.total_amount || 0);


            const project_expense_response = await axios.get(`http://127.0.0.1:8000/show_project_expense/?project_id=${newProjectID}`);
            setProjectExpenseData(project_expense_response.data.data || []);
            setProjectExpenseTotalAmount(project_expense_response.data.total_amount || 0);

            const machine_maintenance_response = await axios.get(`http://127.0.0.1:8000/show_machine_maintenance/?project_id=${newProjectID}`);
            setMachineMaintenanceData(machine_maintenance_response.data.data || []);
            setMachineMaintenanceTotalAmount(machine_maintenance_response.data.total_amount || 0);

            const project_material_response = await axios.get(`http://127.0.0.1:8000/show_project_material/?project_id=${newProjectID}`);
            setProjectMaterialData(project_material_response.data.data || []);
            setProjectMaterialTotalAmount(project_material_response.data.total_amount || 0);

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

        if (showProjectDayDetails) {
            total += ProjectDayDetailsTotalAmount;
        }

        setFinalTotalAmount(total);
    }, [totalAmount, ProjectDayDetailsTotalAmount, ProjectPersonTotalAmount, showProjectMachine, showProjectDayDetails, showProjectPerson]);


    return (
        <div>
            <h5 className="text-1xl font-extrabold text-black-600 decoration-dashed tracking-wide">
                REPORTS DATA
            </h5>
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


            <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="projectdaydetail" checked={showProjectDayDetails}
                        onChange={() => setShowProjectDayDetails(!showProjectDayDetails)} />
                    <label class="form-check-label" for="projectdaydetail">
                        Project Day-Details
                    </label>
                </div>

                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="projectmachine" checked={showProjectMachine}
                        onChange={() => setShowProjectMachine(!showProjectMachine)} />
                    <label class="form-check-label" for="projectmachine">
                        Project Machine
                    </label>
                </div>

                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="projectmachinemaintenance" checked={showProjectMachineMaintenance}
                        onChange={() => setShowProjectMachineMaintenance(!showProjectMachineMaintenance)} />
                    <label class="form-check-label" for="projectmachinemaintenance">
                        Project Machine Maintenance
                    </label>
                </div>

                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="projectmaterial" checked={showProjectMaterial}
                        onChange={() => setShowProjectMaterial(!showProjectMaterial)} />
                    <label class="form-check-label" for="projectmachinemaintenance">
                        Project Material
                    </label>
                </div>


                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="Project_Person" checked={showProjectPerson}
                        onChange={() => setShowProjectPerson(!showProjectPerson)} />
                    <label class="form-check-label" for="Project_Person">
                        Project Person
                    </label>
                </div>

                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="Project_Expense" checked={showProjectExpense}
                        onChange={() => setShowProjectExpense(!showProjectExpense)} />
                    <label class="form-check-label" for="Project_Expense">
                        Project Expense
                    </label>
                </div>

            </div>

            {singleprojectdata && (
                <div className='card mt-4 reportbackground p-4'>

                    <div className="mb-2 flex justify-center items-center">
                        <img
                            src="/static/pinak enterprise gujrati logo_page-0001.jpg"
                            alt="Logo"
                            className="w-20 rounded-full"
                        />
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-4 mb-4 mt-4'>
                        <h6>Project Name : {singleprojectdata.project_name}</h6>
                        <h6>Amount : {singleprojectdata.project_amount}</h6>
                        <h6>Location : {singleprojectdata.project_location}</h6>
                        <h6>Project Types : {singleprojectdata.project_type}</h6>
                        <h6>Status : {singleprojectdata.project_status}</h6>
                        <h6>Start Date : {singleprojectdata.project_start_date}</h6>
                        <h6>End Date : {singleprojectdata.project_end_date}</h6>
                        <h6>Owner Name : {singleprojectdata.owner_name}</h6>
                        <h6>Owner Contact : {singleprojectdata.owner_contact_number}</h6>
                    </div>
                    {showProjectDayDetails && (
                        <div class="">
                            <div className="">
                                <div className="borderr reporttitle font-bold">Day-Details</div>
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
                                            {ProjectDayDetailsData.length > 0 && (
                                                ProjectDayDetailsData.map((detail, index) => (
                                                    <tr key={detail.project_day_detail_id}>
                                                        <td>{index + 1 || "N/A"}</td>
                                                        <td>{detail.proejct_day_detail_date || "N/A"}</td>
                                                        <td>{detail.project_day_detail_machine_id__machine_name || "N/A"} {detail.project_day_detail_machine_id__machine_number_plate}</td>
                                                        <td>{detail.project_day_detail_work_type__work_type_name || "N/A"}</td>
                                                        <td>{detail.project_day_detail_work_no || "N/A"}</td>
                                                        <td><i className="fa-solid fa-indian-rupee-sign"></i> {detail.project_day_detail_price || "N/A"}</td>
                                                        <td><i className="fa-solid fa-indian-rupee-sign"></i> {detail.project_day_detail_total_price || "N/A"}</td>
                                                    </tr>
                                                ))
                                            )}
                                            <tr>
                                                <td colSpan="7">
                                                    <span className="font-bold text-base text-green-800">
                                                        Total Amount:{' '}
                                                        <i className="fa-solid fa-indian-rupee-sign"></i>
                                                        {ProjectDayDetailsTotalAmount}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>)}

                    {showProjectMachine && (
                        <div className="reports">
                            <div className="">
                                <div className="borderr reporttitle font-bold">Machines</div>
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
                                                {projectMachineData.length > 0 && (
                                                    projectMachineData.map((detail, index) => (
                                                        <tr key={detail.project_machine_data_id}>
                                                            <td>{index + 1 || 'N/A'}</td>
                                                            <td>{detail.project_machine_date || 'N/A'}</td>
                                                            <td>{detail.machine_project_id__machine_name || 'N/A'} {detail.machine_project_id__machine_number_plate}</td>
                                                            <td>{detail.work_type_id__work_type_name || 'N/A'}</td>
                                                            <td>{detail.project_machine_data_work_number || 'N/A'}</td>
                                                            <td><i className="fa-solid fa-indian-rupee-sign"></i> {detail.project_machine_data_work_price || 'N/A'}</td>
                                                            <td><i className="fa-solid fa-indian-rupee-sign"></i> {detail.project_machine_data_total_amount || 'N/A'}</td>
                                                        </tr>
                                                    ))
                                                )}
                                                <tr>
                                                    <td colSpan="7">
                                                        <span className="font-bold text-base text-green-800">
                                                            Total Amount:{' '}
                                                            <i className="fa-solid fa-indian-rupee-sign"></i>
                                                            {totalAmount}
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    )}

                                </div>
                            </div>
                        </div>)}


                        {showProjectMachineMaintenance && (
                        <div className="reports">
                            <div className="">
                                <div className="borderr reporttitle font-bold">Machine Maintenance</div>
                                <div className="table-responsive">
                                    {loading ? (
                                        <div>Loading...</div>
                                    ) : (
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>S.N</th>
                                                    <th>Machine Name</th>
                                                    <th>Maintenance Type</th>
                                                    <th>Type</th>
                                                    <th>Amount</th>
                                                    <th>Date</th>
                                                    <th>Paid By</th>
                                                    <th>Paid Person</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {MachineMaintenanceData.length > 0 && (
                                                    MachineMaintenanceData.map((detail, index) => (
                                                        <tr key={detail.project_machine_data_id}>
                                                            <td>{index + 1 || 'N/A'}</td>
                                                            <td>{detail.machine_machine_id__machine_name || 'N/A'} {detail.machine_machine_id__machine_number_plate || 'N/A'}</td>
                                                            <td>{detail.machine_machine_id__machine_types_id__machine_type_name || 'N/A'}</td>
                                                            <td>{detail.machine_machine_id__machine_types_id__machine_type_name || 'N/A'}</td>
                                                            <td><i className="fa-solid fa-indian-rupee-sign"></i> {detail.machine_maintenance_amount || 'N/A'}</td>
                                                            <td>{detail.machine_maintenance_date || 'N/A'}</td>
                                                            <td>{detail.machine_maintenance_amount_paid_by || 'N/A'}</td>
                                                            <td>{detail.machine_maintenance_person_id__person_name || 'N/A'}</td>
                                                        </tr>
                                                    ))
                                                )}
                                                <tr>
                                                    <td colSpan="7">
                                                        <span className="font-bold text-base text-red-800">
                                                            Total Amount:{' '}
                                                            <i className="fa-solid fa-indian-rupee-sign"></i>
                                                            {MachineMaintenanceTotalAmount}
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    )}

                                </div>
                            </div>
                        </div>)}



                        {showProjectMaterial && (
                        <div className="reports">
                            <div className="">
                                <div className="borderr reporttitle font-bold">Project Material</div>
                                <div className="table-responsive">
                                    {loading ? (
                                        <div>Loading...</div>
                                    ) : (
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>S.N</th>
                                                    <th>Date</th>
                                                    <th>Material Type</th>
                                                    <th>Material Owner Name</th>
                                                    <th>Work Type</th>
                                                    <th>Work No</th>
                                                    <th>Price</th>
                                                    <th>Total Amount</th>
                                                    <th>Material Info</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ProjectMaterialData.length > 0 && (
                                                    ProjectMaterialData.map((detail, index) => (
                                                        <tr key={detail.project_machine_data_id}>
                                                            <td>{index + 1 || 'N/A'}</td>

                                                            <td>{detail.project_material_date || 'N/A'}</td>
                                                            <td>{detail.project_material_material_type_id__material_type_name || 'N/A'}</td>
                                                            <td>{detail.project_material_material_id__material_owner__person_name || 'N/A'}</td>
                                                            <td>{detail.project_material_work_type_id__work_type_name || 'N/A'}</td>
                                                            <td>{detail.project_material_work_no || 'N/A'}</td>
                                                            <td><i className="fa-solid fa-indian-rupee-sign"></i> {detail.project_material_price || 'N/A'}</td>
                                                            <td><i className="fa-solid fa-indian-rupee-sign"></i> {detail.project_material_total_amount || 'N/A'}</td>
                                                            <td>{detail.person_material_information || 'N/A'}</td>
                                                        </tr>
                                                    ))
                                                )}
                                                <tr>
                                                    <td colSpan="7">
                                                        <span className="font-bold text-base text-red-800">
                                                            Total Amount:{' '}
                                                            <i className="fa-solid fa-indian-rupee-sign"></i>
                                                            {ProjectMaterialTotalAmount}
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    )}

                                </div>
                            </div>
                        </div>)}

                    

                    {showProjectPerson && (
                        <div class="">
                            <div className="">
                                <div className="borderr reporttitle font-bold">Persons</div>
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
                                            {ProjectPersonData.length > 0 && (
                                                ProjectPersonData.map((detail, index) => (
                                                    <tr key={detail.project_person_id}>
                                                        <td>{index + 1 || "N/A"}</td>
                                                        <td>{detail.project_person_date || "N/A"}</td>
                                                        <td>
                                                            {detail.person_id__person_name || "N/A"}
                                                        </td>
                                                        <td>
                                                            {detail.project_machine_data_id__machine_project_id__machine_name || "N/A"} {detail.project_machine_data_id__machine_project_id__machine_number_plate}
                                                        </td>
                                                        <td>
                                                            {detail.work_type_id__work_type_name || "N/A"}
                                                        </td>
                                                        <td>{detail.project_person_work_num || "N/A"}</td>
                                                        <td><i className="fa-solid fa-indian-rupee-sign"></i> {detail.project_person_price || "N/A"}</td>
                                                        <td><i className="fa-solid fa-indian-rupee-sign"></i> {detail.project_person_total_price || "N/A"}</td>
                                                        <td>{detail.project_person_paid_by || "N/A"}</td>
                                                    </tr>
                                                ))
                                            )}

                                            <tr>
                                                <td colSpan="9">
                                                    <span className="font-bold text-base text-red-800">
                                                        Total Amount:{' '}
                                                        <i className="fa-solid fa-indian-rupee-sign"></i>
                                                        {ProjectPersonTotalAmount}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>)}

                    {showProjectExpense && (
                        <div class="">
                            <div className="">
                                <div className="borderr reporttitle font-bold">Expense</div>
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
                                            {ProjectExpenseData.length > 0 && (
                                                ProjectExpenseData.map((y, index) => (
                                                    <tr key={y.project_expense_id}>
                                                        <td>{index + 1}</td>
                                                        <td>{y.project_expense_name || "N/A"}</td>
                                                        <td>{y.project_id__project_name || "N/A"}</td>
                                                        <td>{y.project_expense_date || "N/A"}</td>
                                                        <td><i className="fa-solid fa-indian-rupee-sign"></i> {y.project_expense_amount || "N/A"}</td>
                                                        <td>{y.project_payment_mode || "N/A"}</td>
                                                        <td>{y.bank_id__bank_name || "N/A"}</td>

                                                    </tr>
                                                ))
                                            )}

                                            <tr>
                                                <td colSpan="7">
                                                    <span className="font-bold text-base text-red-800">
                                                        Total Amount:{' '}
                                                        <i className="fa-solid fa-indian-rupee-sign"></i>
                                                        {ProjectExpenseTotalAmount}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>


                    )}


                </div>
            )}

            <div className="mt-4 flex space-x-4">
                <div className="max-w-xs p-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold">Final Total Amount</h2>
                    <div className="text-2xl font-bold mt-2">
                        <i className="fa-solid fa-indian-rupee-sign"></i>
                        {finalTotalAmount}
                    </div>
                </div>
            </div>
        </div>





    );
};

export default Reports;