using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ControleFinanceiro.Entities;

public enum FinalidadeCategoria
{
    Despesa = 0,
    Receita = 1,
    Ambas = 2
}

[Table("Categorias")]
public class Categoria
{
    public Categoria() { }

    // Construtor para Criação (novo cadastro)
    public Categoria(string descricao, FinalidadeCategoria finalidade)
    {
        Id = Guid.NewGuid();
        Descricao = descricao;
        Finalidade = finalidade;
    }

    // Construtor para Alteração/Carregamento
    public Categoria(Guid id, string descricao, FinalidadeCategoria finalidade)
    {
        Id = id;
        Descricao = descricao;
        Finalidade = finalidade;
    }

    [Key]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "A descrição é obrigatória")]
    [StringLength(400, ErrorMessage = "A descrição deve ter no máximo 400 caracteres")]
    public string Descricao { get; set; }

    [Required(ErrorMessage = "A finalidade é obrigatória")]
    public FinalidadeCategoria Finalidade { get; set; }
}
