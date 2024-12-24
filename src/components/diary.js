import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

const Diary = () => {
  const [diarydata, setdiarydata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const deletemodel = useRef();
  const [delid,setdelid] = useState("");
  const [Messages, setMessages] = useState('');
  

  const [formData, setFormData] = useState({
    diary_id: "",
    diary_text: "",
  });

  // Fetch work types from API
  const fetchdiarydata = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/show_diary/");
      setdiarydata(response.data.data || []);
      setTitle(response.data.title);
      setLoading(false);
    } catch (err) {
      setError("Failed to load data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchdiarydata();
  }, []);

  useEffect(() => {
    if (Messages) {
      const timer = setTimeout(() => {
        setMessages('');  // Clear success message after 3 seconds
      }, 3000);  // 3000 milliseconds = 3 seconds

      // Cleanup the timer if the component is unmounted or successMessage changes
      return () => clearTimeout(timer);
    }
  }, [Messages]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission for Add/Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/insert_update_diary/",
        formData
      );
      if (response.status === 200) {
        alert("Data saved successfully!");
        fetchdiarydata(); // Reload data
        resetForm();
      } else {
        alert("Failed to save Data.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error occurred while saving Data.");
    }
  };





  const closedeleteModal = () => {
    const modalInstance = Modal.getInstance(deletemodel.current);
    if (modalInstance) {
      modalInstance.hide();
    }
  };

  const opendeleteModal = (id) => {
    const modalInstance = new Modal(deletemodel.current);
    setdelid(id);
    modalInstance.show();

  };

  // Fetch data for editing a specific work type
  const editDetailsGetData = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/insert_update_diary/?getdata_id=${id}`
      );
      setFormData(response.data.data);
    } catch (err) {
      setError("Failed to load work type details");
    }
  };


  const deleteData = async (id) => {
    try{
      const response = await axios.delete(
        `http://127.0.0.1:8000/delete_diary/?diary_id=${id}`
      );
      setMessages(response.data.message)
      fetchdiarydata();
      closedeleteModal();
    } catch (err){
      setError("Failed to delete Diary data")
    }
  }

  // Reset the form state
  const resetForm = () => {
    setFormData({
        diary_id: "",
        diary_text: "",
    });
  };

  // Show loading message while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error message if fetching data failed
  if (error) {
    return <div>{error}</div>;
  }

  // Render the work types table
  return (
    <>
      <div>
      {Messages && <div class="alert alert-success alert-dismissible fade show" role="alert">{Messages}</div>}
        <h1>{title}</h1>

        <form onSubmit={handleSubmit} className="mt-3">
                
                <div>
                  <label className="form-label">Diary Text:</label>
                  
                  <textarea name="diary_text"
                    value={formData.diary_text}
                    onChange={handleChange}
                    className="form-control">

                  </textarea>
                </div>
                
                <button type="submit" className="btn btn-primary mt-3">
                  Submit
                </button>
              </form>
        
        {diarydata.length > 0 && (
            diarydata.map((diary, index) => (
                <>
                    <div className="grid grid-cols-12 mt-3">
                    <div className="col-span-8 md:col-span-10 card">{diary.diary_text}</div>
                    <div className="col-span-2 md:col-span-1 ms-2 card text-center" onClick={() => opendeleteModal(diary.diary_id)}><i class="fa-solid fa-trash-can text-danger"></i>  </div>
                    <div className="col-span-2 md:col-span-1 ms-2 card text-center" onClick={() =>
                        editDetailsGetData(diary.diary_id)}><i class="fa-solid fa-pen-to-square text-warning"></i></div>
                    </div>
                </>
            ))
        )}
        </div>

      
           
         
              
            
      {/* delete Model confirmation */}
      <div
        className="modal fade"
        id="Modal"
        tabIndex="-1"
        aria-labelledby="ModalLabel"
        aria-hidden="true"
        ref={deletemodel}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ModalLabel">
                Delete Diary Data
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              are you sure You want to delete this data?<br/>
            
            <div className="mt-2">
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => deleteData(delid)}
              >Delete</button>

              <button
                type="button"
                className="btn btn-sm btn-primary ms-2"
                data-bs-dismiss="modal"
                aria-label="Close"
              >Cancel</button>
            </div>
            </div>
          </div>
        </div>
        </div>
    </>
  );
};

export default Diary;
