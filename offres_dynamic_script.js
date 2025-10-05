// Script pour charger dynamiquement les offres d'emploi depuis l'API
document.addEventListener("DOMContentLoaded", function () {
  const API_BASE_URL = "https://votre-api.azurewebsites.net"; // Remplacez par l'URL de votre API déployée

  // Fonction pour charger les offres
  function chargerOffres() {
    // Affichage du loader
    const tableBody = document.querySelector("table tbody");
    tableBody.innerHTML =
      '<tr><td colspan="6" class="loading">🔄 Chargement des offres...</td></tr>';

    fetch(`${API_BASE_URL}/offres`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        tableBody.innerHTML = ""; // Clear existing rows

        if (data && data.length > 0) {
          data.forEach((offre) => {
            const row = document.createElement("tr");

            // Tronquer la description si trop longue
            const descriptionCourte =
              offre.Description && offre.Description.length > 100
                ? offre.Description.substring(0, 100) + "..."
                : offre.Description;

            row.innerHTML = `
                            <td><strong>${
                              offre.Entreprise || "N/A"
                            }</strong></td>
                            <td>${offre.Titre || "N/A"}</td>
                            <td><span class="badge ${
                              offre.Type === "Emploi"
                                ? "badge-emploi"
                                : "badge-stage"
                            }">${offre.Type || "N/A"}</span></td>
                            <td title="${offre.Description || ""}">${
              descriptionCourte || "N/A"
            }</td>
                            <td><a href="mailto:${offre.EmailContact}">${
              offre.EmailContact || "N/A"
            }</a></td>
                            <td>${
                              offre.DatePublication
                                ? new Date(
                                    offre.DatePublication
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
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des offres :", error);
        tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="error">
                            ❌ Erreur lors du chargement des offres. 
                            <button onclick="chargerOffres()" style="margin-left: 10px;">🔄 Réessayer</button>
                        </td>
                    </tr>
                `;
      });
  }

  // Charger les offres au démarrage
  chargerOffres();

  // Rafraîchir toutes les 30 secondes (optionnel)
  setInterval(chargerOffres, 30000);

  // Rendre la fonction globalement accessible
  window.chargerOffres = chargerOffres;
});
