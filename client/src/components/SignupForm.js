import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        { username, email, password }
      );
      console.log("Signup successful:", response.data);
      navigate("/login"); // Redirect to login after signup
    } catch (error) {
      console.error("Signup error:", error.response.data);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <div className="col-md-3 bg-white p-3 mt-4 rounded-4 shadow">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-custom-primary">
              Signup
            </button>
          </div>
        </form>
        <div className='mt-3 text-center'>
          Already have an account? 
          <Link to="/login" className="text-primary">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
