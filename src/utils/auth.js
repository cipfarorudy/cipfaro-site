// Système d'authentification centralisé pour CIP FARO
// Utilise l'API backend ou le système local selon la configuration

const AUTH_CONFIG = {
  apiBaseUrl:
    import.meta.env.VITE_API_BASE || "https://api.cipfaro-formations.com",
  useLocalAuth: import.meta.env.VITE_USE_LOCAL_AUTH === "true",
  tokenKey: "cipfaro_auth_token",
  userKey: "cipfaro_user_info",
};

// Comptes de test locaux (à supprimer en production)
const LOCAL_TEST_ACCOUNTS = {
  "admin@cipfaro-formations.com": {
    password: "admin123",
    role: "admin",
    name: "Administrateur CIP FARO",
    permissions: ["users", "formations", "statistics", "system"],
  },
  "formateur@cipfaro-formations.com": {
    password: "formateur123",
    role: "formateur",
    name: "Jean-Paul Martin",
    permissions: ["formations", "stagiaires"],
  },
  "stagiaire@cipfaro-formations.com": {
    password: "stagiaire123",
    role: "stagiaire",
    name: "Marie Dupont",
    permissions: ["profile", "formations"],
  },
  "secretariat@cipfaro-formations.com": {
    password: "secretariat123",
    role: "secretariat",
    name: "Service Secrétariat",
    permissions: ["candidatures", "offres", "communications"],
  },
};

// Fonctions utilitaires
const storage = {
  get: (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};

// Authentification locale (développement/test)
async function authenticateLocal(email, password) {
  // Simulation d'un délai d'API
  await new Promise((resolve) => setTimeout(resolve, 800));

  const account = LOCAL_TEST_ACCOUNTS[email?.toLowerCase()];
  if (account && account.password === password) {
    const token = `local_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const userInfo = {
      email,
      role: account.role,
      name: account.name,
      permissions: account.permissions,
      loginTime: new Date().toISOString(),
    };

    // Sauvegarder en local
    storage.set(AUTH_CONFIG.tokenKey, token);
    storage.set(AUTH_CONFIG.userKey, JSON.stringify(userInfo));

    return {
      success: true,
      token,
      user: userInfo,
    };
  }

  return {
    success: false,
    error: "Email ou mot de passe incorrect",
  };
}

// Authentification via API
async function authenticateAPI(email, password) {
  try {
    const response = await fetch(`${AUTH_CONFIG.apiBaseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.token) {
      // Sauvegarder les données d'authentification
      storage.set(AUTH_CONFIG.tokenKey, data.token);
      storage.set(AUTH_CONFIG.userKey, JSON.stringify(data.user));

      return {
        success: true,
        token: data.token,
        user: data.user,
      };
    }

    return {
      success: false,
      error: data.message || "Erreur d'authentification",
    };
  } catch (error) {
    console.error("Erreur API d'authentification:", error);
    return {
      success: false,
      error: "Impossible de se connecter au serveur",
    };
  }
}

// Fonction principale d'authentification
export async function login(email, password) {
  if (!email || !password) {
    return {
      success: false,
      error: "Email et mot de passe requis",
    };
  }

  // Choisir le mode d'authentification
  if (AUTH_CONFIG.useLocalAuth) {
    return await authenticateLocal(email, password);
  } else {
    return await authenticateAPI(email, password);
  }
}

// Déconnexion
export function logout() {
  storage.remove(AUTH_CONFIG.tokenKey);
  storage.remove(AUTH_CONFIG.userKey);
  return true;
}

// Vérifier si l'utilisateur est connecté
export function isAuthenticated() {
  const token = storage.get(AUTH_CONFIG.tokenKey);
  const userInfo = storage.get(AUTH_CONFIG.userKey);

  if (!token || !userInfo) {
    return false;
  }

  try {
    const user = JSON.parse(userInfo);
    // Vérifier si le token n'est pas trop ancien (24h)
    if (user.loginTime) {
      const loginDate = new Date(user.loginTime);
      const now = new Date();
      const hoursDiff = (now - loginDate) / (1000 * 60 * 60);

      if (hoursDiff > 24) {
        logout(); // Token expiré
        return false;
      }
    }

    return true;
  } catch {
    logout(); // Données corrompues
    return false;
  }
}

// Obtenir les informations de l'utilisateur connecté
export function getCurrentUser() {
  if (!isAuthenticated()) {
    return null;
  }

  try {
    const userInfo = storage.get(AUTH_CONFIG.userKey);
    return userInfo ? JSON.parse(userInfo) : null;
  } catch {
    return null;
  }
}

// Vérifier les permissions
export function hasPermission(permission) {
  const user = getCurrentUser();
  return user?.permissions?.includes(permission) || false;
}

// Vérifier le rôle
export function hasRole(role) {
  const user = getCurrentUser();
  return user?.role === role;
}

// Hook pour les routes protégées
export function requireAuth(requiredRole = null, requiredPermission = null) {
  const user = getCurrentUser();

  if (!user) {
    return {
      authenticated: false,
      authorized: false,
      redirectTo: "/connexion",
    };
  }

  let authorized = true;

  if (requiredRole && user.role !== requiredRole) {
    authorized = false;
  }

  if (requiredPermission && !user.permissions?.includes(requiredPermission)) {
    authorized = false;
  }

  return {
    authenticated: true,
    authorized,
    user,
    redirectTo: authorized ? null : "/",
  };
}

// Rafraîchir le token (si API disponible)
export async function refreshToken() {
  if (AUTH_CONFIG.useLocalAuth) {
    return true; // Pas de refresh nécessaire en local
  }

  try {
    const currentToken = storage.get(AUTH_CONFIG.tokenKey);
    if (!currentToken) return false;

    const response = await fetch(`${AUTH_CONFIG.apiBaseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      storage.set(AUTH_CONFIG.tokenKey, data.token);
      return true;
    }
  } catch (error) {
    console.error("Erreur refresh token:", error);
  }

  logout();
  return false;
}

// Configuration pour les requêtes authentifiées
export function getAuthHeaders() {
  const token = storage.get(AUTH_CONFIG.tokenKey);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Middleware pour les requêtes API authentifiées
export async function authenticatedFetch(url, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Si non autorisé, essayer de rafraîchir le token
    if (response.status === 401) {
      const refreshed = await refreshToken();
      if (refreshed) {
        // Réessayer avec le nouveau token
        return fetch(url, {
          ...options,
          headers: {
            ...headers,
            ...getAuthHeaders(),
          },
        });
      } else {
        // Rediriger vers la connexion
        logout();
        window.location.href = "/connexion";
      }
    }

    return response;
  } catch (error) {
    console.error("Erreur requête authentifiée:", error);
    throw error;
  }
}

// Initialisation du système d'auth
export function initAuthSystem() {
  console.log(
    `🔐 Système d'authentification initialisé (${
      AUTH_CONFIG.useLocalAuth ? "LOCAL" : "API"
    })`
  );

  // Vérifier l'état de connexion au démarrage
  if (isAuthenticated()) {
    const user = getCurrentUser();
    console.log(`✅ Utilisateur connecté: ${user?.name} (${user?.role})`);
  }
}

// Auto-initialisation
initAuthSystem();
