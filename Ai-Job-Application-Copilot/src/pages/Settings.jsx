import Sidebar from "../components/sidebar";
import "./pages.css";
import { useEffect, useState } from "react";

function Settings() {

    const userId = localStorage.getItem("userId");

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {

        fetch(`https://ai-job-application-copilot-1-m315.onrender.com/user/${userId}`)
            .then((res) => res.json())
            .then((data) => {

                setUsername(data.username);
                setEmail(data.email);
                setPassword(data.password);

            })
            .catch((err) => {
                console.log(err);
            });

    }, [userId]);

    function updateProfile() {

        fetch(`https://ai-job-application-copilot-1-m315.onrender.com/update-user/${userId}`, {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                email,
                password
            })
        })
            .then((res) => res.json())
            .then((data) => {

                alert(data.message);

                localStorage.setItem("username", username);
                localStorage.setItem("email", email);

            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div className="s-container">

            <Sidebar />

            <div className="settings-page">

                <div className="settings-header">
                    <h1 className="s-heading">Settings</h1>
                    <p className="s-subheading">
                        Manage Your Account
                    </p>
                </div>

                <div className="settings-card">

                    <h3>Profile Information</h3>

                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        className="update-btn"
                        onClick={updateProfile}
                    >
                        Update Profile
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Settings;