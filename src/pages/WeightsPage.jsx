import { Link, useNavigate } from "react-router-dom";
import "../styles/classforge.css";
import React, { useState } from "react";

export default function WeightsPage() {
    const navigate = useNavigate();
    const [academicWeight, setAcademicWeight] = useState(50);
    const [socialWeight, setSocialWeight] = useState(50);
    const [wellBeingWeight, setWellBeingWeight] = useState(50);
    const [allocationMessage, setAllocationMessage] = useState("");
    const [datasetFile, setDatasetFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState("");
    
    // Handle file selection for dataset upload
    const handleFileChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        setDatasetFile(e.target.files[0]);
      }
    };
  
    // Upload dataset file to the backend
    const handleDatasetUpload = async (e) => {
      e.preventDefault();
      if (!datasetFile) {
        setUploadMessage("Please select a dataset file.");
        return;
      }
      const formData = new FormData();
      formData.append("dataset", datasetFile);
  
      try {
        const response = await fetch("/api/upload-dataset", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        setUploadMessage(result.message || "Dataset uploaded and stored successfully.");
      } catch (error) {
        console.error("Error uploading dataset:", error);
        setUploadMessage("Error uploading dataset.");
      }
    };
  
    // Run the allocation algorithm with provided weights
    const handleAllocation = async (e) => {
      e.preventDefault();
      const payload = {
        academic: academicWeight,
        social: socialWeight,
        wellBeing: wellBeingWeight,
      };
  
      try {
        const response = await fetch("/api/allocate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        setAllocationMessage(result.message || "Allocation successful and stored.");
        
        // Navigate to the result page after successful allocation
        navigate("/result");
      } catch (error) {
        console.error("Error running allocation:", error);
        setAllocationMessage("Error running allocation.");
      }
    };
  
    return (
      <div>
        {/* Header Section */}
        <header>
          <div className="header-container">
            <div className="logo">
              <a href="index.html" className="logo-link">ClassForge</a>
            </div>
            <nav className="navbar">
              <ul className="nav-list">
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/result">Dashboard</Link></li>
                <li><Link to="/weights">Allocation</Link></li>
                <li><a href="contact.html">Contact</a></li>
              </ul>
            </nav>
          </div>
        </header>
  
        {/* Dataset Upload Section */}
        <section id="dataset-upload">
          <div className="container">
            <h2>Upload Dataset</h2>
            <form onSubmit={handleDatasetUpload}>
              <div className="form-group">
                <label htmlFor="datasetFile">Select Dataset File:</label>
                <input
                  type="file"
                  id="datasetFile"
                  name="datasetFile"
                  accept=".csv, application/json"
                  onChange={handleFileChange}
                />
              </div>
              <button type="submit">Upload Dataset</button>
            </form>
            {uploadMessage && <p>{uploadMessage}</p>}
          </div>
        </section>
  
        {/* Allocation Section */}
        <section id="allocation">
          <div className="container">
            <h2>Classroom Allocation</h2>
            <form id="allocationForm" onSubmit={handleAllocation}>
              <div className="form-group">
                <label htmlFor="academicWeight">Academic Performance Weight:</label>
                <input
                  type="range"
                  id="academicWeight"
                  name="academicWeight"
                  min="0"
                  max="100"
                  value={academicWeight}
                  onChange={(e) => setAcademicWeight(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="socialWeight">Social Integration Weight:</label>
                <input
                  type="range"
                  id="socialWeight"
                  name="socialWeight"
                  min="0"
                  max="100"
                  value={socialWeight}
                  onChange={(e) => setSocialWeight(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label htmlFor="wellBeingWeight">Well-Being Weight:</label>
                <input
                  type="range"
                  id="wellBeingWeight"
                  name="wellBeingWeight"
                  min="0"
                  max="100"
                  value={wellBeingWeight}
                  onChange={(e) => setWellBeingWeight(Number(e.target.value))}
                />
              </div>
              <button type="submit">Run Allocation</button>
            </form>
            <div id="resultsContainer">
              {allocationMessage ? <p>{allocationMessage}</p> : <p>No results yet. Adjust preferences and run allocation.</p>}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer>
            <div className="container">
                <p>&copy; 2025 ClassForge. All rights reserved.</p>
            </div>
        </footer>
      </div>
  );
}