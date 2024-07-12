import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { PessoaService } from 'src/app/pessoas/pessoa.service';
import { LancamentoService } from '../lancamento.service';
import { CategoriaService } from './../../categorias/categoria.service';
import {Estoque,Movimentacao } from './../../core/model';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  estoque: Estoque[] = [];
  itens:any[] = [];
  movimentacao:Movimentacao = new Movimentacao();
  estoqueS:Estoque = new Estoque()
  centrocusto: any[] = [];
  classificacao: any[] = [];
  pessoas: any[] = []
  valoresUnitarios:any = []
  value:any = 'ENTRADA'
  unidades = ['Unidade','Litro','Caixa', 'Kilo', 'Metro', 'Balde'];
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
      
   
      this.lancamentoService.getAllitens(this.filtro).then(dados => {
        this.itens = dados
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
    atualizar(){
 this.lancamentoService.getUnitarios(this.movimentacao.item).then(dados => {
         this.valoresUnitarios = dados
      }) 
    }
  salvaLancamento(form:NgForm){

    this.movimentacao.tipo = this.value


    if(this.view){
   this.lancamentoService.putEdicao(this.movimentacao).then(dados => {
    this.messageService.add({ severity: 'success', detail: 'Estoque alterado com sucesso!' })
   }).then( () => {this.lancamentoService.put(this.movimentacao).then(dados => {
        this.messageService.add({ severity: 'success', detail: 'Movimentação alterada com sucesso!' })
      }
      ).catch(erro => {
        this.messageService.add({ severity: 'error', detail: 'Erro! Status: '+erro.statusText });
      
      })}).catch(erro => {
        this.messageService.add({ severity: 'error', detail: 'Erro! Status: '+erro.statusText });
      
      }) 
    }else{
    
     if(this.value == "ENTRADA" || this.value == 'SAIDA'){
        this.lancamentoService.post(this.movimentacao).then(dados => {
     this.messageService.add({ severity: 'success', detail: 'Movimentação salva com sucesso!' });
     form.reset()
    }) .catch(erro => {
      this.messageService.add({ severity: 'error', detail: 'Erro! Status: '+erro.statusText });
    
    }); 

    
     
  this.lancamentoService.putEstoque(this.movimentacao).then(dados => {
    this.messageService.add({ severity: 'success', detail: 'Estoque alterado com sucesso!' });
  }).catch(error => {
    this.messageService.add({ severity: 'error', detail: 'Erro! Status: '+error.statusText });
  }) 
   /*    if(this.value == "ENTRADA" ){
    this.lancamentoService.postSaldo(this.movimentacao).then(dados => {
      console.log(dados)
      this.messageService.add({ severity: 'success', detail: 'Saldo salvo com sucesso!' });
    }).catch(error => {
      this.messageService.add({ severity: 'error', detail: 'Erro! Status: '+error.statusText });
    })}else{
      this.lancamentoService.putSaldo(this.movimentacao).then(dados => {
        this.messageService.add({ severity: 'success', detail: 'Saldo alterado com sucesso!' });
        console.log(dados)}
      ).catch(error => {
        this.messageService.add({ severity: 'error', detail: 'Erro! Status: '+error.statusText });
      }) 
    } */
    
  }
    else{
      this.messageService.add({ severity: 'warn', detail: 'Selecione o tipo do lançamento' });
    }} 
  }

  carregarLancamento(codigo: number) {

    this.lancamentoService.buscarPorCodigo(codigo)
      .then(movimentacao => {
        this.movimentacao = movimentacao
      movimentacao.data?  this.movimentacao.data = new Date(movimentacao.data).toLocaleDateString('pt-BR'): null
        this.value = movimentacao.tipo 
        this.movimentacao.valorUnitario = this.movimentacao.valorUnitario!.replace('.',',')
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