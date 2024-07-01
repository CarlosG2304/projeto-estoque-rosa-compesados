import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeBr from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
registerLocaleData(localeBr, 'pt')

import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { LancamentoFiltro, LancamentoService } from './../lancamento.service';
import { Movimentacao } from 'src/app/core/model';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css']
})
export class LancamentosPesquisaComponent implements OnInit {

  filtro = new LancamentoFiltro();


  totalRegistros: number = 0

  movimentacao: Movimentacao[] = [];
  @ViewChild('tabela') grid!: Table;

  constructor(
    private lancamentoService: LancamentoService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private title: Title,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
   this.lancamentoService.getAll(this.filtro).then(dados => {
    this.movimentacao = dados

  }).then(() =>  this.totalRegistros = this.movimentacao.length);
   this.totalRegistros = this.movimentacao.length

  }

  excluir(id:any){
         this.lancamentoService.excluirItem(id)
         
        this.messageService.add({ severity: 'success', detail: 'Lançamento excluído com sucesso!' })
  }
  pesquisar(pagina: number = 0): void {

    this.filtro.dataInicio =   this.datePipe.transform(this.filtro.dataInicio, 'dd/MM/yyyy')?.toString()
    this.filtro.dataFim =  this.datePipe.transform(this.filtro.dataFim, 'dd/MM/yyyy')?.toString()
    this.lancamentoService.getAll(this.filtro)
      .then((resultado: any) => {
        this.movimentacao = resultado;
      
      }).then(() =>  this.totalRegistros = this.movimentacao.length) 
       .catch(erro => this.errorHandler.handle(erro));
      this.totalRegistros = this.movimentacao.length
    ;
  
  }

  relatorio(){
    window.open("http://localhost:3000/movimentacao/relatorio")
  }
/* 


  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event!.first! / event!.rows!;
    this.pesquisar(pagina);
  }

  confirmarExclusao(lancamento: any): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(lancamento);
      }
    });
  }

  excluir(lancamento: any) {

    this.lancamentoService.excluir(lancamento.codigo)
      .then(() => {
        if (this.grid.first === 0) {
          this.pesquisar();
        } else {
          this.grid.reset();
        }

        this.messageService.add({ severity: 'success', detail: 'Lançamento excluído com sucesso!' })
      })
  } */

}