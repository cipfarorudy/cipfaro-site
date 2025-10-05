# 🧪 Guide de Tests End-to-End - CIP FARO API

## 📋 Vue d'ensemble

Ce guide vous permet de tester complètement votre système de recrutement CIP FARO, de l'API aux interfaces utilisateur.

---

## 🚀 1. Tests de l'API (Backend)

### **A. Test de santé et authentification**

#### 1.1 Vérification du Health Check
```bash
# Test de base (doit retourner status: healthy)
curl -X GET https://cipfaro-api.azurewebsites.net/health
```

**Réponse attendue :**
```json
{
  "status": "healthy",
  "timestamp": "2024-10-04T14:30:00.000Z"
}
```

#### 1.2 Génération d'un token JWT
```bash
# Générer un token d'authentification
curl -X POST https://cipfaro-api.azurewebsites.net/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "username": "cipfaro",
    "password": "admin123"
  }'
```

**Réponse attendue :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires": "2024-10-05T14:30:00.000Z"
}
```

### **B. Tests des endpoints de candidatures**

#### 1.3 Créer une candidature
```bash
# Envoyer une candidature de test
curl -X POST https://cipfaro-api.azurewebsites.net/candidature \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Martin",
    "prenom": "Jean",
    "email": "jean.martin@email.com",
    "domaine": "Développement Web",
    "message": "Candidature spontanée pour un poste de développeur"
  }'
```

**Réponse attendue :**
```
Candidature enregistrée avec succès.
```

#### 1.4 Récupérer les candidatures
```bash
# Lister toutes les candidatures
curl -X GET https://cipfaro-api.azurewebsites.net/candidature
```

**Réponse attendue :**
```json
[
  {
    "nom": "Martin",
    "prenom": "Jean",
    "email": "jean.martin@email.com",
    "domaine": "Développement Web",
    "message": "Candidature spontanée pour un poste de développeur"
  }
]
```

### **C. Tests des endpoints d'offres d'emploi**

#### 1.5 Créer une offre d'emploi
```bash
# Publier une offre de test
curl -X POST https://cipfaro-api.azurewebsites.net/offre \
  -H "Content-Type: application/json" \
  -d '{
    "entreprise": "TechCorp",
    "titre": "Développeur Full Stack",
    "type": "Emploi",
    "description": "Recherche développeur expérimenté en React/Node.js",
    "emailContact": "recrutement@techcorp.com"
  }'
```

**Réponse attendue :**
```
Offre d'emploi enregistrée avec succès.
```

#### 1.6 Récupérer les offres d'emploi
```bash
# Lister toutes les offres
curl -X GET https://cipfaro-api.azurewebsites.net/offres
```

**Réponse attendue :**
```json
[
  {
    "id": 1,
    "entreprise": "TechCorp",
    "titre": "Développeur Full Stack",
    "type": "Emploi",
    "description": "Recherche développeur expérimenté en React/Node.js",
    "emailContact": "recrutement@techcorp.com",
    "datePublication": "2024-10-04T14:30:00.000Z"
  }
]
```

---

## 🌐 2. Tests des Pages Web (Frontend)

### **A. Test du formulaire de dépôt d'offres**

#### 2.1 Test de `deposer-offre.html`

**Étapes :**
1. ✅ Ouvrir : `https://votre-domaine.com/deposer-offre.html`
2. ✅ Remplir le formulaire :
   - Nom de l'entreprise : "Entreprise Test"
   - Titre : "Développeur Junior"
   - Type : "Emploi"
   - Description : "Poste pour développeur débutant"
   - Email : "test@entreprise.com"
3. ✅ Cliquer sur "Envoyer l'offre"
4. ✅ Vérifier l'affichage du message de succès
5. ✅ Contrôler dans la base de données que l'offre est enregistrée

**Cas de test d'erreur :**
- Soumettre avec des champs vides → Message d'erreur de validation
- Soumettre avec email invalide → Message d'erreur email
- Tester sans connexion API → Message d'erreur réseau

#### 2.2 Test de `deposer-cv.html`

**Étapes :**
1. ✅ Ouvrir : `https://votre-domaine.com/deposer-cv.html`
2. ✅ Remplir le formulaire candidat
3. ✅ Soumettre et vérifier la confirmation
4. ✅ Vérifier l'enregistrement en base

### **B. Test de l'affichage des offres**

#### 2.3 Test de `offres.html`

**Étapes :**
1. ✅ Ouvrir : `https://votre-domaine.com/offres.html`
2. ✅ Vérifier l'affichage du message de chargement
3. ✅ Attendre le chargement des données depuis l'API
4. ✅ Contrôler l'affichage correct des offres :
   - Colonnes bien remplies
   - Badges colorés pour types (Emploi/Stage)
   - Dates formatées correctement
   - Liens email fonctionnels
5. ✅ Tester le bouton "Actualiser les offres"
6. ✅ Tester le cas "Aucune offre disponible"

**Test d'erreur :**
- Déconnecter l'API → Message d'erreur avec bouton réessayer

---

## 🔗 3. Tests d'Intégration Azure Logic Apps

### **A. Test des notifications email**

#### 3.1 Workflow de notification entreprise

**Étapes :**
1. ✅ Soumettre une offre via `deposer-offre.html`
2. ✅ Vérifier la réception dans Azure Logic Apps :
   - Aller dans portal.azure.com
   - Ouvrir votre Logic App
   - Consulter l'historique des exécutions
3. ✅ Contrôler l'envoi de l'email de confirmation
4. ✅ Vérifier l'email reçu par l'équipe CIP FARO

#### 3.2 Test de l'intégration base de données

**Étapes :**
1. ✅ Soumettre des données via Logic Apps
2. ✅ Vérifier l'insertion en base SQL :
```sql
-- Connexion à votre Azure SQL Database
SELECT TOP 10 * FROM OffresEmploi ORDER BY DatePublication DESC;
SELECT TOP 10 * FROM Candidatures ORDER BY DateSoumission DESC;
```

---

## 📊 4. Tests de Performance et Charge

### **A. Tests de montée en charge**

#### 4.1 Test de charge API
```bash
# Utiliser Apache Bench (ab) ou Artillery
ab -n 100 -c 10 https://cipfaro-api.azurewebsites.net/offres
```

#### 4.2 Test de stress formulaires
- Soumettre plusieurs formulaires simultanément
- Vérifier les temps de réponse
- Contrôler l'intégrité des données

---

## 🔐 5. Tests de Sécurité

### **A. Tests d'authentification**

#### 5.1 Test des endpoints protégés
```bash
# Test sans token (doit retourner 401)
curl -X GET https://cipfaro-api.azurewebsites.net/candidature

# Test avec token invalide (doit retourner 401)
curl -X GET https://cipfaro-api.azurewebsites.net/candidature \
  -H "Authorization: Bearer token-invalide"

# Test avec token valide (doit retourner 200)
curl -X GET https://cipfaro-api.azurewebsites.net/candidature \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### **B. Tests de validation**

#### 5.2 Injection SQL et XSS
```bash
# Test d'injection SQL
curl -X POST https://cipfaro-api.azurewebsites.net/candidature \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "'; DROP TABLE Candidatures; --",
    "prenom": "Test",
    "email": "test@test.com",
    "domaine": "IT",
    "message": "Test injection"
  }'
```

**Résultat attendu :** Rejet avec validation ou échappement correct

---

## 📱 6. Tests de Compatibilité

### **A. Tests multi-navigateurs**

#### 6.1 Navigateurs à tester
- ✅ Chrome (dernière version)
- ✅ Firefox (dernière version)
- ✅ Safari (si disponible)
- ✅ Edge (dernière version)

#### 6.2 Tests mobile/responsive
- ✅ iPhone Safari
- ✅ Android Chrome
- ✅ Tablettes (iPad, Android)

---

## 🎯 7. Checklist de Validation Complète

### **Infrastructure**
- [ ] API déployée et accessible
- [ ] Base de données créée et connectée
- [ ] Azure Logic Apps configurées
- [ ] HTTPS activé partout
- [ ] CORS configuré correctement

### **Fonctionnalités**
- [ ] Dépôt d'offres fonctionne
- [ ] Dépôt de CV fonctionne
- [ ] Affichage des offres fonctionne
- [ ] Notifications emails fonctionnent
- [ ] Authentification JWT fonctionne

### **Performance**
- [ ] Temps de chargement < 3 secondes
- [ ] API répond en < 500ms
- [ ] Pas de fuite mémoire
- [ ] Gestion des erreurs robuste

### **Sécurité**
- [ ] Validation des données
- [ ] Protection contre injection SQL
- [ ] HTTPS obligatoire
- [ ] Tokens JWT sécurisés

---

## 🆘 Résolution des Problèmes Courants

### **Erreur CORS**
```javascript
// Vérifiez dans Program.cs
app.UseCors("AllowFrontend");
```

### **Erreur de connexion base de données**
```csharp
// Vérifiez la chaîne de connexion dans Azure
Server=tcp:votre-server.database.windows.net,1433;...
```

### **Erreur Logic Apps**
- Vérifiez l'URL dans `deposer-offre.html`
- Contrôlez les logs d'exécution dans Azure

---

## 🎉 Validation Finale

Une fois tous les tests passés avec succès, votre système CIP FARO est **prêt pour la production** !

**Métriques de succès :**
- ✅ 100% des endpoints fonctionnels
- ✅ 0 erreur critique
- ✅ Temps de réponse < 500ms
- ✅ Interface utilisateur responsive
- ✅ Notifications automatiques opérationnelles

**Surveillance continue :**
- Configurer Application Insights
- Mettre en place des alertes
- Planifier des sauvegardes régulières
- Documenter les procédures de maintenance