import Sidebar from "../components/sidebar";
import "./pages.css"
import Atsanalyser from "./ATSAnalyser";
import { useNavigate} from "react-router-dom";
import { useEffect,useState } from "react";
import RecentActivity from "./recentactivity";



function Dashboard(){
    const username=localStorage.getItem("username")
    console.log("Dashboard userId:", localStorage.getItem("userId"));
    const userId = localStorage.getItem("userId");
    const [atsScore, setAtsScore] = useState(() => {
  return localStorage.getItem(`lastAtsScore_${userId}`) || 0;
});
    const navigate=useNavigate()
    
  const [interviewCount, setInterviewCount] = useState(() => {
  return localStorage.getItem("interviewCount") || 0;
});
const [jobCount, setJobCount] = useState(0);
   

useEffect(() => {
  if (!userId) return;

  fetch(`https://ai-job-application-copilot-1-m315.onrender.com/jobtracker/${userId}`)
    .then(res => res.json())
    .then(data => {
      setJobCount(data.length);

      // ✅ FIX: calculate interviews properly
      const interviews = data.filter(
        (job) => job.status === "Interview"
      ).length;

      setInterviewCount(interviews);
    })
    .catch(err => console.log(err));

}, [userId]);

    return (
        <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
       <h1 className="dashboard-heading">Welcome back, {username}!</h1>
       <p className="dashboard-subheading">Lets's accelerate your career journey.</p>


       <div className="d-stats-container">
        
        <div className="d-card">
          <h4>ATS Score</h4>
          <h2>{atsScore ? `${atsScore}%` : "0%"}</h2>
        </div>

        <div className="d-card">
          <h4>Job applied</h4>
          <h2>{jobCount}</h2>
        </div>

        <div className="d-card">
          <h4>Interviews</h4>
          <h2>{interviewCount}</h2>
        </div>

        <div className="d-card">
          <h4>Profile strength</h4>
          <h2>{Math.min(50 + jobCount * 5, 100)}%</h2>
        </div>
      </div>



      <div className="qa-container">
  <h4 className="qa-heading">Quick Actions</h4>

  <div className="qa-row">

    <div className="qa-card"onClick={()=>navigate("/atsanalyser")}>
      <div className="qa-icon" >📄</div>
      <h6>Analyze Resume</h6>
      <p>Check ATS Score</p>
      
    </div>

    <div className="qa-card" onClick={()=>navigate("/resumetailor")}>
      <div className="qa-icon" >📋</div>
      <h6>Tailor Resume</h6>
      <p>For Job Description</p>
    </div>

    <div className="qa-card" onClick={()=>{navigate("/jobtracker")}}>
      <div className="qa-icon"  >🧩</div>
      <h6>Job Tracker</h6>
      <p>Track Your Applications</p>
    </div>

    <div className="qa-card"onClick={()=>navigate("/interviewcoach")}>
      <div className="qa-icon"  >🎤</div>
      <h6>Interview Coach</h6>
      <p>Prepare Better</p>
    </div>

  </div>
</div>

<div className="recent-activity">
  <h4 className="recent-header">Recent Activity</h4>
 <RecentActivity userId={localStorage.getItem("userId")} />
</div>
        </div>
        
</div>







    )
}

export default Dashboard;