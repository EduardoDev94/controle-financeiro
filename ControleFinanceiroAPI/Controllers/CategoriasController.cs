namespace ControleFinanceiro.Controllers;

using Microsoft.AspNetCore.Mvc;
using ControleFinanceiro.Services.Categoria;
using ControleFinanceiro.DTOs.Categoria;

/// <summary>
/// Controller responsável pelo gerenciamento de categorias.
/// Categorias possuem uma finalidade (Despesa, Receita ou Ambas) que restringe
/// quais tipos de transação podem utilizá-las.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class CategoriasController : ControllerBase
{
    private readonly ICategoriaService _categoriaService;

    public CategoriasController(ICategoriaService categoriaService)
    {
        _categoriaService = categoriaService;
    }

    /// <summary>Retorna todas as categorias cadastradas.</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoriaDto>>> ListarAsync()
    {
        var categorias = await _categoriaService.ListarAsync();
        return Ok(categorias);
    }

    /// <summary>Retorna uma categoria pelo seu identificador único.</summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<CategoriaDto>> ObterPorIdAsync(Guid id)
    {
        var categoria = await _categoriaService.ObterPorIdAsync(id);
        if (categoria == null)
            return NotFound(new { mensagem = "Categoria não encontrada" });

        return Ok(categoria);
    }

    /// <summary>
    /// Cria uma nova categoria. Retorna 400 se os dados forem inválidos
    /// ou se já existir uma categoria com a mesma descrição.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<CategoriaDto>> CriarAsync([FromBody] CreateCategoriaDto createCategoriaDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var categoria = await _categoriaService.CriarAsync(createCategoriaDto);
            return Created($"/api/Categorias/{categoria.Id}", categoria);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }

    /// <summary>Atualiza os dados de uma categoria existente. Retorna 404 se não encontrada.</summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<CategoriaDto>> AtualizarAsync(Guid id, [FromBody] UpdateCategoriaDto updateCategoriaDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var categoria = await _categoriaService.AtualizarAsync(id, updateCategoriaDto);
            if (categoria == null)
                return NotFound(new { mensagem = "Categoria não encontrada" });

            return Ok(categoria);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }

    /// <summary>Remove uma categoria pelo identificador. Retorna 404 se não encontrada.</summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeletarAsync(Guid id)
    {
        var resultado = await _categoriaService.DeletarAsync(id);
        if (!resultado)
            return NotFound(new { mensagem = "Categoria não encontrada" });

        return NoContent();
    }
}
