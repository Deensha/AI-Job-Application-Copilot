import Sidebar from "../components/sidebar"
import "./pages.css"
import { useState,useEffect} from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,BarChart,
  Bar,PieChart,Pie,Cell,Legend
} from "recharts";
import { atsData,applicationData,skillData,statusData,overviewData } from "../data/analyticsdata";
function Analytics(){
    const [activeTab, setActiveTab] = useState("overview");
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042"
];


 return(
    <div className="a-container">
        <Sidebar/>

        <div className="a-container-1">
     <h1 className="a-heading">Analytics</h1>
     <p className="a-subheading">Track Your Progress</p>
    
        </div>
<h4 className="a-overview">Overview</h4>
        
        

        {activeTab === "overview" && (
    <div className="analytics-grid">

        <div className="chart-card">
            ATS Score Chart
              <LineChart
    width={400}
    height={200}
    data={atsData}
  >
    <CartesianGrid strokeDasharray="3 3" />

    <XAxis dataKey="month" />

    <YAxis />

    <Tooltip />

    <Line
      type="monotone"
      dataKey="score"
      stroke="#6366f1"
    />
  </LineChart>
        </div>

        <div className="chart-card">
            Applications Chart
              <BarChart
        width={400}
        height={200}
        data={applicationData}
    >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />

        <Bar
            dataKey="applications"
            fill="#82ca9d"
        />
    </BarChart>
        </div>

        <div className="chart-card">
            Skills Chart
             <BarChart
        width={400}
        height={200}
        data={skillData}
    >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="skill" />
        <YAxis />
        <Tooltip />

        <Bar
            dataKey="value"
            fill="#8884d8"
        />
    </BarChart>
        </div>

        <div className="chart-card">
            Application Status
            
        <PieChart width={350} height={250}>
        <Pie
            data={statusData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            dataKey="value"
        >
            {statusData.map((entry, index) => (
                <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                />
            ))}
        </Pie>

        <Legend />
    </PieChart>
        </div>

    </div>
)}


      {/* ATS */}
{activeTab === "ats" && (
    <div className="chart-card">
        ATS Score Analytics
    </div>
)}

{/* Applications */}
{activeTab === "applications" && (
    <div className="chart-card">
        Applications Analytics
    </div>
)}

{/* Skills */}
{activeTab === "skills" && (
    <div className="chart-card">
        Skills Analytics
    </div>
)}

       
</div> 
    

)


}
export default Analytics