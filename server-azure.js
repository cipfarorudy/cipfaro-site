const express = require("express");
const path = require("path");

const app = express();

// Servir les fichiers statiques depuis le dossier dist
app.use(express.static(path.join(__dirname, "dist")));

// Route catch-all pour le SPA routing - doit être en dernier
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Port configuré par Azure ou 8080 par défaut
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
