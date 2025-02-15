using Microsoft.EntityFrameworkCore;
using ExtraHours.API.Data;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ExtraHours.API.Utils;
using ExtraHours.API.Repositories.Implementations;
using ExtraHours.API.Repositories.Interfaces;
using ExtraHours.API.Service.Implementations;
using ExtraHours.API.Service.Interface;

var builder = WebApplication.CreateBuilder(args);


// Configurar DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Registrar repositorios
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IManagerRepository, ManagerRepository>();

// Registrar servicios
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddSingleton<IJWTUtils, JWTUtils>();

// Agregar controladores
builder.Services.AddControllers();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"]))
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("ManagerOnly", policy => policy.RequireRole("manager"));
    options.AddPolicy("EmpleadoOnly", policy => policy.RequireRole("empleado"));
    options.AddPolicy("SuperusuarioOnly", policy => policy.RequireRole("superusuario"));
});





// Agregar CORS para permitir solicitudes del frontend
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(MyAllowSpecificOrigins, policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173", // URL del frontend
            "https://localhost:7086" // URL del backend
            ) 
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configurar Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "ExtraHours API",
        Version = "v1",
        Description = "API para gestionar horas extra y usuarios.",
        Contact = new OpenApiContact
        {
            Name = "Jaime Gallo",
            Email = "jagallob@eafit.edu.co",
            
        }
    });
});

var app = builder.Build();


// Configurar middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); // Habilitar Swagger
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "ExtraHours API v1");
        options.RoutePrefix = "swagger"; // Ruta base para la interfaz de Swagger
    });
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseCors(MyAllowSpecificOrigins);
app.UseAuthorization();
app.MapControllers(); // Mapear los controladores

app.Run();