namespace ControleFinanceiro.DTOs.Transacao;

using ControleFinanceiro.Entities;

public class TransacaoDto
{
    public Guid Id { get; set; }
    public string Descricao { get; set; }
    public decimal Valor { get; set; }
    public TipoTransacao Tipo { get; set; }
    public Guid CategoriaId { get; set; }
    public string CategoriaNome { get; set; }
    public Guid PessoaId { get; set; }
    public string PessoaNome { get; set; }
}
