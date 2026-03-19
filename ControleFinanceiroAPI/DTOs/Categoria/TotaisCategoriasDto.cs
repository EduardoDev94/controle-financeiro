namespace ControleFinanceiro.DTOs.Categoria;

/// <summary>
/// DTO de leitura com o resumo financeiro de todas as categorias.
/// Contém a lista de totais por categoria e os totais gerais consolidados.
/// </summary>
public class TotaisCategoriasDto
{
    /// <summary>Lista com os totais de receita, despesa e saldo de cada categoria.</summary>
    public IEnumerable<CategoriaTotalDto> Categorias { get; set; }

    /// <summary>Soma das receitas de todas as categorias.</summary>
    public decimal TotalReceitasGeral { get; set; }

    /// <summary>Soma das despesas de todas as categorias.</summary>
    public decimal TotalDespesasGeral { get; set; }

    /// <summary>Saldo geral: TotalReceitasGeral - TotalDespesasGeral.</summary>
    public decimal SaldoGeral { get; set; }
}
