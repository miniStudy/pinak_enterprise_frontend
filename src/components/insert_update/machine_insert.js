import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap';
import Select from 'react-select';



function Machine_insert({ fetchdata }) {
    const modalRef = useRef();
    const [machineTypes, setmachineTypes] = useState([]);
    const [machine_rented_work_type, setmachine_rented_work_type] = useState([]);
    const [formData, setFormData] = useState({
        machine_id: '',
        machine_name: '',
        machine_number_plate: '',
        machine_register_date: '',
        machine_own: '',
        machine_condition: '',
        machine_working: true,
        machine_types_id: '',
        machine_details: '',
        machine_owner_id: '',
        machine_buy_price: '',
        machine_buy_date: '',
        machine_sold_price: '',
        machine_sold_out_date: '',
        machine_other_details: '',
        machine_rented_work_type: '',
        machine_rented_work_price: '',
        price_filter: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    // for select option
        const [persons, setpersons] = useState([]);
        const personsoptions = persons.map((pers) => ({
            value: pers.person_id,
            label: pers.person_name + pers.person_contact_number,
        }));
    
        const handleMachineOwnerChange = (selectedOption) => {
            setFormData({
                ...formData,
                machine_owner_id: selectedOption ? selectedOption.value : "",
            });
        };


    // Fetch person types from API
    const fetchMachineTypes = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/show_machines/");
            setmachineTypes(response.data.machine_types || []);
            setpersons(response.data.persons_data || []);
            setmachine_rented_work_type(response.data.machine_rented_work_type);
        } catch (err) {
            //   setError("Failed to load person types data");
        }
    };

    useEffect(() => {
        fetchMachineTypes();
    }, []);


    // Handle form submission for Add/Update
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/insert_update_machine/',
                formData
            );
            if (response.status === 200) {
                fetchdata();
                resetForm();
                closeModal();
            } else {
                alert('Failed to save machine details.');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Error occurred while saving machine details.');
        }
    };

    // Close the modal
    const closeModal = () => {
        const modalInstance = Modal.getInstance(modalRef.current);
        if (modalInstance) {
            modalInstance.hide();
        }
    };

    // Open the modal
    const openModal = () => {
        const modalInstance = new Modal(modalRef.current);
        modalInstance.show();
    };

    const resetForm = () => {
        setFormData({
            machine_id: '',
            machine_name: '',
            machine_number_plate: '',
            machine_register_date: '',
            machine_own: '',
            machine_condition: '',
            machine_working: true,
            machine_types_id: '',
            machine_details: '',
            machine_owner_id: '',
            machine_buy_price: '',
            machine_buy_date: '',
            machine_sold_price: '',
            machine_sold_out_date: '',
            machine_other_details: '',
            machine_rented_work_type: '',
            machine_rented_work_price: '',
            price_filter: '',
        });
    };


    return (
        <>
            <button
                type="button"
                className="btn btn-sm btn-primary ms-3"
                onClick={openModal}
            >
                Add Machine
            </button>
            {/* Modal for Add/Edit Person */}
            <div
                className="modal fade"
                id="machineModal"
                tabIndex="-1"
                aria-labelledby="machineModalLabel"
                aria-hidden="true"
                ref={modalRef}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="machineModalLabel">
                                {formData.machine_id ? 'Edit Machine' : 'Add Machine'}
                            </h5>

                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                        <form onSubmit={handleSubmit}>

<div className='mb-3'>
    <input
        type="text"
        name="machine_name"
        value={formData.machine_name}
        onChange={handleChange}
        placeholder='Machine Name*'
        className='form-control'
        required
    />
</div>

<div className='mb-3'>
    <select name="machine_own" value={formData.machine_own} onChange={handleChange} className='form-select' required>
        <option value="">Ownership</option>
        <option value="Company">Company</option>
        <option value="Rented_fixedprice">Rented - Fixed Price</option>
        <option value="Rented_variableprice">Rented - Variable Price</option>
    </select>
</div>


<div className='mb-3'>
    <select name="machine_types_id" value={formData.machine_types_id} onChange={handleChange} className='form-select' required>
        <option value="">machine type*</option>
        {machineTypes.length > 0 ? (
            machineTypes.map((x) => (
                <option key={x.machine_type_id} value={x.machine_type_id}>
                    {x.machine_type_name}
                </option>
            ))
        ) : (
            <></>
        )}
    </select>
</div>

{(formData.machine_own === 'Rented_fixedprice' || formData.machine_own === 'Rented_variableprice') && (

    <Select
        options={personsoptions}
        value={personsoptions.find((option) => option.value === formData.machine_owner_id)}
        onChange={handleMachineOwnerChange}
        placeholder="Select Machine Owner*"
        isSearchable
        isClearable
        className="react-select-container mb-3"
        classNamePrefix="react-select"

    />


)}

<div className='mb-3'>
    <input
        type="text"
        name="machine_number_plate"
        value={formData.machine_number_plate}
        onChange={handleChange}
        placeholder='Number Plate*'
        className='form-control'
        required
    />
</div>



<div className='mb-3'>
    <input
        type="date"
        name="machine_register_date"
        value={formData.machine_register_date}
        onChange={handleChange}
        className='form-control'
        required
    />
</div>

{formData.machine_own === 'Company' && (
    <div className='mb-3'>
        <select name="machine_condition" value={formData.machine_condition} onChange={handleChange} className='form-select'>
            <option value="">New/Second-hand</option>
            <option value="New">New</option>
            <option value="Second_hand">Second hand</option>
        </select>
    </div>
)}




{/* <div className='mb-3'>
    <select className='form-select' name='price_filter' value={formData.machine_rented_work_type}>

    </select>
</div> */}


{formData.machine_own === 'Rented_variableprice' && (
    <>
        <div className='grid grid-cols-2 gap-2 mb-3'>
            <div className=''>
                <select name="machine_rented_work_type" value={formData.machine_rented_work_type} onChange={handleChange} className='form-select'>
                    <option value="">Work Type</option>
                    {machine_rented_work_type.length > 0 ? (
                        machine_rented_work_type.map((x) => (
                            <option key={x.work_type_id} value={x.work_type_id}>
                                {x.work_type_name}
                            </option>
                        ))
                    ) : (
                        <></>
                    )}
                </select>
            </div>
            <div className=''>
                <input
                    type="number"
                    name="machine_rented_work_price"
                    value={formData.machine_rented_work_price}
                    onChange={handleChange}
                    className='form-control'
                    placeholder='Price'
                />
            </div>
        </div>
    </>
)}


{(formData.machine_own === 'Company' || formData.machine_own === 'Rented_fixedprice') && (

    <div className='mb-3'>
        <input
            type="number"
            name="machine_buy_price"
            value={formData.machine_buy_price}
            onChange={handleChange}
            className='form-control'
            placeholder='Buy Price'
        />
    </div>
)}

{/* <div className='mb-3'>
    <input
        type="date"
        name="machine_buy_date"
        value={formData.machine_buy_date}
        onChange={handleChange}
        className='form-control'
        placeholder='Buy Date'
    />
</div> */}

{/* <div className='mb-3'>
    <input
        type="date"
        name="machine_sold_out_date"
        value={formData.machine_sold_out_date}
        onChange={handleChange}
        className='form-control'
        placeholder='Sold Date'
    />
</div>

<div className='mb-3'>
    <input
        type="number"
        name="machine_sold_price"
        value={formData.machine_sold_price}
        onChange={handleChange}
        placeholder='sold Price'
        className='form-control'
    />
</div> */}



<div className="mb-3">
    <div class="form-check">
        <input class="form-check-input" onChange={handleChange} checked={formData.machine_working} name="machine_working" type="checkbox" id="flexCheckChecked" />
        <label class="form-check-label" for="flexCheckChecked">
            Machine is Working
        </label>
    </div>
</div>



<div className='mb-3'>
    <textarea
        className='form-control'
        name="machine_details"
        value={formData.machine_details}
        onChange={handleChange}

    ></textarea>
</div>

<button type="submit" className="btn btn-sm btn-primary">
    Submit
</button>
</form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Machine_insert