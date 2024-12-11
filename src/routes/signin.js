import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/signin.css';

const Signin = () => {
  // State for the form fields
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError("email and password are all required.");
      return;
    }

	try {
		const response = await fetch(`${process.env.backend_url}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({email, password})
		});

		const result = await response.json();
		console.log(result);

		if (!response.ok) {
			setError(result.message);
			return;
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
    console.log("Signed in with email:", email);
    // Reset the form on successful submit
    setEmail("");
    setPassword("");
    setError(""); // Clear any previous errors
	const userId = localStorage.getItem("userId");
	navigate(`/users/${userId}`);
  };

  return (
    <div className="signin-container">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h1>Welcome to NatGo!</h1>
      <form onSubmit={handleSubmit}>
        <h2>Hi there!</h2>
        <h3>Sign in to get started</h3>
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
        <button type="submit">Sign In</button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
};

export default Signin;
