import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BaseLayout from './components/BaseLayout';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Home from './components/Home';
import Banks from './components/Banks';
import MachineTypes from './components/MachineTypes'
import Machines from './components/Machines'
import WorkingMachines from './components/WorkingMachines'
import MaintenanceTypes from './components/MaintenanceTypes'
import MachineMaintenance from './components/MachineMaintenance'
import ProjectTypes from './components/ProjectTypes'
import Projects from './components/Projects'
import PayTypes from './components/PayTypes'
import PersonTypes from './components/PersonTypes'
import Persons from './components/Persons'
import WorkTypes from './components/WorkTypes'
import MaterialTypes from './components/MaterialTypes'
import Materials from './components/Materials'
import PersonWorkMachines from './components/PersonWorkMachines'
import DocumentTypes from './components/DocumentTypes'
import Documents from './components/Documents'

const App = () => { 
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Home />} />
          <Route path="banks" element={<Banks />} />
          <Route path="machine-types" element={<MachineTypes />} />
          <Route path="machines" element={<Machines />} />
          <Route path="working-machines" element={<WorkingMachines />} />
          <Route path="maintenance-types" element={<MaintenanceTypes />} />
          <Route path="machine-maintenance" element={<MachineMaintenance />} />
          <Route path="project-types" element={<ProjectTypes />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects" element={<Projects />} />
          <Route path="pay-types" element={<PayTypes />} />
          <Route path="person-types" element={<PersonTypes />} />
          <Route path="persons" element={<Persons />} />
          <Route path="work-types" element={<WorkTypes  />} />
          <Route path="material-types" element={<MaterialTypes  />} />
          <Route path="materials" element={<Materials  />} />
          <Route path="person-work-machine" element={<PersonWorkMachines  />} />
          <Route path="document-types" element={<DocumentTypes  />} />
          <Route path="documents" element={<Documents  />} />
        </Route>
      </Routes>
    </Router>
    </>
  );
};

export default App;
