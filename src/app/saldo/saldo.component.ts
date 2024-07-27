import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { LancamentoService } from '../lancamentos/lancamento.service';
import { Title } from '@angular/platform-browser';
import { Estoque } from '../core/model';
import { DatePipe } from '@angular/common';

const date = new Date();
const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
const firstDayDate = firstDay.toLocaleDateString()
const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
const lastDayDate = lastDay.toLocaleDateString()

export class SaldoFiltro {
  descricao?: string = ''
  dataInicio?: string = firstDayDate
  dataFim?: string = lastDayDate
  tipo = 'SAIDA'
}

@Component({
  selector: 'app-saldo',
  templateUrl: './saldo.component.html',
  styleUrls: ['./saldo.component.css']
})
export class SaldoComponent {
  
  totalRegistros = 0;
  pagina = 0
  filtro = new SaldoFiltro();
  
  tipos = [
    { label: 'Entrada', value: 'ENTRADA' },
    { label: 'Saida', value: 'SAIDA' },
  ];
  itens:Estoque[] = [];
  @ViewChild('tabela') grid!: any;

  constructor(
    private lancamento: LancamentoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private title: Title,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.title.setTitle('Saldo');
    this.lancamento.getSaldo(this.filtro)
      .then((dados: any) => {
        this.itens = dados;
        this.totalRegistros = dados.total;
      });
  }

  pesquisar(): void {
    this.pagina = 0 
    if(typeof this.filtro.dataInicio === 'object'){
    this.filtro.dataInicio =  this.datePipe.transform(this.filtro.dataInicio, 'dd/MM/yyyy')?.toString()
  }
    if(typeof this.filtro.dataFim === 'object'){
    this.filtro.dataFim =  this.datePipe.transform(this.filtro.dataFim, 'dd/MM/yyyy')?.toString()
    }
    this.lancamento.getSaldo(this.filtro)
    .then((dados: any) => {
      this.itens = dados;

      this.totalRegistros = dados.length;
    
    });
    
  }
  relatorio(){
    window.open("http:"+window.location.href.toString().split(':')[1]+":3001/saldo/relatorio?dataInicio="+this.filtro.dataInicio+'&dataFim='+this.filtro.dataFim)
  } 

  relatorioInsumos(){
    window.open("http:"+window.location.href.toString().split(':')[1]+":3001/saldo/relatorio/insumos?dataInicio="+this.filtro.dataInicio+'&dataFim='+this.filtro.dataFim)
  } 
  
    aoMudarPagina(event: LazyLoadEvent) {
    this.pagina = event.first!;

}}
