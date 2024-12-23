import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProjectMachines from "./ProjectMachines";
import ProjectDayDetails from "./ProjectDayDetails";
import ProjectMaterial from "./ProjectMaterial";
import ProjectPersons from "./ProjectPersons";
import ProjectExpenses from "./ProjectExpenses";
import Reports from "./Reports";
import useLanguageData from "./languagedata";

function SingleProject() {

  const { languageData } = useLanguageData([]);
  const { project_id } = useParams();
  const [singleprojectdata, setSingleProjectData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(""); // To store the title from API response
  const [sectionname, setSectionName] = useState("");
  
  const fetchProject = async (projectId) => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/single_project_data/",
        {
          params: { project_id: projectId }, // Pass project_id as a query parameter
        }
      );
      console.log(response.data.data);
      setSingleProjectData(response.data.data || {});
      setTitle(response.data.title);
      setLoading(false);
    } catch (err) {
      setError("Failed to load project details");
      setLoading(false);
    }
  };

  const sectionss = async (sectionss) => {
    setSectionName(sectionss);
  };
  // Fetch project data on component mount
  useEffect(() => {
    fetchProject(project_id);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h3>Project : {title}</h3>
      <hr />

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        <div className="p-1">
          <span className="font-semibold">પ્રોજેક્ટ નેમ  : </span>{" "}
          {singleprojectdata.project_name}
        </div>
        <div className="p-1">
          <span className="font-semibold">Amount:</span>{" "}
          {singleprojectdata.project_amount}
        </div>
        <div className="p-1">
          <span className="font-semibold">Location:</span>{" "}
          {singleprojectdata.project_location}
        </div>
        <div className="p-1">
          <span className="font-semibold">Type:</span>{" "}
          {singleprojectdata.project_type_name}
        </div>
        <div className="p-1">
          <span className="font-semibold">Status:</span>{" "}
          {singleprojectdata.project_status}
        </div>
        <div className="p-1">
          <span className="font-semibold">Start Date:</span>{" "}
          {singleprojectdata.project_start_date}
        </div>
        <div className="p-1">
          <span className="font-semibold">End Date:</span>{" "}
          {singleprojectdata.project_end_date}
        </div>
        <div className="p-1">
          <span className="font-semibold">Owner Name:</span>{" "}
          {singleprojectdata.project_owner_name || "N/A"}
        </div>
        <div className="p-1">
          <span className="font-semibold">Owner Contact:</span>{" "}
          {singleprojectdata.project_owner_contact_number || "N/A"}
        </div>
        <div className="p-1">
          <span className="font-semibold">SGST:</span>{" "}
          {singleprojectdata.project_sgst}
        </div>
        <div className="p-1">
          <span className="font-semibold">Tax:</span>{" "}
          {singleprojectdata.project_tax}
        </div>
        <div className="p-1">
          <span className="font-semibold">Discount:</span>{" "}
          {singleprojectdata.project_discount}
        </div>
      </div>
      <hr />

      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-3 mt-3">
      <div
          className="card text-center max-w-xs p-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg font-semibold"
          onClick={() => sectionss("projectdaydetail")}
        >
          <i class="fa-regular fa-sun text-xl"></i> Project Day Details
        </div>
        <div
          className="card text-center max-w-xs p-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg font-semibold"
          onClick={() => sectionss("projectmachine")}
        >
          <i class="fa-solid fa-van-shuttle text-xl"></i> Project Machines
        </div>
        <div
          className="card text-center max-w-xs p-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg font-semibold"
          onClick={() => sectionss("projectperson")}
        >
          <i class="fa-solid fa-person text-xl"></i> Project Persons
        </div>

        <div
          className="card text-center max-w-xs p-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg font-semibold"
          onClick={() => sectionss("projectexpense")}
        >
          <i class="fa-solid fa-sack-dollar text-xl"></i> Project Expense
        </div>

        <div
          className="card text-center max-w-xs p-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg font-semibold"
          onClick={() => sectionss("projectmaterial")}
        >
          <i class="fa-solid fa-water text-xl"></i> Project Materials
        </div>
        <div
          className="card text-center max-w-xs p-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg font-semibold"
          onClick={() => sectionss("projectreport")}
        >
          <i class="fa-solid fa-chart-bar text-xl"></i> Reports
        </div>


      </div>

<div className="mt-3">
{sectionname === "projectdaydetail" && <ProjectDayDetails project_id={project_id} />}

{sectionname === "projectmachine" && <ProjectMachines project_id={project_id} />}



{sectionname === "projectperson" && <ProjectPersons project_id={project_id} />}

{sectionname === "projectexpense" && <ProjectExpenses project_id={project_id} />}

{sectionname === "projectmaterial" && <ProjectMaterial project_id={project_id} />}

{/* {sectionname === "projectreport" && <Reports project_id={project_id} />} */}
</div>
    </div>
  );
}

export default SingleProject;