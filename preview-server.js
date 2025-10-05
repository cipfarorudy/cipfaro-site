const express = require("express");
const path = require("path");

const app = express();
const port = 8080;

// Servir les fichiers statiques depuis le dossier dist
app.use(express.static(path.join(__dirname, "dist")));

// Pour les applications SPA, rediriger vers index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(
    `Serveur de prévisualisation démarré sur http://localhost:${port}`
  );
  console.log(`Application CIP FARO accessible sur http://localhost:${port}`);
});
