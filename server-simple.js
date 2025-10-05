const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, "dist")));

// Fallback pour SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
