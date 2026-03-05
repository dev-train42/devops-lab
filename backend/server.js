const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  process.exit(1);
});

app.get("/users", (req, res) => {
  res.json([
    { id: 1, name: "Rider 1 - v2" },
    { id: 2, name: "Pillion 1 - v2" }
  ]);
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});