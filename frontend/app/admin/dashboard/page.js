"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../../styles/dashboard.css";

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { label: "A", value: "" },
    { label: "B", value: "" },
    { label: "C", value: "" },
    { label: "D", value: "" }
  ]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/courses");
        setCourses(response.data);
      } catch (error) {
        toast.error("Failed to fetch courses", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newQuestion = {
      courseId: selectedCourse,
      text: question,
      options: options.map(opt => opt.value),
      correctAnswer,
    };

    try {
      await axios.post("http://localhost:8000/api/questions", newQuestion);

      toast.success("Question Added Successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Reset form
      setSelectedCourse("");
      setQuestion("");
      setOptions([
        { label: "A", value: "" },
        { label: "B", value: "" },
        { label: "C", value: "" },
        { label: "D", value: "" }
      ]);
      setCorrectAnswer("");
    } catch (error) {
      toast.error("Failed to Add Question", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Add Questions</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Course:</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            required
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course._id}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Question:</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>Options:</label>
          {options.map((opt, index) => (
            <div key={opt.label} className="option-input">
              <span className="option-label">{opt.label}.</span>
              <input
                type="text"
                value={opt.value}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index].value = e.target.value;
                  setOptions(newOptions);
                }}
                required
              />
            </div>
          ))}
        </div>

        <div className="form-group">
          <label>Correct Answer:</label>
          <select
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            required
          >
            <option value="">Select Correct Answer</option>
            {options.map((opt) => (
              <option key={opt.label} value={opt.label}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">
          Add Question
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}