-- Import simplifiÃ© du schÃ©ma CIP FARO pour Azure PostgreSQL
-- Version optimisÃ©e pour PostgreSQL 14 sur Azure

-- Extensions nÃ©cessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'stagiaire' CHECK (role IN ('admin', 'formateur', 'stagiaire')),
    phone VARCHAR(20),
    company VARCHAR(255),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des formations
CREATE TABLE IF NOT EXISTS formations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    short_description TEXT,
    duration_hours INTEGER DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0.00,
    max_participants INTEGER DEFAULT 12,
    certification VARCHAR(100),
    skills_acquired TEXT[],
    prerequisites TEXT,
    program_outline TEXT,
    is_active BOOLEAN DEFAULT true,
    category VARCHAR(100),
    level VARCHAR(50) DEFAULT 'Débutant',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des sessions de formation
CREATE TABLE IF NOT EXISTS formation_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    formation_id UUID REFERENCES formations(id) ON DELETE CASCADE,
    formateur_id UUID REFERENCES users(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location VARCHAR(255),
    status VARCHAR(20) DEFAULT 'planifié' CHECK (status IN ('planifié', 'en_cours', 'terminé', 'annulé')),
    current_participants INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des inscriptions
CREATE TABLE IF NOT EXISTS inscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    formation_id UUID REFERENCES formations(id) ON DELETE CASCADE,
    session_id UUID REFERENCES formation_sessions(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'en_attente' CHECK (status IN ('en_attente', 'confirmé', 'refusé', 'terminé', 'annulé')),
    inscription_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(20) DEFAULT 'en_attente' CHECK (payment_status IN ('en_attente', 'payé', 'partiel', 'remboursé')),
    amount DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des demandes de contact
CREATE TABLE IF NOT EXISTS contact_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(255),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'en_cours', 'traité', 'fermé')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des demandes de devis
CREATE TABLE IF NOT EXISTS quote_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    formation_type VARCHAR(255),
    participants_count INTEGER,
    training_dates TEXT,
    specific_needs TEXT,
    budget_range VARCHAR(100),
    status VARCHAR(20) DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'en_cours', 'envoyé', 'accepté', 'refusé')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME Zone DEFAULT CURRENT_TIMESTAMP
);

-- Table des fichiers uploadés
CREATE TABLE IF NOT EXISTS uploaded_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100),
    file_size INTEGER,
    uploaded_by UUID REFERENCES users(id),
    entity_type VARCHAR(50), -- 'user', 'formation', 'inscription', etc.
    entity_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_formations_category ON formations(category);
CREATE INDEX IF NOT EXISTS idx_formations_active ON formations(is_active);
CREATE INDEX IF NOT EXISTS idx_inscriptions_user ON inscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_inscriptions_formation ON inscriptions(formation_id);
CREATE INDEX IF NOT EXISTS idx_inscriptions_status ON inscriptions(status);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_status ON quote_requests(status);

-- Insertion de données de test
INSERT INTO formations (title, description, short_description, duration_hours, price, category, level, skills_acquired, prerequisites) VALUES
('Initiation à l''informatique', 'Formation complète pour débuter en informatique', 'Découvrez les bases de l''informatique', 35, 899.00, 'Bureautique', 'Débutant', ARRAY['Navigation internet', 'Messagerie', 'Traitement de texte'], 'Aucun prérequis'),
('Excel Niveau 1', 'Maîtrisez les bases d''Excel pour vos tableaux et calculs', 'Apprenez Excel depuis le début', 21, 650.00, 'Bureautique', 'Débutant', ARRAY['Création de tableaux', 'Formules de base', 'Graphiques simples'], 'Connaissances informatiques de base'),
('Word Avancé', 'Perfectionnement sur Microsoft Word', 'Devenez expert Word', 14, 450.00, 'Bureautique', 'Avancé', ARRAY['Mise en page complexe', 'Publipostage', 'Styles et modèles'], 'Bonnes bases Word'),
('PowerPoint Professionnel', 'Créez des présentations impactantes', 'Maîtrisez PowerPoint pour vos présentations', 7, 350.00, 'Bureautique', 'Intermédiaire', ARRAY['Animations avancées', 'Design professionnel', 'Présentations interactives'], 'Bases PowerPoint'),
('Comptabilité Générale', 'Formation complète en comptabilité pour les entreprises', 'Apprenez la comptabilité d''entreprise', 70, 1800.00, 'Comptabilité', 'Débutant', ARRAY['Tenue des livres', 'Bilan comptable', 'Déclarations fiscales'], 'Notions mathématiques de base')
ON CONFLICT DO NOTHING;

-- Création d'un utilisateur admin par défaut
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, email_verified) VALUES
('admin@cipfaro-formations.com', '$2b$10$YourHashedPasswordHere', 'Admin', 'CIP FARO', 'admin', true, true)
ON CONFLICT (email) DO NOTHING;

-- Triggers pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_formations_updated_at BEFORE UPDATE ON formations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_sessions_updated_at BEFORE UPDATE ON formation_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_inscriptions_updated_at BEFORE UPDATE ON inscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_contact_updated_at BEFORE UPDATE ON contact_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_quote_updated_at BEFORE UPDATE ON quote_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();