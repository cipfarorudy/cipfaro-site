
<script>
document.addEventListener("DOMContentLoaded", function() {
    fetch("/offres")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#offres-table tbody");
            tableBody.innerHTML = ""; // Clear existing rows

            data.forEach(offre => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${offre.Entreprise}</td>
                    <td>${offre.Titre}</td>
                    <td>${offre.Type}</td>
                    <td>${offre.Description}</td>
                    <td>${offre.EmailContact}</td>
                    <td>${new Date(offre.DatePublication).toLocaleDateString()}</td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Erreur lors du chargement des offres :", error);
        });
});
</script>
