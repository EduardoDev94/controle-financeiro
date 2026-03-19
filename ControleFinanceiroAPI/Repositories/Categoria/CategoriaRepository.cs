namespace ControleFinanceiro.Repositories.Categoria;

using ControleFinanceiro.Data;
using ControleFinanceiro.Entities;
using Microsoft.EntityFrameworkCore;

public class CategoriaRepository : ICategoriaRepository
{
    private readonly AppDbContext _context;

    public CategoriaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Categoria>> ListarAsync()
    {
        return await _context.Categorias.ToListAsync();
    }

    public async Task<Categoria> ObterPorIdAsync(Guid id)
    {
        return await _context.Categorias.FindAsync(id);
    }

    public async Task<Categoria> ObterPorDescricaoAsync(string descricao)
    {
        return await _context.Categorias
            .FirstOrDefaultAsync(c => c.Descricao.ToLower() == descricao.ToLower());
    }

    public async Task<Categoria> CriarAsync(Categoria categoria)
    {
        _context.Categorias.Add(categoria);
        await _context.SaveChangesAsync();
        return categoria;
    }

    public async Task<Categoria> AtualizarAsync(Categoria categoria)
    {
        _context.Categorias.Update(categoria);
        await _context.SaveChangesAsync();
        return categoria;
    }

    public async Task<bool> DeletarAsync(Guid id)
    {
        var categoria = await ObterPorIdAsync(id);
        if (categoria == null)
            return false;

        _context.Categorias.Remove(categoria);
        await _context.SaveChangesAsync();
        return true;
    }
}
