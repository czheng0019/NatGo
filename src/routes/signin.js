import React, { useState } from "react";
import '../styles/signin.css';

const Signin = () => {
  // State for the form fields
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
		const response = await fetch("http://localhost:1000", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({username, email, password})
		});

		const result = await response.json();

		if (!response.ok) {
			setError(result.message);
		}

	} catch (err) {
		setError("failed to connect to the server");
	}
    // You can handle your authentication here, e.g., by calling an API
    console.log("Signed in with email:", email);
    // Reset the form on successful submit
	setUsername("");
    setEmail("");
    setPassword("");
    setError(""); // Clear any previous errors
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Sign In</button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
};

export default Signin;
