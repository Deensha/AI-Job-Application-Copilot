import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { Link } from "react-router-dom";

function Signup(){
  const [username,setusername]=useState("")
  const [email,setemail]=useState("")
  const [password,setpassword]=useState("")
  const [confirmpassword,setconfirmpassword]=useState("")
  function handlesignup(){
if(username=="" || email=="" || password=="" || confirmpassword==""){
    alert("please fill the required fields")
    return;
  }
if(!email.includes("@gmail.com")){
  alert("please enter the valid email address")
  return;
}
if(password!==confirmpassword){

 alert("mismatch password")
 return;
}
fetch("http://127.0.0.1:5000/signup", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    username,
    email,
    password
  })
})
.then(async (res) => {
  const data = await res.json();
  console.log("RESPONSE:", data);

  if (res.ok) {
    alert("Signup successful!");
  } else {
    alert(data.message);
  }
})
.catch((error) => {
  console.log("ERROR:", error);
  alert("Server error");
});
  }
//connecting react and flask here



  
    return(
        <div className="main">

       <h1 className="heading">Start your AI-powered job search journey </h1>

       <div className="overall1">
       <h3 className="Email">
        Full name  <input type="text" onChange={(e)=>setusername(e.target.value)}/>
      </h3>

      <h3 className="Email">
        Email <input type="text" onChange={(e)=>setemail(e.target.value)}/>
      </h3>

      <h3 className="Password">
        Passowrd <input type="password"  onChange={(e)=>setpassword(e.target.value)} />
      </h3>

      <h3 className="Password">
        confirm password  <input type="password" onChange={(e)=>setconfirmpassword(e.target.value)} />
      </h3>

       <div className="overall3">
        <Button variant="secondary" onClick={()=>handlesignup()}>create account</Button>
        <h6>
        <Link to={"/"}>back to login</Link>
        </h6>
      </div>
       </div>



     





        </div>
    )
}
export default Signup;