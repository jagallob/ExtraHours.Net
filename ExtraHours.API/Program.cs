using System;
using Microsoft.EntityFrameworkCore;
using ExtraHours.API.Data;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// Validar la cadena de conexión
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("La cadena de conexión 'DefaultConnection' no está configurada.");
}

// Registrar el DbContext con PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});


builder.Services.AddControllers(); 
builder.Services.AddEndpointsApiExplorer();


var app = builder.Build();


app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();


app.Run();


