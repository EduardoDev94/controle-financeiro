namespace ControleFinanceiro.Entities;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public enum TipoTransacao
{
    Despesa = 0,
    Receita = 1
}

[Table("Transacoes")]
public class Transacao
{
    public Transacao() { }

    // Construtor para Criação
    public Transacao(string descricao, decimal valor, TipoTransacao tipo, Guid categoriaId, Guid pessoaId)
    {
        Id = Guid.NewGuid();
        Descricao = descricao;
        Valor = valor;
        Tipo = tipo;
        CategoriaId = categoriaId;
        PessoaId = pessoaId;
    }

    [Key]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "A descrição é obrigatória")]
    [StringLength(400, ErrorMessage = "A descrição deve ter no máximo 400 caracteres")]
    public string Descricao { get; set; }

    [Required(ErrorMessage = "O valor é obrigatório")]
    [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser um número positivo")]
    public decimal Valor { get; set; }

    [Required(ErrorMessage = "O tipo de transação é obrigatório")]
    public TipoTransacao Tipo { get; set; }

    [Required(ErrorMessage = "A categoria é obrigatória")]
    public Guid CategoriaId { get; set; }

    [ForeignKey("CategoriaId")]
    public Categoria Categoria { get; set; }

    [Required(ErrorMessage = "A pessoa é obrigatória")]
    public Guid PessoaId { get; set; }

    [ForeignKey("PessoaId")]
    public Pessoa Pessoa { get; set; }
}
