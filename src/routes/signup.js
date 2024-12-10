import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/signup.css';

const Signup = () => {
  // State for the form fields
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !email || !password) {
      setError("username, email, and password are all required.");
      return;
    }

	try {
		const response = await fetch("http://localhost:1000/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({username, email, password})
		});

		const result = await response.json();
		console.log(result);

		if (!response.ok) {
			setError(result.message);
		}
		const userId = result.userId;

		if (userId) {
			localStorage.setItem("userId", userId);
			console.log(localStorage.json());
		}

	} catch (err) {
		setError("failed to connect to the server");
	}
    // You can handle your authentication here, e.g., by calling an API
    console.log("Signed up with email:", email);
    // Reset the form on successful submit
	setUsername("");
    setEmail("");
    setPassword("");
    setError(""); // Clear any previous errors

	navigate(`/parks`);
  };

  return (
    <div className="signin-container">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
      <h2>Sign up to get started today!</h2>
	  	<div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="username"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Have an account? <a href="/">Sign In</a>
      </p>
    </div>
  );
};

export default Signup;
