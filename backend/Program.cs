using System.IO;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using hotel_booking_website.Data;
using hotel_booking_website.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Database Configuration (SQL Server Express)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Server=DESKTOP-54GML51\\SQLEXPRESS;Initial Catalog=hotel booking website;Integrated Security=True;Trust Server Certificate=True;MultipleActiveResultSets=True;";

builder.Services.AddDbContext<HotelDbContext>(options =>
{
    options.UseSqlServer(connectionString);
});

// 2. Dependency Injection Services
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<ITokenService, TokenService>();

// 3. JWT Authentication & Security
var jwtKey = builder.Configuration["Jwt:Key"] ?? "LuxeHaven_Ultra_Secure_Secret_Key_2026_For_Jwt_Authentication_MustBeLongEnough!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "LuxeHavenApi";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "LuxeHavenClient";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// 4. CORS Configuration for Frontend (Vite & React)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// 5. Controllers & JSON Options
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// 6. Swagger / OpenAPI Configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 7. Configure Middleware Pipeline
app.UseCors("AllowAll");

// Enable Official Swagger and SwaggerUI
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "LuxeHaven API v1");
    c.RoutePrefix = "swagger";
    c.DocumentTitle = "LuxeHaven Hotel API - Swagger UI";
});

// Automatic Redirect from Root "/" to "/swagger"
app.MapGet("/", () => Results.Redirect("/swagger"));

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Health check endpoint
app.MapGet("/api/health", () => Results.Ok(new
{
    status = "Healthy",
    service = "LuxeHaven Luxury Hotel Booking API",
    version = "1.0.0",
    database = "Microsoft SQL Server Express",
    timestamp = DateTime.UtcNow
}));

// 8. Automatic Database Initialization & Seeding on Startup
try
{
    using (var scope = app.Services.CreateScope())
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("Initializing LuxeHaven Database...");
        await DbInitializer.InitializeAsync(app.Services);
        logger.LogInformation("LuxeHaven Database Ready.");
    }
}
catch (Exception ex)
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "Failed to initialize SQL Server database. Check connection string or SQL Server service status.");
}

app.Run();
