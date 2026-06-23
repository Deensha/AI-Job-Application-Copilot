import Sidebar from "../components/sidebar";
import "./pages.css";
import { useState } from "react";
import Button from "react-bootstrap/esm/Button";

function InterviewCoach() {
  const[jd,setjd]=useState("")
  const[questions,setquestions]=useState(null)
  const[selectedSection,setSelectedSection]=useState("")

  async function generateQuestions() {

  if (jd === "") {
    alert("Please enter a Job Description");
    return;
  }

  try {

    const response = await fetch(
      "http://127.0.0.1:5000/interviewcoach",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          jd: jd
        })
      }
    );

    const data = await response.json();

    console.log(data);

    setquestions(data);
    setSelectedSection("");
    
  }
  catch (error) {
    setLoading(false)
    console.log(error);
    alert("Something went wrong");
  }
}

 return(

  <div className="IC-container">
    

    <Sidebar/>
<h1 className="IC">Interview Coach</h1>
<p className="IC-subheading">Prepare For Your Interviews</p>
<div className="IC-box">
<h5 className="IC-JD">Job Description</h5>
<textarea
  className="IC-space"
  placeholder="paste job description here"
  value={jd}
  onChange={(e) => setjd(e.target.value)}
></textarea>
</div>

<Button className="IC-button" onClick={generateQuestions} >Generate Questions</Button>


{
  questions && (

    <div className="IC-cards">

      <div
        className="IC-card"
        onClick={() => setSelectedSection("technical")}
      >
        Technical Questions
      </div>

      <div
        className="IC-card"
        onClick={() => setSelectedSection("hr")}
      >
        HR Questions
      </div>

      <div
        className="IC-card"
        onClick={() => setSelectedSection("project")}
      >
        Project Questions
      </div>

    </div>

  )
}



{
  selectedSection === "technical" &&
  questions && (

    <div className="question-box">

      <h2>Technical Questions</h2>

      {
        questions.technical.map((q, index) => (
          <p key={index}>
            {index + 1}. {q}
          </p>
        ))
      }

    </div>

  )
}

{
  selectedSection === "hr" &&
  questions && (

    <div className="question-box">

      <h2>HR Questions</h2>

      {
        questions.hr.map((q, index) => (
          <p key={index}>
            {index + 1}. {q}
          </p>
        ))
      }

    </div>

  )
}


{
  selectedSection === "project" &&
  questions && (

    <div className="question-box">

      <h2>Project Questions</h2>

      {
        questions.project.map((q, index) => (
          <p key={index}>
            {index + 1}. {q}
          </p>
        ))
      }

    </div>

  )
}

  </div>

 )



}

export default InterviewCoach;