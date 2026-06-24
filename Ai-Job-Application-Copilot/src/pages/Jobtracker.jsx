import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import "./pages.css";

function Jobtracker() {
  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [showForm, setShowForm] = useState(false);

  // =========================
  // GET USER ID (ONLY ONE KEY)
  // =========================
  const getUserId = () => {
    return localStorage.getItem("userId");
  };

  // =========================
  // LOAD DATA ON PAGE LOAD
  // =========================
  useEffect(() => {
    fetchApplications();
  }, []);

  function openForm() {
    setShowForm(true);
  }

  // =========================
  // ADD APPLICATION
  // =========================
  function addApplication() {
    if (!company || !role || !status || !date) {
      alert("Please fill all fields");
      return;
    }

    const userId = getUserId();

    if (!userId) {
      alert("User not logged in");
      return;
    }

    fetch("https://ai-job-application-copilot-1-m315.onrender.com/jobtracker", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,   // ✅ FIXED KEY
        company,
        role,
        status,
        date,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchApplications();
      })
      .catch((err) => console.log("POST error:", err));

    // reset form
    setCompany("");
    setRole("");
    setStatus("");
    setDate("");
    setShowForm(false);
  }

  // =========================
  // FETCH APPLICATIONS
  // =========================
  function fetchApplications() {
    const userId = getUserId();

    if (!userId) {
      console.log("User not logged in");
      return;
    }

    fetch(`https://ai-job-application-copilot-1-m315.onrender.com/jobtracker/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Application:",data)
        setApplications(data);
      })
      .catch((err) => console.log("GET error:", err));
  }

  // =========================
  // STATS
  // =========================
  const appliedCount = applications.filter(
    (app) => app.status === "Applied"
  ).length;

  const interviewCount = applications.filter(
    (app) => app.status === "Interview"
  ).length;

  const offerCount = applications.filter(
    (app) => app.status === "Offer"
  ).length;

  const rejectedCount = applications.filter(
    (app) => app.status === "Rejected"
  ).length;

  return (
    <div className="JT-container">
      <Sidebar />

      <h1 className="JT">Job Tracker</h1>
      <p className="JT-subheading">Track Your Job Applications</p>

      {/* STATS */}
      <div className="stats-container">
        <div className="stat-card">
          <h4>Applied</h4>
          <h2>{appliedCount}</h2>
        </div>

        <div className="stat-card">
          <h4>Interview</h4>
          <h2>{interviewCount}</h2>
        </div>

        <div className="stat-card">
          <h4>Offers</h4>
          <h2>{offerCount}</h2>
        </div>

        <div className="stat-card">
          <h4>Rejected</h4>
          <h2>{rejectedCount}</h2>
        </div>
      </div>

      {/* HEADER */}
      <div className="application-header">
        <div className="left-header">
          <h4>Application List</h4>
        </div>

        <button className="add-btn" onClick={openForm}>
          +
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="form-overlay">
          <div className="form-card">
            <h3>Add Application</h3>

            <input
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />

            <input
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <div className="form-actions">
              <button onClick={addApplication}>Save</button>
              <button onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* LIST */}
      <div className="applications-list">
        {applications.length === 0 ? (
          <p>No applications added yet</p>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="app-row">
              <div className="left">
                <h3>
                  {app.role} - {app.company}
                </h3>
                <p>{app.date}</p>
              </div>

              <div className={`status ${app.status.toLowerCase()}`}>
                {app.status}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Jobtracker;