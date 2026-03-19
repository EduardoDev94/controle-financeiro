namespace ControleFinanceiro.Repositories.Categoria;

using ControleFinanceiro.Entities;

public interface ICategoriaRepository
{
    Task<IEnumerable<Categoria>> ListarAsync();
    Task<Categoria> ObterPorIdAsync(Guid id);
    Task<Categoria> ObterPorDescricaoAsync(string descricao);
    Task<Categoria> CriarAsync(Categoria categoria);
    Task<Categoria> AtualizarAsync(Categoria categoria);
    Task<bool> DeletarAsync(Guid id);
}
