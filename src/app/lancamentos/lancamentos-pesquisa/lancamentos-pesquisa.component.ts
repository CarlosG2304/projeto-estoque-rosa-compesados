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
  styleUrls: ['./lancamentos-pesquisa.component.css'],
  styles: [`
 

    :host ::ng-deep .row-accessories {
        background-color: rgba(100,100,100,.15) !important;
    }
`
]
})
export class LancamentosPesquisaComponent implements OnInit {

  filtro = new LancamentoFiltro();


  totalRegistros: number = 0

  movimentacao: Movimentacao[] = [];
  @ViewChild('tabela') grid!: Table;
  pagina = 0
  constructor(
    private lancamentoService: LancamentoService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private title: Title,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    console.log(this.filtro)
    this.title.setTitle('Movimentações');
   this.lancamentoService.getAll(this.filtro).then(dados => {
    this.movimentacao = dados
  
  }).then(() =>  this.totalRegistros = this.movimentacao.length);
   this.totalRegistros = this.movimentacao.length

  }

  excluir(id:any){
         this.lancamentoService.excluirItem(id)
         
        this.messageService.add({ severity: 'success', detail: 'Lançamento excluído com sucesso!' })
  }
  pesquisar(): void {
    this.pagina = 0
    if(typeof this.filtro.dataInicio === 'object'){
      this.filtro.dataInicio =  this.datePipe.transform(this.filtro.dataInicio, 'yyyy/MM/dd')?.toString()
    }
      if(typeof this.filtro.dataFim === 'object'){
      this.filtro.dataFim =  this.datePipe.transform(this.filtro.dataFim, 'yyyy/MM/dd')?.toString()
      }
     console.log(this.filtro.dataInicio) 
    this.lancamentoService.getAll(this.filtro)
      .then((resultado: any) => {
        this.movimentacao = resultado;
      
      }).then(() =>  this.totalRegistros = this.movimentacao.length) 
       .catch(erro => this.errorHandler.handle(erro));
      this.totalRegistros = this.movimentacao.length
    ;
  
  }

  relatorio(){
    window.open("http:"+window.location.href.toString().split(':')[1]+":3001/movimentacao/relatorio")
  }

  aoMudarPagina(event: LazyLoadEvent) {
    this.pagina = event.first!;
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