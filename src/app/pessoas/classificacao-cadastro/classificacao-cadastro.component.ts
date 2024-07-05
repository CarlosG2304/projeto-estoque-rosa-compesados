import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { Estoque, Item, centrocusto, classificacao } from '../../core/model';
import { PessoaService } from '../pessoa.service';
import { NgForm } from '@angular/forms';
import { LancamentoService } from 'src/app/lancamentos/lancamento.service';
import { CategoriaService } from 'src/app/categorias/categoria.service';
@Component({
  selector: 'app-classificacao-cadastro',
  templateUrl: './classificacao-cadastro.component.html',
  styleUrls: ['./classificacao-cadastro.component.css']
})
export class ClassificacaoCadastroComponent implements OnInit {

  item:Item = new Item();
  estoque:Estoque = new Estoque();
  classificacao: classificacao = new classificacao();
  centrocusto:centrocusto = new centrocusto();
  constructor(
    private pessoaService: PessoaService,
    private messageService: MessageService,
    private lancamentoService: LancamentoService,
    private categoriaService: CategoriaService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit() {

  }
salvarItem(form:NgForm){
    if(this.item.nome){
      this.lancamentoService.postItem(this.item).then(dados => {

        this.messageService.add({ severity: 'success', detail: 'Item salvo com sucesso!' });
      }) .catch(erro => {
        this.messageService.add({ severity: 'error', detail: 'Erro! Status: '+erro.statusText });
    
      });
    }else{
      this.messageService.add({ severity: 'warn', detail: 'Campo Vazio' });
    }
   form.reset()

}
salvarClassificacao(form:NgForm){

  if(this.classificacao.nome){
    this.pessoaService.post(this.classificacao).then(dados => {

      this.messageService.add({ severity: 'success', detail: 'Classificação salva com sucesso!' });
    }) .catch(erro => {
      this.messageService.add({ severity: 'error', detail: 'Erro! Status: '+erro.statusText });
  
    });
  }else{
    this.messageService.add({ severity: 'warn', detail: 'Campo Vazio' });
  }
   form.reset()
}
salvarCentroCusto(form:NgForm){

  if(this.centrocusto.nome){
    this.categoriaService.postCentroCusto(this.centrocusto).then(dados => {

      this.messageService.add({ severity: 'success', detail: 'Centro de custo salvo com sucesso!' });
    }) .catch(erro => {
      this.messageService.add({ severity: 'error', detail: 'Erro! Status: '+erro.statusText });
    
    });
  }else{
    this.messageService.add({ severity: 'warn', detail: 'Campo Vazio' });
  }
   form.reset()
}
}
