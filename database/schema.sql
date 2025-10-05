-- CIP FARO - Schéma de base de données PostgreSQL
-- Version: 1.0
-- Date: 5 octobre 2025

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    telephone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'stagiaire' CHECK (role IN ('admin', 'formateur', 'stagiaire')),
    active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Table des formations
CREATE TABLE IF NOT EXISTS formations (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    objectifs TEXT,
    contenu TEXT,
    prerequis TEXT,
    public_cible TEXT,
    methodes_pedagogiques TEXT,
    modalites_evaluation TEXT,
    duree_heures INTEGER NOT NULL,
    duree_jours INTEGER,
    prix_ht DECIMAL(10,2),
    prix_ttc DECIMAL(10,2),
    taux_tva DECIMAL(4,2) DEFAULT 20.00,
    categorie VARCHAR(100),
    niveau VARCHAR(50) CHECK (niveau IN ('débutant', 'intermédiaire', 'avancé', 'expert')),
    type_formation VARCHAR(50) CHECK (type_formation IN ('présentiel', 'distanciel', 'mixte')),
    certifiante BOOLEAN DEFAULT false,
    cpf_eligible BOOLEAN DEFAULT false,
    code_cpf VARCHAR(20),
    active BOOLEAN DEFAULT true,
    date_debut DATE,
    date_fin DATE,
    places_disponibles INTEGER,
    formateur_id INTEGER REFERENCES users(id),
    image_url VARCHAR(500),
    slug VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des sessions de formation
CREATE TABLE IF NOT EXISTS sessions_formation (
    id SERIAL PRIMARY KEY,
    formation_id INTEGER REFERENCES formations(id) ON DELETE CASCADE,
    nom_session VARCHAR(255) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    horaires VARCHAR(100),
    lieu VARCHAR(255),
    adresse TEXT,
    formateur_id INTEGER REFERENCES users(id),
    places_max INTEGER DEFAULT 12,
    places_reservees INTEGER DEFAULT 0,
    prix_session DECIMAL(10,2),
    statut VARCHAR(20) DEFAULT 'programmée' CHECK (statut IN ('programmée', 'en_cours', 'terminée', 'annulée')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des pré-inscriptions
CREATE TABLE IF NOT EXISTS preinscriptions (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    adresse TEXT,
    ville VARCHAR(100),
    code_postal VARCHAR(10),
    formation_souhaitee VARCHAR(255) NOT NULL,
    session_id INTEGER REFERENCES sessions_formation(id),
    situation_actuelle TEXT,
    motivations TEXT,
    disponibilite TEXT,
    financement VARCHAR(50) CHECK (financement IN ('personnel', 'cpf', 'entreprise', 'pole_emploi', 'autre')),
    cv_path VARCHAR(500),
    statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'acceptée', 'refusée', 'inscrite')),
    notes_admin TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    traite_par INTEGER REFERENCES users(id),
    traite_le TIMESTAMP
);

-- Table des inscriptions confirmées
CREATE TABLE IF NOT EXISTS inscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_id INTEGER REFERENCES sessions_formation(id),
    preinscription_id INTEGER REFERENCES preinscriptions(id),
    statut VARCHAR(20) DEFAULT 'active' CHECK (statut IN ('active', 'abandonnée', 'terminée')),
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_debut DATE,
    date_fin DATE,
    note_finale DECIMAL(4,2),
    certificat_delivre BOOLEAN DEFAULT false,
    date_certificat TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des devis
CREATE TABLE IF NOT EXISTS devis (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    entreprise VARCHAR(255),
    secteur VARCHAR(100),
    adresse_entreprise TEXT,
    type_formation VARCHAR(255) NOT NULL,
    formation_id INTEGER REFERENCES formations(id),
    nombre_participants INTEGER DEFAULT 1,
    duree_preferee VARCHAR(100),
    dates_souhaitees TEXT,
    lieu_formation VARCHAR(255),
    objectifs TEXT,
    contraintes TEXT,
    budget_estime DECIMAL(10,2),
    mode_formation VARCHAR(20) CHECK (mode_formation IN ('présentiel', 'distanciel', 'mixte')),
    statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'en_cours', 'envoyé', 'accepté', 'refusé')),
    montant_ht DECIMAL(10,2),
    montant_ttc DECIMAL(10,2),
    validite_jours INTEGER DEFAULT 30,
    notes_commercial TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    traite_par INTEGER REFERENCES users(id),
    traite_le TIMESTAMP,
    envoye_le TIMESTAMP
);

-- Table des offres d'emploi
CREATE TABLE IF NOT EXISTS offres_emploi (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    entreprise VARCHAR(255) NOT NULL,
    secteur VARCHAR(100),
    type_contrat VARCHAR(50) CHECK (type_contrat IN ('CDI', 'CDD', 'stage', 'alternance', 'freelance')),
    niveau_requis VARCHAR(50),
    experience_requise VARCHAR(100),
    competences_requises TEXT,
    lieu VARCHAR(255),
    salaire_min DECIMAL(10,2),
    salaire_max DECIMAL(10,2),
    avantages TEXT,
    mission_principale TEXT,
    profil_recherche TEXT,
    date_limite DATE,
    contact_email VARCHAR(255),
    contact_telephone VARCHAR(20),
    active BOOLEAN DEFAULT true,
    mise_en_avant BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Table des candidatures
CREATE TABLE IF NOT EXISTS candidatures (
    id SERIAL PRIMARY KEY,
    offre_id INTEGER REFERENCES offres_emploi(id) ON DELETE CASCADE,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    lettre_motivation TEXT NOT NULL,
    experience_pertinente TEXT,
    cv_path VARCHAR(500),
    portfolio_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    statut VARCHAR(20) DEFAULT 'reçue' CHECK (statut IN ('reçue', 'étudiée', 'retenue', 'refusée', 'entretien')),
    notes_rh TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vue_le TIMESTAMP,
    vue_par INTEGER REFERENCES users(id)
);

-- Table des messages de contact
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    sujet VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type_demande VARCHAR(50) CHECK (type_demande IN ('information', 'devis', 'formation', 'emploi', 'partenariat', 'autre')),
    statut VARCHAR(20) DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'lu', 'en_cours', 'traité', 'fermé')),
    priorite VARCHAR(10) DEFAULT 'normale' CHECK (priorite IN ('basse', 'normale', 'haute', 'urgente')),
    reponse TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    traite_par INTEGER REFERENCES users(id),
    traite_le TIMESTAMP
);

-- Table des actualités/news
CREATE TABLE IF NOT EXISTS actualites (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    contenu TEXT NOT NULL,
    extrait TEXT,
    image_url VARCHAR(500),
    auteur_id INTEGER REFERENCES users(id),
    categorie VARCHAR(100),
    tags VARCHAR(500),
    publie BOOLEAN DEFAULT false,
    date_publication TIMESTAMP,
    slug VARCHAR(255) UNIQUE,
    vue_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des partenaires
CREATE TABLE IF NOT EXISTS partenaires (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    site_web VARCHAR(500),
    secteur VARCHAR(100),
    type_partenariat VARCHAR(100),
    active BOOLEAN DEFAULT true,
    ordre_affichage INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des témoignages
CREATE TABLE IF NOT EXISTS témoignages (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    fonction VARCHAR(255),
    entreprise VARCHAR(255),
    formation_suivie VARCHAR(255),
    note INTEGER CHECK (note >= 1 AND note <= 5),
    commentaire TEXT NOT NULL,
    photo_url VARCHAR(500),
    affiche_publiquement BOOLEAN DEFAULT false,
    valide BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valide_par INTEGER REFERENCES users(id),
    valide_le TIMESTAMP
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) CHECK (type IN ('info', 'success', 'warning', 'error')),
    lue BOOLEAN DEFAULT false,
    action_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lue_le TIMESTAMP
);

-- Table des logs système
CREATE TABLE IF NOT EXISTS logs_systeme (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    table_affectee VARCHAR(100),
    record_id INTEGER,
    anciennes_valeurs JSONB,
    nouvelles_valeurs JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_formations_active ON formations(active);
CREATE INDEX IF NOT EXISTS idx_formations_categorie ON formations(categorie);
CREATE INDEX IF NOT EXISTS idx_sessions_formation_dates ON sessions_formation(date_debut, date_fin);
CREATE INDEX IF NOT EXISTS idx_preinscriptions_statut ON preinscriptions(statut);
CREATE INDEX IF NOT EXISTS idx_devis_statut ON devis(statut);
CREATE INDEX IF NOT EXISTS idx_offres_emploi_active ON offres_emploi(active);
CREATE INDEX IF NOT EXISTS idx_candidatures_statut ON candidatures(statut);
CREATE INDEX IF NOT EXISTS idx_contacts_statut ON contacts(statut);
CREATE INDEX IF NOT EXISTS idx_actualites_publie ON actualites(publie);
CREATE INDEX IF NOT EXISTS idx_notifications_user_lue ON notifications(user_id, lue);

-- Triggers pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_formations_updated_at BEFORE UPDATE ON formations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sessions_formation_updated_at BEFORE UPDATE ON sessions_formation FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_preinscriptions_updated_at BEFORE UPDATE ON preinscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inscriptions_updated_at BEFORE UPDATE ON inscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_devis_updated_at BEFORE UPDATE ON devis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_offres_emploi_updated_at BEFORE UPDATE ON offres_emploi FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_candidatures_updated_at BEFORE UPDATE ON candidatures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_actualites_updated_at BEFORE UPDATE ON actualites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partenaires_updated_at BEFORE UPDATE ON partenaires FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_témoignages_updated_at BEFORE UPDATE ON témoignages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Données initiales
-- Utilisateur admin par défaut
INSERT INTO users (email, password_hash, nom, prenom, role, email_verified) VALUES 
('admin@cipfaro.fr', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewaBnBdmyLWlM0d2', 'Admin', 'CIP FARO', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- Formations de base (reprises du fichier existant)
INSERT INTO formations (titre, description, duree_heures, prix_ht, categorie, niveau, certifiante, cpf_eligible, active) VALUES
('Développement Web Full-Stack', 'Formation complète en développement web moderne avec React, Node.js et bases de données', 280, 4200.00, 'Développement Web', 'intermédiaire', true, true, true),
('Intelligence Artificielle et Machine Learning', 'Initiation à l\'IA et au Machine Learning avec Python et TensorFlow', 210, 3150.00, 'Intelligence Artificielle', 'avancé', true, true, true),
('Cybersécurité Avancée', 'Formation approfondie en sécurité informatique et protection des données', 175, 2625.00, 'Cybersécurité', 'avancé', true, true, true),
('DevOps et Cloud Computing', 'Maîtrise des outils DevOps et des plateformes cloud (AWS, Azure, GCP)', 245, 3675.00, 'Cloud Computing', 'intermédiaire', true, true, true),
('Analyse de Données avec Python', 'Manipulation et analyse de données avec pandas, numpy et matplotlib', 140, 2100.00, 'Data Science', 'débutant', true, true, true)
ON CONFLICT DO NOTHING;

-- Messages de confirmation
SELECT 'Base de données CIP FARO initialisée avec succès!' as status;