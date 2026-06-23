import { useEffect, useState } from "react";

function RecentActivity({ userId }) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!userId) return;   // 🔥 IMPORTANT FIX

    console.log("Fetching activities for:", userId);

    fetch(`http://localhost:5000/activities/${Number(userId)}`)
      .then(res => res.json())
      .then(data => {
        console.log("ACTIVITIES RESPONSE:", data);
        setActivities(data);
      })
      .catch(err => console.log(err));

  }, [userId]);

  return (
    <div className="recent-box">
      {activities.length === 0 ? (
        <p>No activity yet</p>
      ) : (
        activities.map((a) => (
          <div key={a.id} className="activity-item">
            <p>{a.activity}</p>
            <small>{a.created_at}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default RecentActivity;