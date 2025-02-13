using System;
using Microsoft.EntityFrameworkCore;
using ExtraHours.API.Data;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});


var app = builder.Build();





app.Run();


