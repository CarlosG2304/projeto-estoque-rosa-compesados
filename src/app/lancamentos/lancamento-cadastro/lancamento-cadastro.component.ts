import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { PessoaService } from 'src/app/pessoas/pessoa.service';
import { LancamentoService } from '../lancamento.service';
import { CategoriaService } from './../../categorias/categoria.service';
import {Estoque, Item, Movimentacao, Unidade, centrocusto } from './../../core/model';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  estoque: Estoque[] = [];
  itens:Item[] = [];
  movimentacao:Movimentacao = new Movimentacao();
  item: Item = new Item();
  estoqueS:Estoque = new Estoque()
  centrocusto: centrocusto[] = [];
  centrocustoS: centrocusto = {Id:undefined };
  classificacao: any[] = [];
  classificacaoS: any = {Id:undefined };
  pessoas: any[] = []
  value:any = 'ENTRADA'
  unidades:Unidade[] = [];
  unidadeS:Unidade = {};
  view = false;

  tipos = [
    { label: 'Entrada', value: 'ENTRADA' },
    { label: 'Saida', value: 'SAIDA' },
  ];
  filtro:any = {
    "Descricao":''
  };
  constructor(
    private categoriaService: CategoriaService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit(): void {
    const codigoLancamento = this.route.snapshot.params['codigo'];
 

    this.title.setTitle('Novo lançamento')
    this.unidades =   [
      { label: 'Unidade' },
      { label: 'Litro' },
      { label: 'Caixa' },
      { label: 'Kilo'},
      { label: 'Metro'}]
      
   
      this.lancamentoService.getAllitens(this.filtro).then(dados => {
        this.itens = dados
     })

    this.lancamentoService.getEstoque(this.filtro).then(dados => {
       this.estoque = dados
    })

    this.categoriaService.getcetrocusto(this.filtro).then(dados => {
      this.centrocusto = dados
   })
    
   this.categoriaService.getclassificacao(this.filtro).then(dados => {
         this.classificacao = dados 
   })
    if (codigoLancamento && codigoLancamento !== 'novo') {
       this.carregarLancamento(codigoLancamento) 
       this.view = true
  
    }}
  salvaLancamento(form:NgForm){
    this.movimentacao.item = this.item
     this.movimentacao.tipo = this.value
     this.movimentacao.centrocusto = this.centrocustoS
     this.movimentacao.classificacao = this.classificacaoS
     this.movimentacao.unidade = this.unidadeS.label
     if(this.value == "ENTRADA" || this.value == 'SAIDA'){

          this.lancamentoService.post(this.movimentacao).then(dados => {
     this.item = dados
     this.messageService.add({ severity: 'success', detail: 'Movimentação salva com sucesso!' });
    }) .catch(erro => {
      this.messageService.add({ severity: 'error', detail: 'Erro! Status: '+erro.statusText });
    
    }); 
    
      form.reset()
    if(this.value === 'ENTRADA' && this.movimentacao.Quantidade !== undefined && this.estoqueS.quantidade !== undefined ){
       this.estoqueS.quantidade = this.estoqueS.quantidade + this.movimentacao.Quantidade
       this.movimentacao.centrocusto = {}
       this.movimentacao.classificacao = {}

       this.lancamentoService.editarItem(this.estoqueS.Id, this.estoqueS).then(dados => console.log(dados))   
    }else if(this.value === 'SAIDA'  && this.movimentacao.Quantidade !== undefined && this.estoqueS.quantidade !== undefined){
      this.estoqueS.quantidade = this.estoqueS.quantidade - this.movimentacao.Quantidade
      this.lancamentoService.editarItem(this.item.Id, this.estoqueS).then(dados => console.log(dados))  
    } }
    else{
      this.messageService.add({ severity: 'warn', detail: 'Selecione o tipo do lançamento' });
    }
  }

  carregarLancamento(codigo: number) {

    this.lancamentoService.buscarPorCodigo(codigo)
      .then(movimentacao => {
        this.movimentacao = movimentacao
      movimentacao.data?  this.movimentacao.data = new Date(movimentacao.data).toLocaleDateString('pt-BR'): null
       this.item = this.movimentacao.item 
       this.centrocustoS = movimentacao.centrocusto
       this.classificacaoS = movimentacao.classificacao
        this.value = movimentacao.tipo 
        this.unidadeS =  { label: movimentacao.unidade }
      },
        erro => this.errorHandler.handle(erro));
  }
/* 
    this.carregarCategorias()
    this.carregarPessoas()
  }

 



  carregarCategorias() {
    return this.categoriaService.listarTodas()
      .then(categorias => {
        this.categorias = categorias
          .map((c: any) => ({ label: c.nome, value: c.codigo }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarPessoas() {
    this.pessoaService.listarTodas()
      .then(pessoas => {
        this.pessoas = pessoas
          .map((p: any) => ({ label: p.nome, value: p.codigo }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: NgForm) {
    if (this.editando) {
      this.atualizarLancamento(form)
    } else {
      this.adicionarLancamento(form)
    }
  }

  atualizarLancamento(form: NgForm) {
    this.lancamentoService.atualizar(this.lancamento)
      .then((lancamento: Lancamento) => {
        this.lancamento = lancamento;
        this.messageService.add({ severity: 'success', detail: 'Lançamento alterado com sucesso!' });
        this.atualizarTituloEdicao()
      }
      ).catch(erro => this.errorHandler.handle(erro))
  }

  adicionarLancamento(form: NgForm) {
    this.lancamentoService.adicionar(this.lancamento)
      .then(lancamentoAdicionado => {
        this.messageService.add({ severity: 'success', detail: 'Lançamento adicionado com sucesso!' });

        this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo])
      }
      ).catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: NgForm) {
    form.reset();

    setTimeout(() => {
      this.lancamento = new Lancamento();
    }, 1);

    this.router.navigate(['lancamentos/novo']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de lançamento: ${this.lancamento.descricao}`)
  }*/ 
}