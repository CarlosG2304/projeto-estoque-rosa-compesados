import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService,ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { Item,centrocusto } from '../../core/model';
import { PessoaService, PessoaFiltro } from '../pessoa.service';
import { LancamentoService } from 'src/app/lancamentos/lancamento.service';
import { CategoriaService } from 'src/app/categorias/categoria.service';

@Component({
  selector: 'app-classificacao',
  templateUrl: './classificacao.component.html',
  styleUrls: ['./classificacao.component.css']
})
export class ClassificacaoComponent implements OnInit {

  totalRegistros = 0;
  classificacao:any[] = [];
  pagina = 0
  filtro:any = {
    "Descricao":''
  }
  constructor(
    private pessoaService: PessoaService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private confirmationService: ConfirmationService,
    private categoriaService: CategoriaService,
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de pessoas');
    this.categoriaService.getclassificacao(this.filtro).then(dados =>  this.classificacao = dados ).then(() => this.totalRegistros = this.classificacao.length)

  }

  pesquisar(): void {
    this.pagina = 0
    this.categoriaService.getclassificacao(this.filtro).then(dados =>  this.classificacao = dados ).then(() => this.totalRegistros = this.classificacao.length)

  }

  aoMudarPagina(event: LazyLoadEvent) {
    this.pagina = event.first!;
  }



}
