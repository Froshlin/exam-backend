import { useState } from "react";
import axios from "axios";

export default function AddQuestion() {
  const [question, setQuestion] = useState({ text: "", options: [], correctAnswer: "" });

  const handleChange = (e) => {
    setQuestion({ ...question, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/questions`, question);
      alert("Question added successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Add Question</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="text" placeholder="Question" onChange={handleChange} />
        <input type="text" name="options" placeholder="Options (comma-separated)" onChange={handleChange} />
        <input type="text" name="correctAnswer" placeholder="Correct Answer" onChange={handleChange} />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
