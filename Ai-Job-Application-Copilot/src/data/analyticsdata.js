// ATS Score Trend
export const atsData = Array.from({ length: 6 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
  score: Math.floor(Math.random() * 20) + 70
}));

// Applications Per Month
export const applicationData = Array.from({ length: 6 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
  applications: Math.floor(Math.random() * 20) + 5
}));

// Skill Progress
export const skillData = [
  { skill: "React", value: Math.floor(Math.random() * 30) + 70 },
  { skill: "Python", value: Math.floor(Math.random() * 30) + 70 },
  { skill: "Flask", value: Math.floor(Math.random() * 30) + 70 },
  { skill: "SQL", value: Math.floor(Math.random() * 30) + 70 },
  { skill: "DSA", value: Math.floor(Math.random() * 30) + 70 }
];

// Application Status Pie Chart
export const statusData = [
  { name: "Applied", value: Math.floor(Math.random() * 20) + 10 },
  { name: "Interview", value: Math.floor(Math.random() * 10) + 5 },
  { name: "Rejected", value: Math.floor(Math.random() * 10) + 2 },
  { name: "Offer", value: Math.floor(Math.random() * 5) + 1 }
];

// Dashboard Overview Cards
export const overviewData = {
  totalApplications: Math.floor(Math.random() * 50) + 20,
  atsScore: Math.floor(Math.random() * 20) + 75,
  interviews: Math.floor(Math.random() * 10) + 3,
  skillsMatched: Math.floor(Math.random() * 15) + 10
};