import "./sidebar.css"
import { RiRobot2Fill } from "react-icons/ri";
import { MdSpaceDashboard } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { MdContentPasteSearch } from "react-icons/md";
import { FaChalkboardTeacher } from "react-icons/fa";
import { SiPivotaltracker } from "react-icons/si";
import { MdAnalytics } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { IoLogOutSharp } from "react-icons/io5";
import { RiLayoutMasonryFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Atsanalyser from "../pages/ATSAnalyser";
function Sidebar(){

  const navigate=useNavigate();
function ATS(){
  return (
    navigate("/atsanalyser")
  )

}

function resumetailor(){
  return (
    navigate("/resumetailor")
  )

}



function interviewcoach(){
  return (
    navigate("/interviewcoach")
  )

}

function jobtracker(){
  return (
    navigate("/jobtracker")
  )

}

function dashboard(){
  return(
    navigate("/dashboard")
  )
}

function analytics(){
  return(
    navigate("/analytics")
  )
}

function settings(){
  return(
    navigate("/settings")
  )
}

function logout(){

  const confirmLogout = window.confirm(
    "Are you sure you want to logout?"
  );

  if(confirmLogout){
    navigate("/");
  }

}

return(
  <div className="sidebar">
 
  <h2 className="logo"><RiRobot2Fill /> AI Job copilot</h2>

  <ul>
  <li onClick={dashboard}> <MdSpaceDashboard /> Dashboard</li>
  <li onClick={ATS}><TbReportAnalytics /> ATS Analyser</li>
  <li onClick={resumetailor}><RiLayoutMasonryFill /> Resume Tailor</li>
  <li onClick={interviewcoach}><FaChalkboardTeacher /> Interview Coach</li>
  <li onClick={jobtracker}> <SiPivotaltracker /> Job Tracker</li>
  <li onClick={analytics}><MdAnalytics /> Analytics </li>
  <li onClick={settings}><IoMdSettings /> Settings</li>
  <li onClick={logout}> <IoLogOutSharp /> Logout</li>


  </ul>



  </div>


)


}
export default Sidebar;