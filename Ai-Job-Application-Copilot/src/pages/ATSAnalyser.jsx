import { useState } from "react";
import Sidebar from "../components/sidebar";
import "./pages.css";
import Button from "react-bootstrap/esm/Button";

function Atsanalyser(){
   const[resume,setresume]=useState(null)
   const[textarea,settextarea]=useState("")
   const[score,setScore]=useState(null)


   function analyse(){
    // console.log("Analyze button clicked");
    if(!resume || textarea===""){
        alert("Please upload a resume and enter a JD")
        return;
    }

    const formData = new FormData();
    formData.append("resume",resume);
    formData.append("jd",textarea);
   

    fetch("http://127.0.0.1:5000/atsanalyser",{
        method:"POST",
        body:formData
    })
    .then(async(res)=>{
        const data = await res.json();
        console.log(data);
        setScore(data.score);
       const userId = localStorage.getItem("userId");

localStorage.setItem(
  `lastAtsScore_${userId}`,
  data.score
);
    })
    .catch((err)=>{
        console.log(err);
    });

}
   


   

    return(
        
    <div className="all"> <Sidebar/> 
    <h1 className="atsanalyser">ATS Analyser</h1>
    <p className="subheadingats">Analyse your resume against job description</p>

     <div className="box">
     <h4 className="uploadresume">upload resume </h4>
     <input type="file" className="filearea" onChange={(e)=>setresume(e.target.files[0])} />

     <h5 className="JD">Job description</h5>
     <textarea className="text" placeholder="Place job description here"  onChange={(e)=>settextarea(e.target.value)}></textarea>
     



     </div>
    <Button className="analyze" onClick={analyse}>Analyze</Button>
    {score !== null && (
       <div className="score-card">
       <div className="score-circle">

        {score}%
       </div>
       <h3>ATS Score</h3>
       </div>
)}
    </div>


    
        

       
      
        
    )
}

export default Atsanalyser;