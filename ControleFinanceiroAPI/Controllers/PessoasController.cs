namespace ControleFinanceiro.Controllers;

using Microsoft.AspNetCore.Mvc;
using ControleFinanceiro.Services.Pessoa;
using ControleFinanceiro.DTOs.Pessoa;

/// <summary>
/// Controller responsável pelo gerenciamento de pessoas.
/// Expõe endpoints para criação, listagem, edição, exclusão e consulta de totais financeiros por pessoa.
/// Ao excluir uma pessoa, todas as suas transações são removidas automaticamente.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
    private readonly IPessoaService _pessoaService;

    public PessoasController(IPessoaService pessoaService)
    {
        _pessoaService = pessoaService;
    }

    /// <summary>Retorna todas as pessoas cadastradas.</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PessoaDto>>> ListarAsync()
    {
        var pessoas = await _pessoaService.ListarAsync();
        return Ok(pessoas);
    }

    /// <summary>
    /// Retorna o resumo financeiro de todas as pessoas: total de receitas,
    /// despesas e saldo individual, além dos totais gerais consolidados.
    /// </summary>
    [HttpGet("totais")]
    public async Task<ActionResult<TotaisPessoasDto>> ObterTotaisPorPessoaAsync()
    {
        var totais = await _pessoaService.ObterTotaisPorPessoaAsync();
        return Ok(totais);
    }

    /// <summary>Retorna uma pessoa pelo seu identificador único.</summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<PessoaDto>> ObterPorIdAsync(Guid id)
    {
        var pessoa = await _pessoaService.ObterPorIdAsync(id);
        if (pessoa == null)
            return NotFound(new { mensagem = "Pessoa não encontrada" });

        return Ok(pessoa);
    }

    /// <summary>Cria uma nova pessoa. Retorna 400 se os dados forem inválidos.</summary>
    [HttpPost]
    public async Task<ActionResult<PessoaDto>> CriarAsync([FromBody] CreatePessoaDto createPessoaDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var pessoa = await _pessoaService.CriarAsync(createPessoaDto);
            return Created($"/api/Pessoas/{pessoa.Id}", pessoa);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }

    /// <summary>Atualiza os dados de uma pessoa existente. Retorna 404 se não encontrada.</summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<PessoaDto>> AtualizarAsync(Guid id, [FromBody] UpdatePessoaDto updatePessoaDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var pessoa = await _pessoaService.AtualizarAsync(id, updatePessoaDto);
            if (pessoa == null)
                return NotFound(new { mensagem = "Pessoa não encontrada" });

            return Ok(pessoa);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }

    /// <summary>
    /// Remove uma pessoa pelo identificador. Todas as transações associadas
    /// são excluídas em cascata antes da remoção da pessoa.
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeletarAsync(Guid id)
    {
        var resultado = await _pessoaService.DeletarAsync(id);
        if (!resultado)
            return NotFound(new { mensagem = "Pessoa não encontrada" });

        return NoContent();
    }
}
