
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Hosting;
using System.Collections.Generic;
using System.Data;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Connection string to Azure SQL Database
string connectionString = "Server=tcp:<your-server-name>.database.windows.net,1433;Initial Catalog=<your-database-name>;Persist Security Info=False;User ID=<your-username>;Password=<your-password>;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";

// Model class
public class Candidature
{
    public string Nom { get; set; }
    public string Prenom { get; set; }
    public string Email { get; set; }
    public string Domaine { get; set; }
    public string Message { get; set; }
}

// POST endpoint to receive a candidature
app.MapPost("/candidature", async (HttpContext context) =>
{
    var candidature = await JsonSerializer.DeserializeAsync<Candidature>(context.Request.Body);

    using var conn = new SqlConnection(connectionString);
    await conn.OpenAsync();

    var cmd = new SqlCommand("INSERT INTO Candidatures (Nom, Prenom, Email, Domaine, Message) VALUES (@Nom, @Prenom, @Email, @Domaine, @Message)", conn);
    cmd.Parameters.AddWithValue("@Nom", candidature.Nom);
    cmd.Parameters.AddWithValue("@Prenom", candidature.Prenom);
    cmd.Parameters.AddWithValue("@Email", candidature.Email);
    cmd.Parameters.AddWithValue("@Domaine", candidature.Domaine);
    cmd.Parameters.AddWithValue("@Message", candidature.Message);

    await cmd.ExecuteNonQueryAsync();

    context.Response.StatusCode = 200;
    await context.Response.WriteAsync("Candidature enregistrée avec succès.");
});

// GET endpoint to retrieve all candidatures
app.MapGet("/candidature", async (HttpContext context) =>
{
    var candidatures = new List<Candidature>();

    using var conn = new SqlConnection(connectionString);
    await conn.OpenAsync();

    var cmd = new SqlCommand("SELECT Nom, Prenom, Email, Domaine, Message FROM Candidatures", conn);
    using var reader = await cmd.ExecuteReaderAsync();

    while (await reader.ReadAsync())
    {
        candidatures.Add(new Candidature
        {
            Nom = reader.GetString(0),
            Prenom = reader.GetString(1),
            Email = reader.GetString(2),
            Domaine = reader.GetString(3),
            Message = reader.GetString(4)
        });
    }

    context.Response.ContentType = "application/json";
    await context.Response.WriteAsync(JsonSerializer.Serialize(candidatures));
});

app.Run();
