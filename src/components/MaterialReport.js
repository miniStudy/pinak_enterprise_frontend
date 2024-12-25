import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MaterialReport = () => {

    const [MaterialReportData, setMaterialReportData] = useState([]);
    const [MaterialReportTotal, setMaterialReportTotal] = useState([]);
    const [workTypeData, setworkTypeData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const [Messages, setMessages] = useState('');

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const filteredItems = MaterialReportData.filter(item => {
        const itemDate = item?.material_buy_date ? new Date(item.material_buy_date) : null;

        const matchesOwnerName = item?.material_owner__person_name?.toLowerCase().includes(ownerName.toLowerCase());

        const matchesDateRange = (!start || itemDate >= start) && (!end || itemDate <= end);

        return matchesDateRange && matchesOwnerName;
    });

    const fetchMaterialReport = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/show_material_report/');
            setMaterialReportData(response.data.materials_data);
            setMaterialReportTotal(response.data.total_material_amount);
            setworkTypeData(response.data.work_type_data);
            setTitle(response.data.title);
            setLoading(false);
        } catch (err) {
            setError('Failed to load material report details');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterialReport();
    }, []);

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
                <h5 className="text-xl font-extrabold text-black-600 decoration-dashed tracking-wide">MATERIAL REPORT</h5>
            </div>

            {/* Date Range Inputs */}
            <div className="flex mt-3">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date:</label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="ms-2">
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date:</label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Owner's Name Filter */}
            <div className="mt-3">
                <input
                    type="text"
                    id="ownerName"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter owner's name"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-3 md:gap-4 mt-3">
                <div className="card">
                    <h5 className='mb-2 text-center'>Material Report Data</h5>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>S.N</th>
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
                                {filteredItems.length > 0 ? (
                                    filteredItems.map((material, index) => (
                                        <tr key={material.material_id}>
                                            <td>{index + 1 || "N/A"}</td>
                                            <td>{material.material_type_id__material_type_name || "N/A"}</td>
                                            <td>{material.material_owner__person_name || "N/A"}</td>
                                            <td>{material.material_status ? "Active" : "Inactive"}</td>
                                            <td>{material.material_buy_date || "N/A"}</td>
                                            <td>{material.material_buy_location || "N/A"}</td>
                                            <td>{material.material_work_type__work_type_name || "N/A"}</td>
                                            <td>{material.material_work_no || "N/A"}</td>
                                            <td><i class="fa-solid fa-indian-rupee-sign"></i>{material.material_price || "N/A"}</td>
                                            <td><i class="fa-solid fa-indian-rupee-sign"></i>{material.material_total_price || "N/A"}</td>
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
                                        <td colSpan="21" style={{ textAlign: "center" }}>
                                            No materials data available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
            <div className="card cardbg3 mt-3 flex">
                <div className="text-red-500 font-bold">Total Material Amount</div>
                <div className="text-red-500 font-bold"><i class="fa-solid fa-indian-rupee-sign"></i> {MaterialReportTotal}</div>
            </div>


                <div className="grid grid-cols-1 md:grid-cols-1 gap-3 md:gap-4 mt-3">
                    <div className="card">
                        <h5 className='mb-2 text-center'>Material Report Data</h5>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Work Type</th>
                                        <th>Individual Prices</th>
                                        <th>Total Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {workTypeData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.work_type_name}</td>
                                            <td>
                                                {item.individual_prices.map((price, i) => (
                                                    <span key={i}>
                                                        <i class="fa-solid fa-indian-rupee-sign"></i>{price}
                                                        {i < item.individual_prices.length - 1 ? ', ' : ''}
                                                    </span>
                                                ))}
                                            </td>
                                            <td><i class="fa-solid fa-indian-rupee-sign"></i> {item.total_price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
        </>
    );
};

export default MaterialReport;