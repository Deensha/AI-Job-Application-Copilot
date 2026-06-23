import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Login from './pages/Login'
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from './pages/signup'
import { BrowserRouter,Routes, Route } from "react-router-dom"
import Dashboard from './pages/Dashboard'
import Atsanalyser from './pages/ATSAnalyser'
import Interviewcoach from './pages/InterviewCoach'
import Jobtracker from './pages/Jobtracker'
import Resumetailor from './pages/ResumeTailor'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Logout from './pages/Logout'
function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/atsanalyser' element={<Atsanalyser/>}/>
       <Route path='/interviewcoach' element={<Interviewcoach/>}/>
      <Route path='/jobtracker' element={<Jobtracker/>}/>
      <Route path='/resumetailor' element={<Resumetailor/>}/>
      <Route path='analytics' element={<Analytics/>}/>
      <Route path='settings' element={<Settings/>}/>
      <Route path='/' element={<Logout/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
