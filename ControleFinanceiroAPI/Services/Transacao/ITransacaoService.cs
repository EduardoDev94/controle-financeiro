namespace ControleFinanceiro.Services.Transacao;

using ControleFinanceiro.DTOs.Transacao;
using ControleFinanceiro.DTOs.Categoria;
using ControleFinanceiro.Entities;

/// <summary>
/// Define o contrato de negócio para operações com transações financeiras.
/// Implementações devem garantir as regras: compatibilidade entre tipo e finalidade
/// da categoria, e restrição de receitas para menores de 18 anos.
/// </summary>
public interface ITransacaoService
{
    /// <summary>Retorna todas as transações cadastradas.</summary>
    Task<IEnumerable<TransacaoDto>> ListarAsync();

    /// <summary>Retorna uma transação pelo identificador, ou null se não encontrada.</summary>
    Task<TransacaoDto> ObterPorIdAsync(Guid id);

    /// <summary>
    /// Cria uma nova transação aplicando as regras de negócio.
    /// Lança <see cref="ArgumentException"/> se as regras forem violadas.
    /// </summary>
    Task<TransacaoDto> CriarAsync(CreateTransacaoDto createTransacaoDto);

    /// <summary>
    /// Atualiza uma transação existente aplicando as regras de negócio.
    /// Retorna null se a transação não for encontrada.
    /// Lança <see cref="ArgumentException"/> se as regras forem violadas.
    /// </summary>
    Task<TransacaoDto> AtualizarAsync(Guid id, UpdateTransacaoDto updateTransacaoDto);

    /// <summary>Remove uma transação. Retorna false se não encontrada.</summary>
    Task<bool> DeletarAsync(Guid id);

    /// <summary>
    /// Calcula e retorna o total de receitas, despesas e saldo de cada categoria,
    /// mais os totais gerais consolidados de todas as categorias.
    /// </summary>
    Task<TotaisCategoriasDto> ObterTotaisPorCategoriaAsync();
}
