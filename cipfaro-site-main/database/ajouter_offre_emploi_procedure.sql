
CREATE PROCEDURE AjouterOffreEmploi
    @Entreprise NVARCHAR(100),
    @Titre NVARCHAR(100),
    @Type NVARCHAR(50),
    @Description NVARCHAR(MAX),
    @EmailContact NVARCHAR(255)
AS
BEGIN
    INSERT INTO OffresEmploi (Entreprise, Titre, Type, Description, EmailContact, DatePublication)
    VALUES (@Entreprise, @Titre, @Type, @Description, @EmailContact, GETDATE());
END;
