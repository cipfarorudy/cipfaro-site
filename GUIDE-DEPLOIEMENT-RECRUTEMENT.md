# 🚀 Guide de Déploiement - Système de Recrutement CIP FARO

## 📋 Vue d'ensemble du système

Votre plateforme de recrutement CIP FARO est maintenant complète avec :
- **Frontend** : Pages HTML pour candidats et entreprises
- **Backend** : API .NET Minimal API pour Azure
- **Base de données** : Azure SQL Database
- **Intégrations** : Azure Logic Apps pour les notifications

---

## 🏗️ Architecture du système

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Pages HTML    │───▶│   API .NET       │───▶│  Azure SQL DB   │
│ - deposer-offre │    │ - Program.cs     │    │ - Candidatures  │
│ - deposer-cv    │    │ - Endpoints REST │    │ - OffresEmploi  │
│ - offres.html   │    │ - CORS enabled   │    │ - Procédures    │
│ - candidatures  │    └──────────────────┘    └─────────────────┘
└─────────────────┘             │
                                ▼
                    ┌──────────────────┐
                    │  Azure Logic     │
                    │  Apps            │
                    │ - Notifications  │
                    │ - Emails         │
                    └──────────────────┘
```

---

## 🎯 Étapes de déploiement

### **Phase 1 : Préparation de la base de données**

#### 1.1 Créer Azure SQL Database
```bash
# Créer le groupe de ressources
az group create --name cipfaro-rg --location westeurope

# Créer le serveur SQL
az sql server create \
  --name cipfaro-sql-server \
  --resource-group cipfaro-rg \
  --location westeurope \
  --admin-user cipfaroadmin \
  --admin-password VotreMotDePasse123!

# Créer la base de données
az sql db create \
  --resource-group cipfaro-rg \
  --server cipfaro-sql-server \
  --name cipfaro-db \
  --service-objective Basic
```

#### 1.2 Configurer le pare-feu
```bash
# Autoriser les services Azure
az sql server firewall-rule create \
  --resource-group cipfaro-rg \
  --server cipfaro-sql-server \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Autoriser votre IP (remplacez par votre IP publique)
az sql server firewall-rule create \
  --resource-group cipfaro-rg \
  --server cipfaro-sql-server \
  --name AllowMyIP \
  --start-ip-address VOTRE_IP \
  --end-ip-address VOTRE_IP
```

#### 1.3 Exécuter les scripts SQL
1. Connectez-vous à la base avec **Azure Data Studio** ou **SSMS**
2. Exécutez dans l'ordre :
   ```sql
   -- 1. create_candidatures_table.sql
   -- 2. create_offres_emploi_table.sql  
   -- 3. ajouter_candidature_procedure.sql
   -- 4. ajouter_offre_emploi_procedure.sql
   ```

### **Phase 2 : Déploiement de l'API .NET**

#### 2.1 Préparer le projet .NET
```bash
# Créer le projet
dotnet new web -n CipfaroApi
cd CipfaroApi

# Ajouter les packages nécessaires
dotnet add package Microsoft.Data.SqlClient
dotnet add package System.Text.Json
```

#### 2.2 Configurer Program.cs
1. Remplacez le contenu par celui fourni dans `Program.cs`
2. Mettez à jour la chaîne de connexion :
```csharp
string connectionString = "Server=tcp:cipfaro-sql-server.database.windows.net,1433;Initial Catalog=cipfaro-db;User ID=cipfaroadmin;Password=VotreMotDePasse123!;Encrypt=True;";
```

#### 2.3 Déployer sur Azure App Service
```bash
# Créer l'App Service
az appservice plan create \
  --name cipfaro-plan \
  --resource-group cipfaro-rg \
  --sku B1 \
  --is-linux

az webapp create \
  --name cipfaro-api \
  --resource-group cipfaro-rg \
  --plan cipfaro-plan \
  --runtime "DOTNETCORE:8.0"

# Déployer le code
dotnet publish -c Release -o ./publish
cd publish
zip -r ../app.zip .
cd ..

az webapp deployment source config-zip \
  --resource-group cipfaro-rg \
  --name cipfaro-api \
  --src app.zip
```

### **Phase 3 : Configuration des pages HTML**

#### 3.1 Mettre à jour les URLs d'API
Dans `offres_dynamic_script.js`, remplacez :
```javascript
const API_BASE_URL = 'https://cipfaro-api.azurewebsites.net';
```

#### 3.2 Configurer Azure Logic Apps
1. **Créer Logic App** pour `deposer-offre.html`
2. **Utiliser le schéma** dans `azure-logic-apps-schema.json`
3. **Mettre à jour l'URL** dans `deposer-offre.html`

#### 3.3 Déployer les pages HTML
```bash
# Option 1: Azure Static Web Apps
az staticwebapp create \
  --name cipfaro-frontend \
  --resource-group cipfaro-rg \
  --source https://github.com/votre-repo \
  --location westeurope \
  --branch main \
  --app-location "/" \
  --api-location ""

# Option 2: Azure Blob Storage + CDN (plus simple)
az storage account create \
  --name cipfarostorage \
  --resource-group cipfaro-rg \
  --location westeurope \
  --sku Standard_LRS

az storage container create \
  --name $web \
  --account-name cipfarostorage \
  --public-access blob
```

---

## 🔧 Configuration finale

### **Variables d'environnement**

#### Pour l'API .NET (App Service Configuration)
```
SQL_CONNECTION_STRING = "Server=tcp:cipfaro-sql-server.database.windows.net,1433;..."
CORS_ORIGINS = "https://cipfaro.com,https://www.cipfaro.com"
```

#### Pour les pages HTML
```javascript
// Dans chaque fichier JavaScript
const API_BASE_URL = 'https://cipfaro-api.azurewebsites.net';
const LOGIC_APP_URL = 'https://prod-xx.westeurope.logic.azure.com:443/workflows/...';
```

---

## 🧪 Tests de validation

### **1. Test de l'API**
```bash
# Test endpoint candidatures
curl -X POST https://cipfaro-api.azurewebsites.net/candidature \
  -H "Content-Type: application/json" \
  -d '{
    "Nom": "Test",
    "Prenom": "Utilisateur", 
    "Email": "test@example.com",
    "Domaine": "IT",
    "Message": "Test message"
  }'

# Test récupération candidatures
curl https://cipfaro-api.azurewebsites.net/candidature

# Test récupération offres
curl https://cipfaro-api.azurewebsites.net/offres
```

### **2. Test des formulaires**
1. ✅ Ouvrir `deposer-offre.html` dans un navigateur
2. ✅ Remplir et soumettre le formulaire
3. ✅ Vérifier la réception dans Logic Apps
4. ✅ Vérifier l'insertion en base de données

### **3. Test d'affichage**
1. ✅ Ouvrir `offres.html`
2. ✅ Vérifier le chargement des données depuis l'API
3. ✅ Tester le bouton "Actualiser"

---

## 🔐 Sécurité et Production

### **Authentification API (recommandé)**
```csharp
// Ajouter dans Program.cs
builder.Services.AddAuthentication("ApiKey")
    .AddScheme<ApiKeyAuthenticationSchemeOptions, ApiKeyAuthenticationHandler>("ApiKey", null);

// Middleware de validation
app.Use(async (context, next) => {
    if (context.Request.Headers.TryGetValue("X-API-Key", out var apiKey)) {
        if (apiKey == "VOTRE_CLE_SECRETE") {
            await next();
        } else {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("API Key invalide");
        }
    } else {
        context.Response.StatusCode = 401;
        await context.Response.WriteAsync("API Key manquante");
    }
});
```

### **HTTPS et domaine personnalisé**
```bash
# Configurer HTTPS obligatoire
az webapp config set \
  --resource-group cipfaro-rg \
  --name cipfaro-api \
  --https-only true

# Ajouter domaine personnalisé
az webapp config hostname add \
  --webapp-name cipfaro-api \
  --resource-group cipfaro-rg \
  --hostname api.cipfaro.com
```

---

## 📊 Monitoring et Logs

### **Application Insights**
```bash
# Créer Application Insights
az monitor app-insights component create \
  --app cipfaro-insights \
  --location westeurope \
  --resource-group cipfaro-rg

# Lier à l'App Service
az webapp config appsettings set \
  --resource-group cipfaro-rg \
  --name cipfaro-api \
  --settings APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=..."
```

### **Alertes recommandées**
- 🚨 Erreurs API > 5 par minute
- 📈 Utilisation CPU > 80%
- 💾 Utilisation base de données > 80%
- 📧 Échecs Logic Apps

---

## 🚀 Checklist de déploiement

### **Pré-production**
- [ ] Base de données Azure SQL créée et configurée
- [ ] Tables et procédures stockées déployées
- [ ] API .NET testée localement
- [ ] Scripts JavaScript mis à jour avec bonnes URLs
- [ ] Logic Apps configurées avec schémas corrects

### **Production**
- [ ] API déployée sur Azure App Service
- [ ] Pages HTML déployées (Static Web Apps ou Blob Storage)
- [ ] CORS configuré correctement
- [ ] HTTPS activé partout
- [ ] Tests end-to-end réussis
- [ ] Monitoring activé
- [ ] Sauvegardes automatiques configurées

### **Post-déploiement**
- [ ] Documentation utilisateur créée
- [ ] Équipe formée sur l'utilisation
- [ ] Processus de support défini
- [ ] Métriques de performance établies

---

## 🆘 Dépannage rapide

### **Erreurs fréquentes**
```
❌ "CORS policy" → Vérifier configuration CORS dans Program.cs
❌ "Cannot connect to database" → Vérifier chaîne de connexion et pare-feu
❌ "Logic App URL not found" → Vérifier URL dans deposer-offre.html
❌ "API not responding" → Vérifier déploiement App Service
```

### **Logs utiles**
```bash
# Logs App Service
az webapp log tail --resource-group cipfaro-rg --name cipfaro-api

# Logs base de données
# Utiliser Query Performance Insight dans le portail Azure
```

---

## 🎉 **Votre système CIP FARO est prêt !**

Vous avez maintenant une plateforme de recrutement complète avec :
- ✅ **Frontend moderne** responsive
- ✅ **API REST sécurisée** 
- ✅ **Base de données Azure**
- ✅ **Notifications automatiques**
- ✅ **Monitoring intégré**

**Support technique** : Pour toute question, consultez la documentation Azure ou contactez votre équipe technique.

**Prochaines évolutions** : Intelligence artificielle pour matching candidats/offres, tableaux de bord Power BI, intégration avec Teams, etc.