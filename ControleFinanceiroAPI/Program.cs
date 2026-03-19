using ControleFinanceiro.Data;
using ControleFinanceiro.Repositories.Categoria;
using ControleFinanceiro.Repositories.Pessoa;
using ControleFinanceiro.Repositories.Transacao;
using ControleFinanceiro.Services.Categoria;
using ControleFinanceiro.Services.Pessoa;
using ControleFinanceiro.Services.Transacao;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Data Source=app.db";

const string CorsPolicy = "AllowLocalhost5173";

builder.Services.AddCors(options =>
    options.AddPolicy(CorsPolicy, policy =>
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()));

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddScoped<IPessoaRepository, PessoaRepository>();
builder.Services.AddScoped<ICategoriaRepository, CategoriaRepository>();
builder.Services.AddScoped<ITransacaoRepository, TransacaoRepository>();
builder.Services.AddScoped<IPessoaService, PessoaService>();
builder.Services.AddScoped<ICategoriaService, CategoriaService>();
builder.Services.AddScoped<ITransacaoService, TransacaoService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseCors(CorsPolicy);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();