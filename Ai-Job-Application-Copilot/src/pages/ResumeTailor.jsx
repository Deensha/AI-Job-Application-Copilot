import Sidebar from "../components/sidebar";
import Button from "react-bootstrap/esm/Button";
import "./pages.css";
import { useState } from "react";
function Resumetailor(){
    const[resume,setresume]=useState(null)
    const[jd,setjd]=useState("")
    const [tailoredResume, setTailoredResume] = useState("");
    

    function tailor(){
       
      if(!resume||jd===""){
        alert("please upload the resume and jd")
        return;
      }
       const formData = new FormData();
    formData.append("resume",resume);
    formData.append("jd",jd);

    fetch("https://ai-job-application-copilot-1-m315.onrender.com/resumetailor",{

         method:"POST",
        body:formData
    })


    .then((response) => response.blob())
.then((blob) => {
     const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tailored_resume.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
})
.catch((error) => {
    console.error("Error:", error);
})



    }

   





    return(

    <div className="resume-tailor-main">
            <Sidebar/>
     <div className="resumetailor">
        <h1 className="tailor-resume-heading">Resume Tailor </h1>
        <p className="tailor-resume-subheading">Tailor your resume for specific job</p>
     </div>

    <div className="resume-tailor-box">
        <h4 className="tailor-upload-resume">upload resume
             <input type="file" className="fileareatailor"  onChange={(e)=> setresume(e.target.files[0])}/>
             </h4>
   <h5 className="resume-tailor-jd">Job description</h5>
   <textarea className="resume-tailor-textbox" placeholder="place job description here " onChange={(e)=>setjd(e.target.value)}></textarea>
    </div>
    <Button className="tailor-resume-button" onClick={tailor}>Tailor Resume</Button>
    {tailoredResume && (
    <div>
        <h3>Tailored Resume</h3>
        <pre>{tailoredResume}</pre>
    </div>
)}
     </div>

    )
}

export default Resumetailor;