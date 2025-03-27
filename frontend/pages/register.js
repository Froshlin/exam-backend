"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "../styles/auth.css"; // Import external CSS

export default function Register() {
  const [credentials, setCredentials] = useState({
    role: "student",
    matricNumber: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
  
    // Validate inputs before sending
    if (credentials.role === "student" && !credentials.matricNumber) {
      setError("Matric Number is required for students");
      return;
    }
  
    if (credentials.role === "admin" && !credentials.email) {
      setError("Email is required for admins");
      return;
    }
  
    try {
        const userData = {
            role: credentials.role,
            password: credentials.password,
            ...(credentials.role === "student" 
              ? { matricNumber: credentials.matricNumber }
              : { email: credentials.email })
          };
  
      console.log('Sending user data:', userData); // Log the data being sent
  
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        userData
      );
      
      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
        <form onSubmit={handleSubmit}>
          <select
            name="role"
            value={credentials.role}
            onChange={handleChange}
            className="form-input"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>

          {credentials.role === "student" ? (
            <input
              type="text"
              name="matricNumber"
              placeholder="Matric Number"
              value={credentials.matricNumber}
              onChange={handleChange}
              className="form-input"
            />
          ) : (
            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              value={credentials.email}
              onChange={handleChange}
              className="form-input"
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            className="form-input"
          />

          <button type="submit" className="submit-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
