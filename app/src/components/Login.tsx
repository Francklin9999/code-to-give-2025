// LOGIN/SIGN UP form

import React, { useState, useEffect } from "react";

const Login: React.FC = () => {
    const [isFirstVisit, setIsFirstVisit] = useState(false);

    useEffect(() => {
        const hasVisited = localStorage.getItem("hasVisitedMyPage");

        if (!hasVisited) {
            setIsFirstVisit(true);
            localStorage.setItem("hasVisitedMyPage", "true");
        }
    }, []);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const endpoint = isFirstVisit
            ? "http://localhost:8000/login"
            : "http://localhost:8000/signup";
        const payload = isFirstVisit
            ? { email, password }
            : { email, password, fname, lname };
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        alert(data.message);
    };

    return (
        <div>
            <h2>{isFirstVisit ? "Login" : "Sign Up"}</h2>
            <form onSubmit={handleSubmit} className="loginForm">
                {!isFirstVisit && (
                    <>
                        <input
                            type="text"
                            placeholder="First Name"
                            value={fname}
                            onChange={(e) => setFname(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lname}
                            onChange={(e) => setLname(e.target.value)}
                            required
                        />
                    </>
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">
                    {isFirstVisit ? "Login" : "Sign Up"}
                </button>
            </form>
            <button onClick={() => setIsFirstVisit(!isFirstVisit)}>
                {isFirstVisit ? "Switch to Sign Up" : "Switch to Login"}
            </button>
        </div>
    );
};
export default Login;
