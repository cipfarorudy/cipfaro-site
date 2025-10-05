
CREATE PROCEDURE AjouterCandidature
    @Nom NVARCHAR(100),
    @Prenom NVARCHAR(100),
    @Email NVARCHAR(255),
    @DomaineRecherche NVARCHAR(150),
    @Message NVARCHAR(MAX)
AS
BEGIN
    INSERT INTO Candidatures (Nom, Prenom, Email, DomaineRecherche, Message, DateSoumission)
    VALUES (@Nom, @Prenom, @Email, @DomaineRecherche, @Message, GETDATE());
END;
