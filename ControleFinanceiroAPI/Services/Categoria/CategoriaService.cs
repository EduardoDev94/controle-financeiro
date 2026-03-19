namespace ControleFinanceiro.Services.Categoria;

using ControleFinanceiro.DTOs.Categoria;
using ControleFinanceiro.Entities;
using ControleFinanceiro.Repositories.Categoria;

public class CategoriaService : ICategoriaService
{
    private readonly ICategoriaRepository _categoriaRepository;

    public CategoriaService(ICategoriaRepository categoriaRepository)
    {
        _categoriaRepository = categoriaRepository;
    }

    public async Task<IEnumerable<CategoriaDto>> ListarAsync()
    {
        var categorias = await _categoriaRepository.ListarAsync();
        return categorias.Select(c => new CategoriaDto
        {
            Id = c.Id,
            Descricao = c.Descricao,
            Finalidade = c.Finalidade
        });
    }

    public async Task<CategoriaDto> ObterPorIdAsync(Guid id)
    {
        var categoria = await _categoriaRepository.ObterPorIdAsync(id);
        if (categoria == null)
            return null;

        return new CategoriaDto
        {
            Id = categoria.Id,
            Descricao = categoria.Descricao,
            Finalidade = categoria.Finalidade
        };
    }

    public async Task<CategoriaDto> CriarAsync(CreateCategoriaDto createCategoriaDto)
    {
        var existente = await _categoriaRepository.ObterPorDescricaoAsync(createCategoriaDto.Descricao);
        if (existente != null)
            throw new ArgumentException("Já existe uma categoria cadastrada com esta descrição");

        var categoria = new Categoria(createCategoriaDto.Descricao, createCategoriaDto.Finalidade);
        var categoriaCriada = await _categoriaRepository.CriarAsync(categoria);

        return new CategoriaDto
        {
            Id = categoriaCriada.Id,
            Descricao = categoriaCriada.Descricao,
            Finalidade = categoriaCriada.Finalidade
        };
    }

    public async Task<CategoriaDto> AtualizarAsync(Guid id, UpdateCategoriaDto updateCategoriaDto)
    {
        var categoria = await _categoriaRepository.ObterPorIdAsync(id);
        if (categoria == null)
            return null;

        var existente = await _categoriaRepository.ObterPorDescricaoAsync(updateCategoriaDto.Descricao);
        if (existente != null && existente.Id != id)
            throw new ArgumentException("Já existe outra categoria cadastrada com esta descrição");

        categoria.Descricao = updateCategoriaDto.Descricao;
        categoria.Finalidade = updateCategoriaDto.Finalidade;

        var categoriaAtualizada = await _categoriaRepository.AtualizarAsync(categoria);

        return new CategoriaDto
        {
            Id = categoriaAtualizada.Id,
            Descricao = categoriaAtualizada.Descricao,
            Finalidade = categoriaAtualizada.Finalidade
        };
    }

    public async Task<bool> DeletarAsync(Guid id)
    {
        return await _categoriaRepository.DeletarAsync(id);
    }
}
