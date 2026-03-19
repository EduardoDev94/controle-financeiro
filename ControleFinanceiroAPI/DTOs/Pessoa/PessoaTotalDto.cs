namespace ControleFinanceiro.DTOs.Pessoa;

public class PessoaTotalDto
{
    public Guid Id { get; set; }
    public string Nome { get; set; }
    public int Idade { get; set; }
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }
    public decimal Saldo { get; set; }
}
