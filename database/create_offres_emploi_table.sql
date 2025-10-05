
CREATE TABLE OffresEmploi (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Entreprise NVARCHAR(100) NOT NULL,
    Titre NVARCHAR(100) NOT NULL,
    Type NVARCHAR(50) CHECK (Type IN ('Emploi', 'Stage')) NOT NULL,
    Description NVARCHAR(MAX),
    EmailContact NVARCHAR(255) NOT NULL,
    DatePublication DATETIME DEFAULT GETDATE()
);
