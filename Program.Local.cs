using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Configuration des services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "CIP FARO API - Local Test", 
        Version = "v1",
        Description = "API pour la gestion des candidatures et offres d'emploi CIP FARO - Version de développement local"
    });
    
    // Configuration pour JWT dans Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});

// Configuration JWT
var jwtKey = builder.Configuration["Jwt:Key"] ?? "CipFaro-Local-Test-Key-2024-Super-Secure-Random-String-256bits-ForDevelopment";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "CipFaro-API-Local";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "CipFaro-Frontend-Local";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

// Configuration CORS plus permissive pour le développement local
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalDev", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173", "http://localhost:8080", "http://127.0.0.1:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configuration du pipeline
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "CIP FARO API Local V1");
    c.RoutePrefix = string.Empty; // Pour avoir Swagger à la racine
});

app.UseCors("AllowLocalDev");
app.UseAuthentication();
app.UseAuthorization();

// Connection string pour SQLite local
string connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=cipfaro_local.db";

// Initialisation de la base de données SQLite
await InitializeDatabase(connectionString);

// Model classes
public class Candidature
{
    public int Id { get; set; }
    public string Nom { get; set; } = string.Empty;
    public string Prenom { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Domaine { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime DateCreation { get; set; }
}

public class OffreEmploi
{
    public int Id { get; set; }
    public string Entreprise { get; set; } = string.Empty;
    public string Titre { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string EmailContact { get; set; } = string.Empty;
    public DateTime DatePublication { get; set; }
}

// POST endpoint to receive a candidature
app.MapPost("/api/candidature", async (Candidature candidature) =>
{
    using var connection = new SqliteConnection(connectionString);
    await connection.OpenAsync();

    var command = connection.CreateCommand();
    command.CommandText = @"
        INSERT INTO Candidatures (Nom, Prenom, Email, Domaine, Message, DateCreation)
        VALUES (@nom, @prenom, @email, @domaine, @message, @dateCreation)";
    
    command.Parameters.AddWithValue("@nom", candidature.Nom);
    command.Parameters.AddWithValue("@prenom", candidature.Prenom);
    command.Parameters.AddWithValue("@email", candidature.Email);
    command.Parameters.AddWithValue("@domaine", candidature.Domaine);
    command.Parameters.AddWithValue("@message", candidature.Message);
    command.Parameters.AddWithValue("@dateCreation", DateTime.Now);

    await command.ExecuteNonQueryAsync();

    return Results.Ok(new { message = "Candidature enregistrée avec succès", success = true });
})
.WithName("CreateCandidature")
.WithTags("Candidatures")
.WithOpenApi();

// GET endpoint to retrieve all candidatures
app.MapGet("/api/candidatures", async () =>
{
    var candidatures = new List<Candidature>();

    using var connection = new SqliteConnection(connectionString);
    await connection.OpenAsync();

    var command = connection.CreateCommand();
    command.CommandText = "SELECT Id, Nom, Prenom, Email, Domaine, Message, DateCreation FROM Candidatures ORDER BY DateCreation DESC";

    using var reader = await command.ExecuteReaderAsync();
    while (await reader.ReadAsync())
    {
        candidatures.Add(new Candidature
        {
            Id = reader.GetInt32("Id"),
            Nom = reader.GetString("Nom"),
            Prenom = reader.GetString("Prenom"),
            Email = reader.GetString("Email"),
            Domaine = reader.GetString("Domaine"),
            Message = reader.GetString("Message"),
            DateCreation = reader.GetDateTime("DateCreation")
        });
    }

    return Results.Ok(candidatures);
})
.WithName("GetCandidatures")
.WithTags("Candidatures")
.WithOpenApi();

// POST endpoint to receive an offre d'emploi
app.MapPost("/api/offre", async (OffreEmploi offre) =>
{
    using var connection = new SqliteConnection(connectionString);
    await connection.OpenAsync();

    var command = connection.CreateCommand();
    command.CommandText = @"
        INSERT INTO OffresEmploi (Entreprise, Titre, Type, Description, EmailContact, DatePublication)
        VALUES (@entreprise, @titre, @type, @description, @emailContact, @datePublication)";
    
    command.Parameters.AddWithValue("@entreprise", offre.Entreprise);
    command.Parameters.AddWithValue("@titre", offre.Titre);
    command.Parameters.AddWithValue("@type", offre.Type);
    command.Parameters.AddWithValue("@description", offre.Description);
    command.Parameters.AddWithValue("@emailContact", offre.EmailContact);
    command.Parameters.AddWithValue("@datePublication", DateTime.Now);

    await command.ExecuteNonQueryAsync();

    return Results.Ok(new { message = "Offre d'emploi enregistrée avec succès", success = true });
})
.WithName("CreateOffre")
.WithTags("Offres")
.WithOpenApi();

// GET endpoint to retrieve all offres d'emploi
app.MapGet("/api/offres", async () =>
{
    var offres = new List<OffreEmploi>();

    using var connection = new SqliteConnection(connectionString);
    await connection.OpenAsync();

    var command = connection.CreateCommand();
    command.CommandText = "SELECT Id, Entreprise, Titre, Type, Description, EmailContact, DatePublication FROM OffresEmploi ORDER BY DatePublication DESC";

    using var reader = await command.ExecuteReaderAsync();
    while (await reader.ReadAsync())
    {
        offres.Add(new OffreEmploi
        {
            Id = reader.GetInt32("Id"),
            Entreprise = reader.GetString("Entreprise"),
            Titre = reader.GetString("Titre"),
            Type = reader.GetString("Type"),
            Description = reader.GetString("Description"),
            EmailContact = reader.GetString("EmailContact"),
            DatePublication = reader.GetDateTime("DatePublication")
        });
    }

    return Results.Ok(offres);
})
.WithName("GetOffres")
.WithTags("Offres")
.WithOpenApi();

// Endpoint pour générer un token JWT (pour les tests)
app.MapPost("/api/auth/token", async (TokenRequest request) =>
{
    // Validation simple (en production, vérifiez contre une base d'utilisateurs)
    if (request.Username == "cipfaro" && request.Password == "admin123")
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(jwtKey);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, request.Username),
                new Claim(ClaimTypes.Role, "Admin")
            }),
            Expires = DateTime.UtcNow.AddHours(24),
            Issuer = jwtIssuer,
            Audience = jwtAudience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);
        
        return Results.Ok(new { token = tokenString, expires = tokenDescriptor.Expires });
    }
    
    return Results.Unauthorized();
})
.WithName("GenerateToken")
.WithTags("Authentication")
.WithOpenApi();

// Endpoint de santé (health check)
app.MapGet("/api/health", () => new { 
    status = "healthy", 
    timestamp = DateTime.UtcNow,
    database = "SQLite Local",
    environment = "Development"
})
.WithName("HealthCheck")
.WithTags("Monitoring")
.WithOpenApi();

// Endpoint pour réinitialiser la base de données (développement seulement)
app.MapPost("/api/dev/reset-database", async () =>
{
    if (app.Environment.IsDevelopment())
    {
        await InitializeDatabase(connectionString, reset: true);
        return Results.Ok(new { message = "Base de données réinitialisée avec succès" });
    }
    return Results.BadRequest("Disponible uniquement en mode développement");
})
.WithName("ResetDatabase")
.WithTags("Development")
.WithOpenApi();

Console.WriteLine("🚀 API CIP FARO démarrée en mode développement local");
Console.WriteLine("📊 Swagger UI disponible à: http://localhost:5000");
Console.WriteLine("🔍 Santé de l'API: http://localhost:5000/api/health");
Console.WriteLine("🗄️ Base de données: SQLite locale (cipfaro_local.db)");

app.Run();

// Fonction pour initialiser la base de données SQLite
async Task InitializeDatabase(string connectionString, bool reset = false)
{
    using var connection = new SqliteConnection(connectionString);
    await connection.OpenAsync();

    if (reset)
    {
        // Supprimer les tables existantes
        var dropCandidatures = connection.CreateCommand();
        dropCandidatures.CommandText = "DROP TABLE IF EXISTS Candidatures";
        await dropCandidatures.ExecuteNonQueryAsync();

        var dropOffres = connection.CreateCommand();
        dropOffres.CommandText = "DROP TABLE IF EXISTS OffresEmploi";
        await dropOffres.ExecuteNonQueryAsync();
    }

    // Créer la table Candidatures
    var createCandidatures = connection.CreateCommand();
    createCandidatures.CommandText = @"
        CREATE TABLE IF NOT EXISTS Candidatures (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Nom TEXT NOT NULL,
            Prenom TEXT NOT NULL,
            Email TEXT NOT NULL,
            Domaine TEXT NOT NULL,
            Message TEXT NOT NULL,
            DateCreation DATETIME NOT NULL
        )";
    await createCandidatures.ExecuteNonQueryAsync();

    // Créer la table OffresEmploi
    var createOffres = connection.CreateCommand();
    createOffres.CommandText = @"
        CREATE TABLE IF NOT EXISTS OffresEmploi (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Entreprise TEXT NOT NULL,
            Titre TEXT NOT NULL,
            Type TEXT NOT NULL,
            Description TEXT NOT NULL,
            EmailContact TEXT NOT NULL,
            DatePublication DATETIME NOT NULL
        )";
    await createOffres.ExecuteNonQueryAsync();

    // Insérer quelques données de test
    if (reset)
    {
        var insertTestData = connection.CreateCommand();
        insertTestData.CommandText = @"
            INSERT INTO OffresEmploi (Entreprise, Titre, Type, Description, EmailContact, DatePublication) VALUES
            ('Tech Solutions', 'Développeur Full Stack', 'CDI', 'Recherche développeur expérimenté React/Node.js', 'rh@techsolutions.fr', datetime('now')),
            ('Digital Corp', 'Chef de Projet Web', 'CDD', 'Pilotage de projets digitaux innovants', 'jobs@digitalcorp.com', datetime('now')),
            ('StartupX', 'UX/UI Designer', 'Freelance', 'Création d''interfaces utilisateur modernes', 'contact@startupx.fr', datetime('now'))";
        await insertTestData.ExecuteNonQueryAsync();
    }
}

// Classes pour les requêtes
public class TokenRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}