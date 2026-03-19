using ControleFinanceiro;
using ControleFinanceiro.Entities;
using Microsoft.EntityFrameworkCore;

namespace ControleFinanceiro.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Pessoa> Pessoas { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Transacao> Transacoes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuração da tabela Pessoa
            modelBuilder.Entity<Pessoa>(entity =>
            {
                entity.ToTable("Pessoas");
                entity.HasKey(p => p.Id);

                entity.Property(p => p.Nome)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(p => p.Idade)
                    .IsRequired();
            });

            // Configuração da tabela Categoria
            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.ToTable("Categorias");
                entity.HasKey(c => c.Id);

                entity.Property(c => c.Descricao)
                    .IsRequired()
                    .HasMaxLength(400);

                entity.Property(c => c.Finalidade)
                    .IsRequired();
            });

            // Configuração da tabela Transacao
            modelBuilder.Entity<Transacao>(entity =>
            {
                entity.ToTable("Transacoes");
                entity.HasKey(t => t.Id);

                entity.Property(t => t.Descricao)
                    .IsRequired()
                    .HasMaxLength(400);

                entity.Property(t => t.Valor)
                    .IsRequired()
                    .HasColumnType("decimal(18,2)");

                entity.Property(t => t.Tipo)
                    .IsRequired();

                entity.Property(t => t.CategoriaId)
                    .IsRequired();

                entity.Property(t => t.PessoaId)
                    .IsRequired();

                // Relacionamento com Categoria
                entity.HasOne(t => t.Categoria)
                    .WithMany()
                    .HasForeignKey(t => t.CategoriaId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Relacionamento com Pessoa
                entity.HasOne(t => t.Pessoa)
                    .WithMany()
                    .HasForeignKey(t => t.PessoaId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
