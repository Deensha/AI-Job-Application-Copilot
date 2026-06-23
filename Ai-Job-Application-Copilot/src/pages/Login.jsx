import "./Login.css";
import Button from "react-bootstrap/Button";
import Signup from "./signup";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios"
import { Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
function Login() {
    const [email,setemail]=useState("")
    const[password,setpassword]=useState("")
    const[message,setMessage]=useState("")
    const navigate=useNavigate()
   const handlelogin = async () => {
  try {
    const res = await axios.post("http://127.0.0.1:5000/login", {
      email,
      password
    });

    if (res.data.success) {
      setMessage("Login successful ✅");
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("username", res.data.user.username);
      localStorage.setItem("email",res.data.user.email)
      console.log(res.data.user);
      navigate("/dashboard")
    } else {
      setMessage(res.data.message);
      alert("no account found")
    }

  } catch (error) {
    if (error.response) {
      setMessage(error.response.data.message); // 👈 IMPORTANT FIX
    } else {
      setMessage("Server error ❌");
    }
  }
};
    
  return (
    <div className="main">
        <h1 className="heading">AI Job Application Copilot</h1>
    <div className="overall1">
      
      <h2 className="subheading">Welcome Back 😊</h2>

      <h3 className="Email" >
        Email <input type="email" onChange={(e)=>setemail(e.target.value)}/>
      </h3>

      <h3 className="Password" >
        Password <input type="password" onChange={(e)=>setpassword(e.target.value)}/>
      </h3>

      <div className="overall2">
        <Button variant="primary" onClick={()=>handlelogin()} >Login</Button>
        <Button variant="secondary">Forgot Password</Button>
      </div>

      <div className="overall3">
        <h6 className="noaccount">Don't have an account?</h6>
        <h6>
        <Link to={"/signup"}>Sign Up</Link>
        </h6>
      </div>
    </div>
    </div>
  );


}

export default Login;






  




