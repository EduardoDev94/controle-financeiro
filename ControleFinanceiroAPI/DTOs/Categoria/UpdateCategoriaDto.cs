using System.ComponentModel.DataAnnotations;
using ControleFinanceiro.Entities;

namespace ControleFinanceiro.DTOs.Categoria;

/// <summary>
/// DTO utilizado na atualização de uma categoria existente.
/// Contém as mesmas validações do DTO de criação.
/// </summary>
public class UpdateCategoriaDto
{
    /// <summary>Descrição da categoria. Máximo de 400 caracteres.</summary>
    [Required(ErrorMessage = "A descrição é obrigatória")]
    [StringLength(400, ErrorMessage = "A descrição deve ter no máximo 400 caracteres")]
    public string Descricao { get; set; }

    /// <summary>Finalidade da categoria: Despesa, Receita ou Ambas.</summary>
    [Required(ErrorMessage = "A finalidade é obrigatória")]
    public FinalidadeCategoria Finalidade { get; set; }
}
