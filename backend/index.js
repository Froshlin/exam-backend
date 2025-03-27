const app = require("./server");

// Ensure a default port for local development
const PORT = process.env.PORT || 8000;

// Only start server if not in Vercel environment
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

console.log("Index.js loaded. Environment:", process.env);

module.exports = app;