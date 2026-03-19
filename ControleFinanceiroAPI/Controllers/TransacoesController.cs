namespace ControleFinanceiro.Controllers;

using Microsoft.AspNetCore.Mvc;
using ControleFinanceiro.Services.Transacao;
using ControleFinanceiro.DTOs.Transacao;
using ControleFinanceiro.DTOs.Categoria;

/// <summary>
/// Controller responsável pelo gerenciamento de transações financeiras.
/// Aplica regras de negócio como restrição de menores de idade (apenas despesas)
/// e compatibilidade entre o tipo da transação e a finalidade da categoria.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly ITransacaoService _transacaoService;

    public TransacoesController(ITransacaoService transacaoService)
    {
        _transacaoService = transacaoService;
    }

    /// <summary>
    /// Retorna o resumo financeiro de todas as categorias: total de receitas,
    /// despesas e saldo por categoria, além dos totais gerais consolidados.
    /// Rota declarada antes de GET {id} para evitar conflito de roteamento.
    /// </summary>
    [HttpGet("totais-por-categoria")]
    public async Task<ActionResult<TotaisCategoriasDto>> ObterTotaisPorCategoriaAsync()
    {
        var totais = await _transacaoService.ObterTotaisPorCategoriaAsync();
        return Ok(totais);
    }

    /// <summary>Retorna todas as transações cadastradas.</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransacaoDto>>> ListarAsync()
    {
        var transacoes = await _transacaoService.ListarAsync();
        return Ok(transacoes);
    }

    /// <summary>Retorna uma transação pelo seu identificador único.</summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<TransacaoDto>> ObterPorIdAsync(Guid id)
    {
        var transacao = await _transacaoService.ObterPorIdAsync(id);
        if (transacao == null)
            return NotFound(new { mensagem = "Transação não encontrada" });

        return Ok(transacao);
    }

    /// <summary>
    /// Cria uma nova transação. Retorna 400 se:
    /// - Os dados forem inválidos (validação do modelo);
    /// - A categoria não for compatível com o tipo da transação;
    /// - A pessoa for menor de 18 anos e o tipo for Receita.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TransacaoDto>> CriarAsync([FromBody] CreateTransacaoDto createTransacaoDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var transacao = await _transacaoService.CriarAsync(createTransacaoDto);
            return Created($"/api/Transacoes/{transacao.Id}", transacao);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }

    /// <summary>
    /// Atualiza uma transação existente. Aplica as mesmas regras de negócio da criação.
    /// Retorna 404 se a transação não for encontrada.
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<TransacaoDto>> AtualizarAsync(Guid id, [FromBody] UpdateTransacaoDto updateTransacaoDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var transacao = await _transacaoService.AtualizarAsync(id, updateTransacaoDto);
            if (transacao == null)
                return NotFound(new { mensagem = "Transação não encontrada" });

            return Ok(transacao);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }

    /// <summary>Remove uma transação pelo identificador. Retorna 404 se não encontrada.</summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeletarAsync(Guid id)
    {
        var resultado = await _transacaoService.DeletarAsync(id);
        if (!resultado)
            return NotFound(new { mensagem = "Transação não encontrada" });

        return NoContent();
    }
}
