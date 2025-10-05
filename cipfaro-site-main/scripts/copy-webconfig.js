const fs = require("fs");
const path = require("path");

// Copier web.config vers dist
const webConfigSource = path.join(__dirname, "web.config");
const webConfigDest = path.join(__dirname, "dist", "web.config");

try {
  fs.copyFileSync(webConfigSource, webConfigDest);
  console.log("web.config copié vers dist/");
} catch (error) {
  console.error("Erreur lors de la copie de web.config:", error);
}
