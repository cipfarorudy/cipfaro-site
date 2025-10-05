# Configuration pour le domaine personnalisé cipfaro-formations.com

## 1. Configuration DNS requise

### Chez votre registraire de domaine :
1. **Enregistrement CNAME** :
   - Nom : `www`
   - Valeur : `cipfaro-site-bzd0chddcpgperdb.westus3-01.azurewebsites.net`

2. **Enregistrement A** (pour le domaine racine) :
   - Nom : `@` ou vide
   - Valeur : IP de votre Azure Web App (à obtenir depuis le portail Azure)

### Alternative avec CNAME pour le domaine racine :
- Nom : `@`
- Valeur : `cipfaro-site-bzd0chddcpgperdb.westus3-01.azurewebsites.net`

## 2. Configuration Azure Web App

Dans le portail Azure (https://portal.azure.com) :

1. **Aller à votre Web App** : `cipfaro-site`
2. **Domaines personnalisés** > **Ajouter un domaine personnalisé**
3. **Saisir** : `cipfaro-formations.com`
4. **Validation** : Suivre les instructions Azure
5. **Certificat SSL** : Activer "Certificat managé par Azure" (gratuit)

## 3. Redirections HTTPS

Le fichier `web.config` inclus force déjà HTTPS.

## 4. Vérification

Une fois configuré, votre site sera accessible via :
- https://cipfaro-formations.com
- https://www.cipfaro-formations.com

## 5. Propagation DNS

La propagation DNS peut prendre 24-48 heures maximum.
Vérifiez avec : https://dnschecker.org