namespace ControleFinanceiro.DTOs.Categoria;

using ControleFinanceiro.Entities;

public class CategoriaDto
{
    public Guid Id { get; set; }
    public string Descricao { get; set; }
    public FinalidadeCategoria Finalidade { get; set; }
}
