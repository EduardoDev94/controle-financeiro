using System.ComponentModel.DataAnnotations;
using ControleFinanceiro.Entities;

namespace ControleFinanceiro.DTOs.Transacao;

/// <summary>
/// DTO utilizado na atualização de uma transação existente.
/// Contém as mesmas validações do DTO de criação.
/// </summary>
public class UpdateTransacaoDto
{
    /// <summary>Descrição da transação. Máximo de 400 caracteres.</summary>
    [Required(ErrorMessage = "A descrição é obrigatória")]
    [StringLength(400, ErrorMessage = "A descrição deve ter no máximo 400 caracteres")]
    public string Descricao { get; set; }

    /// <summary>Valor monetário da transação. Deve ser maior que zero.</summary>
    [Required(ErrorMessage = "O valor é obrigatório")]
    [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero")]
    public decimal Valor { get; set; }

    /// <summary>Tipo da transação: Despesa (0) ou Receita (1).</summary>
    [Required(ErrorMessage = "O tipo é obrigatório")]
    public TipoTransacao Tipo { get; set; }

    /// <summary>Identificador da categoria associada. Deve existir no cadastro.</summary>
    [Required(ErrorMessage = "A categoria é obrigatória")]
    public Guid CategoriaId { get; set; }

    /// <summary>Identificador da pessoa associada. Deve existir no cadastro.</summary>
    [Required(ErrorMessage = "A pessoa é obrigatória")]
    public Guid PessoaId { get; set; }
}
