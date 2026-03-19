namespace ControleFinanceiro.Services.Pessoa;

using ControleFinanceiro.DTOs.Pessoa;
using ControleFinanceiro.Entities;

public interface IPessoaService
{
    Task<IEnumerable<PessoaDto>> ListarAsync();
    Task<PessoaDto> ObterPorIdAsync(Guid id);
    Task<PessoaDto> CriarAsync(CreatePessoaDto createPessoaDto);
    Task<PessoaDto> AtualizarAsync(Guid id, UpdatePessoaDto updatePessoaDto);
    Task<bool> DeletarAsync(Guid id);
    Task<TotaisPessoasDto> ObterTotaisPorPessoaAsync();
}
