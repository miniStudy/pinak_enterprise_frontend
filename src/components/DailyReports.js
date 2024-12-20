import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const DailyReports = () => {
    const [DailyCreditReport, setDailyCreditReport] = useState([]);
    const [DailyDebitReport, setDailyDebitReport] = useState([]);

    const [DailyCreditReportTotal, setDailyCreditReportTotal] = useState(0);
    const [DailyDebitReportTotal, setDailyDebitReportTotal] = useState(0);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const [Messages, setMessages] = useState('');

    


    // Fetch machine details
    const fetchDailyReport = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/show_daily_report/');
            setDailyCreditReport(response.data.dailywise_credit_report || []);
            setDailyDebitReport(response.data.dailywise_debit_report || []);
            setDailyCreditReportTotal(response.data.total_credit_amount || 0);
            setDailyDebitReportTotal(response.data.total_debit_amount || 0);
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
        <input type="date" id="money_date" name="money_date" onChange={dateChange}></input>

            <div>
                <h5 className="text-1xl font-extrabold text-black-600 decoration-dashed tracking-wide">DAILY REPORT</h5>
            </div>
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
        </>
    );
};
export default DailyReports;