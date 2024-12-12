import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import ProjectMachines from "./ProjectMachines";
import ProjectDayDetails from "./ProjectDayDetails";
import ProjectMaterial from "./ProjectMaterial";
import ProjectPersons from "./ProjectPersons";

function SingleProject() {
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
          <span className="font-semibold">Project Name:</span>{" "}
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

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3 mt-3">
        <div
          className="card text-center"
          onClick={() => sectionss("projectmachine")}
        >
          project-machines
        </div>
        <div
          className="card text-center"
          onClick={() => sectionss("projectdaydetail")}
        >
          project-day-details
        </div>
        <div
          className="card text-center"
          onClick={() => sectionss("projectperson")}
        >
          project-persons
        </div>
        <div
          className="card text-center"
          onClick={() => sectionss("projectmaterial")}
        >
          project-materials
        </div>
        <div
          className="card text-center"
          onClick={() => sectionss("projectreport")}
        >
          Report
        </div>


      </div>

<div className="mt-3">
{sectionname === "projectmachine" && <ProjectMachines />}

{sectionname === "projectdaydetail" && <ProjectDayDetails />}

{sectionname === "projectperson" && <ProjectPersons />}

{sectionname === "projectmaterial" && <ProjectMaterial />}
</div>
    </div>
  );
}

export default SingleProject;
