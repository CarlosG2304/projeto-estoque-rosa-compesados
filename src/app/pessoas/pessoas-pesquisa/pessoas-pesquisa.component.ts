import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';

import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { PessoaFiltro, PessoaService } from '../pessoa.service';
import { Estoque } from 'src/app/core/model';
import { LancamentoService } from 'src/app/lancamentos/lancamento.service';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit {
  totalRegistros = 0;
  pagina = 0
  filtro = {
    "Descricao":''
  }
  itens:Estoque[] = [];
  @ViewChild('tabela') grid!: any;

  constructor(
    private lancamento: LancamentoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private confirmationService: ConfirmationService,
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa no estoque');
    this.lancamento.getEstoque(this.filtro)
      .then((dados: any) => {
        this.itens = dados;
        this.totalRegistros = dados.total;
      });
  }

  pesquisar(): void {
    this.pagina = 0 

    this.lancamento.getEstoque(this.filtro)
    .then((dados: any) => {
      this.itens = dados;

      this.totalRegistros = dados.length;

    
    });
    
  }
  relatorio(){
    window.open("http://localhost:3001/estoque/relatorio")
  } 
  
  aoMudarPagina(event: LazyLoadEvent) {
    this.pagina = event.first!;

  }

/*  

  confirmarExclusao(pessoa: any): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(pessoa);
      }
    });
  }

  excluir(pessoa: any) {

    this.pessoaService.excluir(pessoa.codigo)
      .then(
        () => {
          this.grid.reset();

          this.messageService.add({ severity: 'success', detail: 'Pessoa excluída com sucesso!' })
        }
      )
      .catch((error) => this.errorHandler.handle(error))

  }

  alternarStatus(pessoa: any): void {
    const novoStatus = !pessoa.ativo;

    this.pessoaService.mudarStatus(pessoa.codigo, novoStatus)
      .then(() => {
        const acao = novoStatus ? 'ativada' : 'desativada';

        pessoa.ativo = novoStatus;
        this.messageService.add({ severity: 'success', detail: `Pessoa ${acao} com sucesso!` });
      })
      .catch(erro => this.errorHandler.handle(erro));
  } */
}
