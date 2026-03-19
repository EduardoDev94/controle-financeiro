using System.ComponentModel.DataAnnotations;
using ControleFinanceiro.Entities;

namespace ControleFinanceiro.DTOs.Categoria;

/// <summary>
/// DTO utilizado na criação de uma nova categoria.
/// A finalidade determina quais tipos de transação podem usar esta categoria:
/// Despesa (0), Receita (1) ou Ambas (2).
/// </summary>
public class CreateCategoriaDto
{
    /// <summary>Descrição da categoria. Máximo de 400 caracteres.</summary>
    [Required(ErrorMessage = "A descrição é obrigatória")]
    [StringLength(400, ErrorMessage = "A descrição deve ter no máximo 400 caracteres")]
    public string Descricao { get; set; }

    /// <summary>Finalidade da categoria: Despesa, Receita ou Ambas.</summary>
    [Required(ErrorMessage = "A finalidade é obrigatória")]
    public FinalidadeCategoria Finalidade { get; set; }
}
