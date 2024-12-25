import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const DailyReports = () => {
    const [DailyCreditReport, setDailyCreditReport] = useState([]);
    const [DailyDebitReport, setDailyDebitReport] = useState([]);

    const [DailyCreditReportTotal, setDailyCreditReportTotal] = useState(0);
    const [DailyDebitReportTotal, setDailyDebitReportTotal] = useState(0);

    const [ProjectDayDetailData, setProjectDayDetailData] = useState([]);
    const [UniqueProjects, setUniqueProjects] = useState([]);
    const [ProjectDayDetailTotal, setProjectDayDetailTotal] = useState(0);

    const [ProjectExpenseData, setProjectExpenseData] = useState([]);
    const [MaterialsData, setMaterialsData] = useState([]);
    const [MachineMaintenance, setMachineMaintenance] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const [Messages, setMessages] = useState('');

    const [Report_date, setReport_date] = useState(null);




    // Fetch machine details
    const fetchDailyReport = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/show_daily_report/');
            setDailyCreditReport(response.data.dailywise_credit_report || []);
            setDailyDebitReport(response.data.dailywise_debit_report || []);
            setDailyCreditReportTotal(response.data.total_credit_amount || 0);
            setDailyDebitReportTotal(response.data.total_debit_amount || 0);
            setProjectDayDetailData(response.data.project_day_detail_data || []);
            setProjectDayDetailTotal(response.data.total_project_day_detail_amount || 0);
            setProjectExpenseData(response.data.project_expense_data || []);
            setMaterialsData(response.data.materials_data || []);
            setMachineMaintenance(response.data.machine_maintenance_data || []);
            setUniqueProjects(response.data.unique_project_names || 0);
            setTitle(response.data.title);
            setLoading(false);
        } catch (err) {
            setError('Failed to daily report details');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDailyReport();
    }, []);


    const dateChange = async (e) => {
        const { value } = e.target;
        const response = await axios.get(`http://127.0.0.1:8000/show_daily_report?report_date=${value}`);
        setReport_date(value)
        setDailyCreditReport(response.data.dailywise_credit_report || []);
        setDailyDebitReport(response.data.dailywise_debit_report || []);
        setDailyCreditReportTotal(response.data.total_credit_amount || 0);
        setDailyDebitReportTotal(response.data.total_debit_amount || 0);
        setProjectDayDetailData(response.data.project_day_detail_data || []);
        setProjectDayDetailTotal(response.data.total_project_day_detail_amount || 0);
        setProjectExpenseData(response.data.project_expense_data || []);
        setMaterialsData(response.data.materials_data || []);
        setMachineMaintenance(response.data.machine_maintenance_data || []);
        setUniqueProjects(response.data.unique_project_names || 0);
    };

    useEffect(() => {
        if (Messages) {
            const timer = setTimeout(() => {
                setMessages('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [Messages]);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>



            <div>
                <h5 className="text-1xl font-extrabold text-black-600 decoration-dashed tracking-wide">DAILY REPORT</h5>
            </div>
            <input
                type="date"
                id="money_date"
                name="money_date"
                value={Report_date}
                onChange={dateChange}
                className="block px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white hover:shadow-md transition duration-300 mt-3" />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-3">
                <div className="card">
                    <h5 className='mb-2 text-center'>આવક</h5>
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>S.N</th>
                                    <th>Amount</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {DailyCreditReport.length > 0 ? (
                                    DailyCreditReport.map((x, index) => (
                                        <tr key={x.money_id}>
                                            <td>{index + 1}</td>
                                            <td>{x.money_amount || "N/A"}</td>
                                            <td>{x.sender_person_id__person_name} - {x.receiver_person_id__person_name} - {x.pay_type_id__pay_type_name}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9">No debit details available.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className='font-bold text-base text-green-600'>Total Credit: <i class="fa-solid fa-indian-rupee-sign"></i>{DailyCreditReportTotal}</div>
                    </div>
                </div>

                <div className="card">
                    <h5 className='mb-2 text-center'>જાવક</h5>
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>S.N</th>
                                    <th>Amount</th>
                                    <th>Mode</th>
                                </tr>
                            </thead>
                            <tbody>
                                {DailyDebitReport.length > 0 ? (
                                    DailyDebitReport.map((x, index) => (
                                        <tr key={x.money_id}>
                                            <td>{index + 1}</td>
                                            <td>{x.money_amount || "N/A"}</td>
                                            <td>{x.sender_person_id__person_name} - {x.receiver_person_id__person_name} - {x.pay_type_id__pay_type_name}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9">No credit details available.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className='font-bold text-base text-red-600'>Total Debit: <i class="fa-solid fa-indian-rupee-sign"></i>{DailyDebitReportTotal}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-3">
                {UniqueProjects.length > 0 ? (
                    UniqueProjects.map((project) => (
                        <>
                            <div className="card p-4" key={project}>
                                <h2 className="font-bold text-lg mb-1">Project Name: {project}</h2> <hr />
                                <h6 className="text-center text-xl font-semibold text-gray-800 py-2 bg-gray-100 shadow-md">
                                    Day Details
                                </h6>
                                <div className='table-responsive'>
                                    <table className='table'>
                                        <thead>
                                            <tr>
                                                <th>Machine Name</th>
                                                <th>Work Type</th>
                                                <th>Total Tyres</th>
                                                <th>Work No</th>
                                                <th>Price</th>
                                                <th>Total Price</th>
                                                <th>Details</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ProjectDayDetailData.filter((x) => project === x.project_id__project_name).map((x) => (


                                                <tr key={x.project_day_detail_id}>
                                                    <td>{x.project_day_detail_machine_id__machine_name} {x.project_day_detail_machine_id__machine_number_plate}</td>

                                                    <td>{x.project_day_detail_work_type__work_type_name}</td>
                                                    <td>{x.project_day_detail_total_tyres}</td>
                                                    <td>{x.project_day_detail_work_no}</td>
                                                    <td>₹{x.project_day_detail_price}</td>
                                                    <td>₹{x.project_day_detail_total_price}</td>
                                                    <td>{x.project_day_detail_details}</td>
                                                </tr>


                                            ))}

                                            {ProjectDayDetailData.filter((x) => project === x.project_id__project_name).length > 0 && (
                                                <tr>
                                                    <td colSpan="7" className="text-left font-bold">Total <span>
                                                        ₹{
                                                            ProjectDayDetailData.filter((x) => project === x.project_id__project_name)
                                                                .reduce((acc, curr) => acc + parseFloat(curr.project_day_detail_total_price || 0), 0)
                                                        }
                                                    </span></td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>

                                </div>


                                <h6 className="text-center text-xl font-semibold text-gray-800 py-2 bg-gray-100 shadow-md mt-3">
                                    Project Expense
                                </h6>
                                <div className='table-responsive'>
                                    <table className='table'>
                                        <thead>
                                            <tr>
                                                <th>Expense</th>
                                                <th>Amount</th>
                                                <th>Mode</th>
                                                <th>Bank</th>
                                                <th>Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ProjectExpenseData.filter((x) => project === x.project_id__project_name).map((x) => (
                                                <tr key={x.project_expense_id}>
                                                    <td>{x.project_expense_name}</td>
                                                    <td>₹{x.project_expense_amount}</td>
                                                    <td>{x.project_payment_mode}</td>
                                                    <td>{x.bank_id__bank_name}</td>
                                                    <td>{x.project_expense_desc}</td>
                                                </tr>
                                            ))}
                                            {ProjectExpenseData.filter((x) => project === x.project_id__project_name).length > 0 && (
                                                <tr>
                                                    <td colSpan="5" className="text-left font-bold">Total <span>
                                                        ₹{
                                                            ProjectExpenseData.filter((x) => project === x.project_id__project_name)
                                                                .reduce((acc, curr) => acc + parseFloat(curr.project_expense_amount || 0), 0)
                                                        }
                                                    </span></td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>

                                </div>

                            </div>

                        </>

                    ))
                ) : (
                    <div className="col-span-5 text-center">No data available.</div>
                )}
            </div>
            <div className="card cardbg3 mt-3 d-inline-block p-4">
                <div className="text-green-500 font-bold">Daily Total Revenue: <i class="fa-solid fa-indian-rupee-sign"></i> {ProjectDayDetailTotal}</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4 mt-3">
                <div className="card p-4">
                    <h6 className="text-center text-xl font-semibold text-gray-800 py-2 bg-gray-100 shadow-md">
                        Materials Data
                    </h6>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Material Type</th>
                                    <th>Owner's Name</th>
                                    <th>Status</th>
                                    <th>Buy Date</th>
                                    <th>Buy Location</th>
                                    <th>Work Type</th>
                                    <th>Work No</th>
                                    <th>Price</th>
                                    <th>Total Price</th>
                                    <th>Is Agent</th>
                                    <th>Agent Name</th>
                                    <th>Agent Price Choice</th>
                                    <th>Agent Percentage</th>
                                    <th>Agent Amount</th>
                                    <th>Final Amount</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MaterialsData.length > 0 ? (
                                    MaterialsData.map((material) => (
                                        <tr key={material.material_id}>
                                            <td>{material.material_type_id__material_type_name || "N/A"}</td>
                                            <td>{material.material_owner__person_name || "N/A"}</td>
                                            <td>{material.material_status ? "Active" : "Inactive"}</td>
                                            <td>{material.material_buy_date || "N/A"}</td>
                                            <td>{material.material_buy_location || "N/A"}</td>
                                            <td>{material.material_work_type__work_type_name || "N/A"}</td>
                                            <td>{material.material_work_no || "N/A"}</td>
                                            <td>{material.material_price || "N/A"}</td>
                                            <td>{material.material_total_price || "N/A"}</td>
                                            <td>{material.material_is_agent ? "Yes" : "No"}</td>
                                            <td>{material.material_agent_name || "N/A"} [{material.material_agent_contact}]</td>
                                            <td>{material.material_agent_price_choice || "N/A"}</td>
                                            <td>{material.material_agent_percentage || "N/A"}</td>
                                            <td>{material.material_agent_amount || "N/A"}</td>
                                            <td>{material.material_final_amount || "N/A"}</td>
                                            <td>{material.material_details || "N/A"}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="15" style={{ textAlign: "center" }}>
                                            No materials data available.
                                        </td>
                                    </tr>
                                )}

                                {/* Calculating Total Price */}
                                {MaterialsData.length > 0 && (
                                    <tr>
                                        <td colSpan="8" className="text-right font-bold">Total <span>₹{
                                            MaterialsData.reduce(
                                                (acc, curr) => acc + parseFloat(curr.material_total_price || 0),
                                                0
                                            ).toFixed(2)
                                        }</span>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4 mt-3">
                <div className="card p-4">
                    <h6 className="text-center text-xl font-semibold text-gray-800 py-2 bg-gray-100 shadow-md">
                        Machine Maintenance Data
                    </h6>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Machine Name</th>
                                    <th>Maintenance Amount</th>
                                    <th>Maintenance Date</th>
                                    <th>Project</th>
                                    <th>Amount Paid</th>
                                    <th>Paid By</th>
                                    <th>Maintenance Person</th>
                                    <th>Driver</th>
                                    <th>Details</th>
                                    <th>Type Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MachineMaintenance.length > 0 ? (
                                    MachineMaintenance.map((maintenance) => (
                                        <tr key={maintenance.machine_maintenance_id}>
                                            <td>{maintenance.machine_machine_id__machine_name} - {maintenance.machine_machine_id__machine_number_plate}  [{maintenance.machine_machine_id__machine_types_id__machine_type_name}]</td>
                                            <td>₹{maintenance.machine_maintenance_amount || "N/A"}</td>
                                            <td>{maintenance.machine_maintenance_date || "N/A"}</td>
                                            <td>{maintenance.project_id__project_name || "N/A"}</td>
                                            <td>{maintenance.machine_maintenance_amount_paid ? "Yes" : "No"}</td>
                                            <td>{maintenance.machine_maintenance_amount_paid_by || "N/A"}</td>
                                            <td>{maintenance.machine_maintenance_person_id__person_name || "N/A"} [{maintenance.machine_maintenance_person_id__person_contact_number}]</td>
                                            <td>{maintenance.machine_maintenance_driver_id__person_name || "N/A"} [{maintenance.machine_maintenance_driver_id__person_contact_number}]</td>
                                            <td>{maintenance.machine_maintenance_details || "N/A"}</td>
                                            <td>{maintenance.machine_maintenance_types_id__maintenance_type_name || "N/A"}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="15" style={{ textAlign: "center" }}>
                                            No materials data available.
                                        </td>
                                    </tr>
                                )}

                                {/* Calculating Total Price */}
                                {MachineMaintenance.length > 0 && (
                                    <tr>
                                        <td colSpan="10" className="text-left font-bold">Total <span>₹{
                                            MachineMaintenance.reduce(
                                                (acc, curr) => acc + parseFloat(curr.machine_maintenance_amount || 0),
                                                0
                                            ).toFixed(2)
                                        }</span></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>



        </>
    );
};
export default DailyReports;