namespace ControleFinanceiro.Services.Pessoa;

using ControleFinanceiro.DTOs.Pessoa;
using ControleFinanceiro.Entities;
using ControleFinanceiro.Repositories.Pessoa;
using ControleFinanceiro.Repositories.Transacao;

public class PessoaService : IPessoaService
{
    private readonly IPessoaRepository _pessoaRepository;
    private readonly ITransacaoRepository _transacaoRepository;

    public PessoaService(IPessoaRepository pessoaRepository, ITransacaoRepository transacaoRepository)
    {
        _pessoaRepository = pessoaRepository;
        _transacaoRepository = transacaoRepository;
    }

    public async Task<IEnumerable<PessoaDto>> ListarAsync()
    {
        var pessoas = await _pessoaRepository.ListarAsync();
        return pessoas.Select(p => new PessoaDto
        {
            Id = p.Id,
            Nome = p.Nome,
            Idade = p.Idade
        });
    }

    public async Task<PessoaDto> ObterPorIdAsync(Guid id)
    {
        var pessoa = await _pessoaRepository.ObterPorIdAsync(id);
        if (pessoa == null) return null;


        return new PessoaDto
        {
            Id = pessoa.Id,
            Nome = pessoa.Nome,
            Idade = pessoa.Idade
        };
    }

    public async Task<PessoaDto> CriarAsync(CreatePessoaDto createPessoaDto)
    {

        var pessoa = new Pessoa(createPessoaDto.Nome, createPessoaDto.Idade);
        var pessoaCriada = await _pessoaRepository.CriarAsync(pessoa);

        return new PessoaDto
        {
            Id = pessoaCriada.Id,
            Nome = pessoaCriada.Nome,
            Idade = pessoaCriada.Idade
        };
    }

    public async Task<PessoaDto> AtualizarAsync(Guid id, UpdatePessoaDto updatePessoaDto)
    {
        var pessoa = await _pessoaRepository.ObterPorIdAsync(id);
        if (pessoa == null) return null;


        pessoa.Nome = updatePessoaDto.Nome;
        pessoa.Idade = updatePessoaDto.Idade;
        var pessoaAtualizada = await _pessoaRepository.AtualizarAsync(pessoa);

        return new PessoaDto
        {
            Id = pessoaAtualizada.Id,
            Nome = pessoaAtualizada.Nome,
            Idade = pessoaAtualizada.Idade
        };
    }

    public async Task<bool> DeletarAsync(Guid id)
    {
        var pessoa = await _pessoaRepository.ObterPorIdAsync(id);
        if (pessoa == null)
            return false;

        var transacoes = await _transacaoRepository.ListarPorPessoaIdAsync(id);
        foreach (var transacao in transacoes)
        {
            await _transacaoRepository.DeletarAsync(transacao.Id);
        }

        return await _pessoaRepository.DeletarAsync(id);
    }

    public async Task<TotaisPessoasDto> ObterTotaisPorPessoaAsync()
    {
        var pessoas = await _pessoaRepository.ListarAsync();
        var todasAsTransacoes = await _transacaoRepository.ListarAsync();

        var pessoasComTotais = new List<PessoaTotalDto>();
        decimal totalReceitasGeral = 0;
        decimal totalDespesasGeral = 0;

        foreach (var pessoa in pessoas)
        {
            var transacoesPessoa = todasAsTransacoes
                .Where(t => t.PessoaId == pessoa.Id)
                .ToList();

            var totalReceitas = transacoesPessoa
                .Where(t => t.Tipo == TipoTransacao.Receita)
                .Sum(t => t.Valor);

            var totalDespesas = transacoesPessoa
                .Where(t => t.Tipo == TipoTransacao.Despesa)
                .Sum(t => t.Valor);

            var saldo = totalReceitas - totalDespesas;

            pessoasComTotais.Add(new PessoaTotalDto
            {
                Id = pessoa.Id,
                Nome = pessoa.Nome,
                Idade = pessoa.Idade,
                TotalReceitas = totalReceitas,
                TotalDespesas = totalDespesas,
                Saldo = saldo
            });

            totalReceitasGeral += totalReceitas;
            totalDespesasGeral += totalDespesas;
        }

        var saldoGeral = totalReceitasGeral - totalDespesasGeral;

        return new TotaisPessoasDto
        {
            Pessoas = pessoasComTotais,
            TotalReceitasGeral = totalReceitasGeral,
            TotalDespesasGeral = totalDespesasGeral,
            SaldoGeral = saldoGeral
        };
    }
}
