# 🔗 Guide d'intégration Azure Logic Apps pour CIP FARO

## 📋 Vue d'ensemble

Ce guide explique comment connecter le formulaire `deposer-offre.html` à **Azure Logic Apps** pour automatiser la réception et le traitement des offres d'emploi.

---

## ✅ Étapes de configuration

### 1. **Création de la Logic App dans Azure**

#### 📍 Accès au portail Azure
1. Connectez-vous sur **portal.azure.com**
2. Cliquez sur **"Créer une ressource"**
3. Recherchez **"Logic App"**
4. Sélectionnez **"Logic App"**

#### ⚙️ Configuration de base
- **Nom** : `cipfaro-offres-emploi`
- **Groupe de ressources** : Créer nouveau ou utiliser existant
- **Région** : `West Europe` (recommandé)
- **Type de plan** : Consommation (pay-per-use)

### 2. **Configuration du déclencheur HTTP**

#### 🔧 Création du workflow
1. Une fois la Logic App créée, allez dans **"Concepteur Logic Apps"**
2. Choisissez **"Application logique vide"**
3. Recherchez **"Requête"** dans les connecteurs
4. Sélectionnez **"Lorsqu'une requête HTTP est reçue"**

#### 📝 Schéma JSON du déclencheur
Copiez-collez ce schéma dans la zone **"Schéma JSON du corps de la demande"** :

```json
{
  "type": "object",
  "properties": {
    "entreprise": {
      "type": "string",
      "title": "Nom de l'entreprise",
      "description": "Nom de l'entreprise qui dépose l'offre"
    },
    "titre": {
      "type": "string",
      "title": "Titre de l'offre",
      "description": "Intitulé du poste ou du stage"
    },
    "type": {
      "type": "string",
      "title": "Type d'offre",
      "description": "Type d'offre : emploi ou stage",
      "enum": ["emploi", "stage"]
    },
    "description": {
      "type": "string",
      "title": "Description de l'offre",
      "description": "Description détaillée du poste, missions, compétences requises"
    },
    "email": {
      "type": "string",
      "title": "Email de contact",
      "description": "Adresse email de contact de l'entreprise",
      "format": "email"
    },
    "dateSubmission": {
      "type": "string",
      "title": "Date de soumission",
      "description": "Date et heure de soumission du formulaire",
      "format": "date-time"
    },
    "timestamp": {
      "type": "integer",
      "title": "Timestamp Unix",
      "description": "Timestamp Unix pour les tris et calculs"
    }
  },
  "required": [
    "entreprise",
    "titre", 
    "type",
    "description",
    "email",
    "dateSubmission"
  ],
  "additionalProperties": false
}
```

#### 🔗 Récupération de l'URL
1. Cliquez sur **"Enregistrer"** en haut du concepteur
2. L'URL HTTP POST sera générée automatiquement
3. **Copiez cette URL** - vous en aurez besoin pour le formulaire HTML

---

## 🛠️ Actions recommandées dans Logic Apps

### Option 1 : **Envoi d'email avec Office 365**

#### 📧 Notification à l'équipe CIP FARO
1. Ajoutez l'action **"Office 365 Outlook - Envoyer un e-mail (V2)"**
2. Configurez :
   - **À** : `recrutement@cipfaro.fr`
   - **Objet** : `Nouvelle offre: @{triggerBody()?['titre']} - @{triggerBody()?['entreprise']}`
   - **Corps** : 
   ```html
   <h2>Nouvelle offre d'emploi reçue</h2>
   
   <p><strong>Entreprise :</strong> @{triggerBody()?['entreprise']}</p>
   <p><strong>Titre :</strong> @{triggerBody()?['titre']}</p>
   <p><strong>Type :</strong> @{triggerBody()?['type']}</p>
   <p><strong>Email :</strong> @{triggerBody()?['email']}</p>
   <p><strong>Date :</strong> @{triggerBody()?['dateSubmission']}</p>
   
   <h3>Description :</h3>
   <p>@{triggerBody()?['description']}</p>
   
   <hr>
   <p><em>Offre soumise via le site CIP FARO</em></p>
   ```

#### 📧 Confirmation à l'entreprise
1. Ajoutez une seconde action **"Office 365 Outlook - Envoyer un e-mail (V2)"**
2. Configurez :
   - **À** : `@{triggerBody()?['email']}`
   - **Objet** : `Confirmation de réception - Offre @{triggerBody()?['titre']}`
   - **Corps** : 
   ```html
   <h2>Merci pour votre offre d'emploi</h2>
   
   <p>Bonjour,</p>
   
   <p>Nous avons bien reçu votre offre d'emploi :</p>
   <ul>
     <li><strong>Titre :</strong> @{triggerBody()?['titre']}</li>
     <li><strong>Type :</strong> @{triggerBody()?['type']}</li>
     <li><strong>Entreprise :</strong> @{triggerBody()?['entreprise']}</li>
   </ul>
   
   <p>Notre équipe va examiner votre offre et vous contacter sous 24h.</p>
   
   <p>Cordialement,<br>
   L'équipe CIP FARO</p>
   ```

### Option 2 : **Stockage dans SharePoint**

#### 📊 Création d'une liste SharePoint
1. Ajoutez l'action **"SharePoint - Créer un élément"**
2. Configurez les champs :
   - **Entreprise** : `@{triggerBody()?['entreprise']}`
   - **Titre** : `@{triggerBody()?['titre']}`
   - **Type** : `@{triggerBody()?['type']}`
   - **Description** : `@{triggerBody()?['description']}`
   - **Email** : `@{triggerBody()?['email']}`
   - **Date soumission** : `@{triggerBody()?['dateSubmission']}`

### Option 3 : **Stockage dans Excel Online**

#### 📈 Ajout à une feuille Excel
1. Ajoutez l'action **"Excel Online - Ajouter une ligne dans un tableau"**
2. Configurez le mappage des colonnes avec les données du formulaire

---

## 🔧 Configuration du formulaire HTML

### 📝 Mise à jour de l'URL dans le code

Dans le fichier `deposer-offre.html`, remplacez :

```javascript
const LOGIC_APP_URL = 'VOTRE_URL_LOGIC_APP_ICI';
```

Par l'URL réelle de votre Logic App :

```javascript
const LOGIC_APP_URL = 'https://prod-12.westeurope.logic.azure.com:443/workflows/...';
```

---

## 🔒 Sécurité et bonnes pratiques

### 🛡️ Validation des données
- Le schéma JSON valide automatiquement les champs requis
- Validation côté client déjà implémentée dans le formulaire HTML
- Ajoutez des conditions dans Logic Apps pour filtrer les soumissions

### 🔐 Sécurisation de l'endpoint
1. Dans Logic Apps, ajoutez l'action **"Condition"**
2. Vérifiez la présence d'un token ou d'un referrer spécifique
3. Exemple : `@{triggerOutputs()['headers']['Referer']}` contient `cipfaro`

### 📊 Monitoring
- Activez les **diagnostics** dans Azure Logic Apps
- Surveillez les **métriques d'exécution**
- Configurez des **alertes** sur les échecs

---

## 🧪 Test de l'intégration

### ✅ Test manuel
1. Ouvrez `deposer-offre.html` dans un navigateur
2. Remplissez le formulaire avec des données de test
3. Vérifiez la réception dans Logic Apps (onglet "Exécutions")
4. Vérifiez la réception des emails/données

### 🔍 Debugging
- Consultez l'historique des exécutions dans Logic Apps
- Vérifiez les logs du navigateur (F12 → Console)
- Testez l'URL Logic App directement avec Postman

---

## 📈 Évolutions possibles

### 🚀 Améliorations futures
- **Base de données** : Intégration avec Azure SQL Database
- **Intelligence artificielle** : Analyse automatique des offres avec Azure Cognitive Services
- **Teams** : Notifications dans Microsoft Teams
- **Power BI** : Tableaux de bord de suivi des offres
- **API** : Création d'une API REST pour la gestion des offres

### 🔄 Workflow avancé
- Validation automatique des emails avec Azure Functions
- Classification automatique des offres par secteur
- Matching automatique avec les profils de candidats
- Workflow d'approbation avec plusieurs niveaux

---

## 📞 Support

**En cas de problème :**
1. Vérifiez l'URL Logic App dans le fichier HTML
2. Consultez les logs Azure Logic Apps
3. Testez avec des données simples
4. Contactez l'équipe technique : `technique@cipfaro.fr`

---

## 📋 Checklist de déploiement

- [ ] Logic App créée et configurée
- [ ] Déclencheur HTTP ajouté avec le bon schéma
- [ ] Actions d'envoi d'email configurées
- [ ] URL copiée dans `deposer-offre.html`
- [ ] Test complet effectué
- [ ] Monitoring activé
- [ ] Documentation partagée avec l'équipe

**🎉 Votre système de réception d'offres est maintenant opérationnel !**