namespace ControleFinanceiro.Repositories.Transacao;

using ControleFinanceiro.Data;
using ControleFinanceiro.Entities;
using Microsoft.EntityFrameworkCore;

public class TransacaoRepository : ITransacaoRepository
{
    private readonly AppDbContext _context;

    public TransacaoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Transacao>> ListarAsync()
    {
        return await _context.Transacoes
            .Include(t => t.Categoria)
            .Include(t => t.Pessoa)
            .ToListAsync();
    }

    public async Task<Transacao> ObterPorIdAsync(Guid id)
    {
        return await _context.Transacoes
            .Include(t => t.Categoria)
            .Include(t => t.Pessoa)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<Transacao> CriarAsync(Transacao transacao)
    {
        _context.Transacoes.Add(transacao);
        await _context.SaveChangesAsync();
        return transacao;
    }

    public async Task<Transacao> AtualizarAsync(Transacao transacao)
    {
        _context.Transacoes.Update(transacao);
        await _context.SaveChangesAsync();
        return transacao;
    }

    public async Task<bool> DeletarAsync(Guid id)
    {
        var transacao = await ObterPorIdAsync(id);
        if (transacao == null)
            return false;

        _context.Transacoes.Remove(transacao);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Transacao>> ListarPorPessoaIdAsync(Guid pessoaId)
    {
        return await _context.Transacoes
            .Where(t => t.PessoaId == pessoaId)
            .Include(t => t.Categoria)
            .Include(t => t.Pessoa)
            .ToListAsync();
    }
}
