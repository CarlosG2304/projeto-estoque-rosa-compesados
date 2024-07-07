import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { LancamentoService } from '../lancamentos/lancamento.service';
import { Title } from '@angular/platform-browser';
import { Estoque } from '../core/model';
import { DatePipe } from '@angular/common';

export class SaldoFiltro {
  descricao?: string = ''
  dataInicio?: string = '2024-01-01'
  dataFim?: string = '2025-01-01'
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
    this.filtro.dataInicio =   this.datePipe.transform(this.filtro.dataInicio, 'dd/MM/yyyy')?.toString()
    this.filtro.dataFim =  this.datePipe.transform(this.filtro.dataFim, 'dd/MM/yyyy')?.toString()
    this.lancamento.getSaldo(this.filtro)
    .then((dados: any) => {
      this.itens = dados;

      this.totalRegistros = dados.length;
      console.log(dados)
    
    });
    
  }
  relatorio(){
    window.open("http://localhost:3001/estoque/relatorio")
  } 
  
    aoMudarPagina(event: LazyLoadEvent) {
    this.pagina = event.first!;

}}
