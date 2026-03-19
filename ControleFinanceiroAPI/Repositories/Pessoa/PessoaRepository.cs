namespace ControleFinanceiro.Repositories.Pessoa;

using ControleFinanceiro.Data;
using ControleFinanceiro.Entities;
using Microsoft.EntityFrameworkCore;

public class PessoaRepository : IPessoaRepository
{
    private readonly AppDbContext _context;

    public PessoaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Pessoa>> ListarAsync()
    {
        return await _context.Pessoas.ToListAsync();
    }

    public async Task<Pessoa> ObterPorIdAsync(Guid id)
    {
        return await _context.Pessoas.FindAsync(id);
    }

    public async Task<Pessoa> ObterPorNomeAsync(string nome)
    {
        return await _context.Pessoas
            .FirstOrDefaultAsync(p => p.Nome.ToLower() == nome.ToLower());
    }

    public async Task<Pessoa> CriarAsync(Pessoa pessoa)
    {
        _context.Pessoas.Add(pessoa);
        await _context.SaveChangesAsync();
        return pessoa;
    }

    public async Task<Pessoa> AtualizarAsync(Pessoa pessoa)
    {
        _context.Pessoas.Update(pessoa);
        await _context.SaveChangesAsync();
        return pessoa;
    }

    public async Task<bool> DeletarAsync(Guid id)
    {
        var pessoa = await ObterPorIdAsync(id);
        if (pessoa == null)
            return false;

        _context.Pessoas.Remove(pessoa);
        await _context.SaveChangesAsync();
        return true;
    }
}
