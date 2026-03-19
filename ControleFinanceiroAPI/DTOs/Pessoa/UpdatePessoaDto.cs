using System.ComponentModel.DataAnnotations;

namespace ControleFinanceiro.DTOs.Pessoa;

/// <summary>
/// DTO utilizado na atualização de uma pessoa existente.
/// Contém as mesmas validações do DTO de criação.
/// </summary>
public class UpdatePessoaDto
{
    /// <summary>Nome completo da pessoa. Máximo de 200 caracteres.</summary>
    [Required(ErrorMessage = "O nome é obrigatório")]
    [StringLength(200, ErrorMessage = "O nome deve ter no máximo 200 caracteres")]
    public string Nome { get; set; }

    /// <summary>Idade da pessoa. Deve ser um valor entre 0 e 150.</summary>
    [Required(ErrorMessage = "A idade é obrigatória")]
    [Range(0, 150, ErrorMessage = "A idade deve estar entre 0 e 150 anos")]
    public int Idade { get; set; }
}
