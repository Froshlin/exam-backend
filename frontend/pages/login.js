"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../styles/auth.css";

export default function Login() {
  const [credentials, setCredentials] = useState({
    role: "student",
    matricNumber: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const userData = {
        role: credentials.role,
        password: credentials.password,
        ...(credentials.role === "admin"
          ? { email: credentials.email }
          : { matricNumber: credentials.matricNumber }),
      };
  
      console.log('Exact Login Payload:', JSON.stringify(userData, null, 2));
  
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        userData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Extract token from response
      const { token, role } = res.data;

      // Save token to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Redirect based on role
      if (role === 'student') {
        router.push('/student/dashboard');
      } else if (role === 'admin') {
        router.push('/admin/dashboard');
      }
    } catch (err) {
      console.error('Full Axios Error:', err);
      console.error('Error Response:', err.response?.data);
      console.error('Error Status:', err.response?.status);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleRegisterRedirect = () => {
    router.push('/register');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
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

          <button type="submit" className="submit-button">Login</button>
        </form>
         {/* Pure CSS Registration Link */}
         <div style={{
          marginTop: '20px', 
          textAlign: 'center',
          color: '#007bff',
          cursor: 'pointer',
          textDecoration: 'underline'
        }} onClick={handleRegisterRedirect}>
          Don't have an account? Register here
        </div>
      </div>
    </div>
  );
}
