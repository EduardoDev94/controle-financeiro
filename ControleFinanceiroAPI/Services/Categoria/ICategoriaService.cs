namespace ControleFinanceiro.Services.Categoria;

using ControleFinanceiro.DTOs.Categoria;
using ControleFinanceiro.Entities;

public interface ICategoriaService
{
    Task<IEnumerable<CategoriaDto>> ListarAsync();
    Task<CategoriaDto> ObterPorIdAsync(Guid id);
    Task<CategoriaDto> CriarAsync(CreateCategoriaDto createCategoriaDto);
    Task<CategoriaDto> AtualizarAsync(Guid id, UpdateCategoriaDto updateCategoriaDto);
    Task<bool> DeletarAsync(Guid id);
}
