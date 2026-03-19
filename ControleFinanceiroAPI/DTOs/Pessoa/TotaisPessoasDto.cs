namespace ControleFinanceiro.DTOs.Pessoa;

public class TotaisPessoasDto
{
    public IEnumerable<PessoaTotalDto>? Pessoas { get; set; }
    public decimal TotalReceitasGeral { get; set; }
    public decimal TotalDespesasGeral { get; set; }
    public decimal SaldoGeral { get; set; }
}
