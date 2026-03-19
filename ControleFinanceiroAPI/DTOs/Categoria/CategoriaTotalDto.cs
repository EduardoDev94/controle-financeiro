namespace ControleFinanceiro.DTOs.Categoria;

/// <summary>
/// DTO de leitura com os totais financeiros de uma categoria específica.
/// Retornado como parte da consulta de totais por categoria.
/// </summary>
public class CategoriaTotalDto
{
    /// <summary>Identificador único da categoria.</summary>
    public Guid Id { get; set; }

    /// <summary>Descrição da categoria.</summary>
    public string Descricao { get; set; }

    /// <summary>Soma de todas as transações do tipo Receita nesta categoria.</summary>
    public decimal TotalReceitas { get; set; }

    /// <summary>Soma de todas as transações do tipo Despesa nesta categoria.</summary>
    public decimal TotalDespesas { get; set; }

    /// <summary>Saldo líquido da categoria: TotalReceitas - TotalDespesas.</summary>
    public decimal Saldo { get; set; }
}
