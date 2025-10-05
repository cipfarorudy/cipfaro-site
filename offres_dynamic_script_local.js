// Script pour charger dynamiquement les offres d'emploi depuis l'API locale de test
document.addEventListener("DOMContentLoaded", function () {
  const API_BASE_URL = "http://localhost:5000/api"; // API locale pour les tests

  // Fonction pour charger les offres
  function chargerOffres() {
    // Affichage du loader
    const tableBody = document.querySelector("table tbody");
    if (tableBody) {
      tableBody.innerHTML =
        '<tr><td colspan="6" class="loading">🔄 Chargement des offres...</td></tr>';
    }

    fetch(`${API_BASE_URL}/offres`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (tableBody) {
          tableBody.innerHTML = ""; // Clear existing rows

          if (data && data.length > 0) {
            data.forEach((offre) => {
              const row = document.createElement("tr");

              // Tronquer la description si trop longue
              const descriptionCourte =
                offre.description && offre.description.length > 100
                  ? offre.description.substring(0, 100) + "..."
                  : offre.description;

              row.innerHTML = `
                              <td><strong>${
                                offre.entreprise || "N/A"
                              }</strong></td>
                              <td>${offre.titre || "N/A"}</td>
                              <td><span class="badge ${
                                offre.type === "CDI" || offre.type === "CDD"
                                  ? "badge-emploi"
                                  : "badge-stage"
                              }">${offre.type || "N/A"}</span></td>
                              <td title="${offre.description || ""}">${
                descriptionCourte || "N/A"
              }</td>
                              <td><a href="mailto:${offre.emailContact}">${
                offre.emailContact || "N/A"
              }</a></td>
                              <td>${
                                offre.datePublication
                                  ? new Date(
                                      offre.datePublication
                                    ).toLocaleDateString("fr-FR")
                                  : "N/A"
                              }</td>
                          `;

              tableBody.appendChild(row);
            });
          } else {
            tableBody.innerHTML =
              '<tr><td colspan="6" class="no-data">Aucune offre d\'emploi disponible pour le moment.</td></tr>';
          }
        }
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des offres :", error);
        if (tableBody) {
          tableBody.innerHTML = `
                      <tr>
                          <td colspan="6" class="error">
                              ❌ Erreur lors du chargement des offres (API: ${API_BASE_URL}). 
                              <button onclick="chargerOffres()" style="margin-left: 10px;">🔄 Réessayer</button>
                          </td>
                      </tr>
                  `;
        }
      });
  }

  // Charger les offres au démarrage
  chargerOffres();

  // Rafraîchir toutes les 30 secondes (optionnel)
  setInterval(chargerOffres, 30000);

  // Rendre la fonction globalement accessible
  window.chargerOffres = chargerOffres;
});

// Fonction pour tester l'API (pour debug)
function testerAPI() {
  const API_BASE_URL = "http://localhost:5000/api";

  console.log("🧪 Test de l'API...");

  // Test health check
  fetch(`${API_BASE_URL}/health`)
    .then((response) => response.json())
    .then((data) => {
      console.log("✅ Health check:", data);
    })
    .catch((error) => {
      console.error("❌ Erreur health check:", error);
    });

  // Test récupération des offres
  fetch(`${API_BASE_URL}/offres`)
    .then((response) => response.json())
    .then((data) => {
      console.log("✅ Offres récupérées:", data);
    })
    .catch((error) => {
      console.error("❌ Erreur récupération offres:", error);
    });
}
