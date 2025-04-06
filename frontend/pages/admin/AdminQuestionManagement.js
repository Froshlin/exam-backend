"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminQuestionsDashboard() {
  const [questions, setQuestions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/courses");
        setCourses(response.data);
      } catch (error) {
        toast.error("Failed to fetch courses");
      }
    };
    fetchCourses();
  }, []);

  const fetchQuestionsByCourse = async () => {
    if (!selectedCourse) return;

    try {
      const response = await axios.get(`http://localhost:8000/api/questions/${selectedCourse}`);
      setQuestions(response.data);
    } catch (error) {
      toast.error("Failed to fetch questions");
    }
  };

  const deleteQuestion = async (questionId) => {
    try {
      await axios.delete(`http://localhost:8000/api/questions/${questionId}`);
      setQuestions(questions.filter(q => q._id !== questionId));
      toast.success("Question deleted successfully");
    } catch (error) {
      toast.error("Failed to delete question");
    }
  };

  return (
    <div className="admin-questions-dashboard">
      <h2>Manage Questions</h2>
      
      <div className="course-selector">
        <select 
          value={selectedCourse} 
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Select a Course</option>
          {courses.map(course => (
            <option key={course._id} value={course._id}>
              {course.name} ({course._id})
            </option>
          ))}
        </select>
        <button onClick={fetchQuestionsByCourse}>View Questions</button>
      </div>

      <div className="questions-list">
        {questions.map(question => (
          <div key={question._id} className="question-card">
            <p>{question.text}</p>
            <div className="question-options">
              {question.options.map((opt, index) => (
                <div key={index} className={`option ${question.correctAnswer === String.fromCharCode(65 + index) ? 'correct' : ''}`}>
                  {String.fromCharCode(65 + index)}. {opt}
                </div>
              ))}
            </div>
            <button onClick={() => deleteQuestion(question._id)}>Delete</button>
          </div>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
}