namespace ControleFinanceiro.Repositories.Transacao;

using ControleFinanceiro.Entities;

public interface ITransacaoRepository
{
    Task<IEnumerable<Transacao>> ListarAsync();
    Task<Transacao> ObterPorIdAsync(Guid id);
    Task<Transacao> CriarAsync(Transacao transacao);
    Task<Transacao> AtualizarAsync(Transacao transacao);
    Task<bool> DeletarAsync(Guid id);
    Task<IEnumerable<Transacao>> ListarPorPessoaIdAsync(Guid pessoaId);
}
