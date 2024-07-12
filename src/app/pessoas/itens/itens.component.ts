import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LazyLoadEvent } from 'primeng/api';

import { LancamentoService } from 'src/app/lancamentos/lancamento.service';

@Component({
  selector: 'app-itens',
  templateUrl: './itens.component.html',
  styleUrls: ['./itens.component.css']
})
export class ItensComponent implements OnInit {
itens:any[] = []
totalRegistros:any;
pagina = 0
filtro:any = {
  "Descricao":''
};
  constructor(private lacamentoService:LancamentoService, private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle('Itens');
   this.lacamentoService.getSaldo(this.filtro).then(dados => {
      this.itens = dados
   }
   )
  }


pesquisar(){
  this.pagina = 0
  this.lacamentoService.getSaldo(this.filtro).then(dados => {
    this.itens = dados
 })

}
relatorio(){
  window.open("http:"+window.location.href.toString().split(':')[1]+":3001/estoque/relatorio")
}

aoMudarPagina(event: LazyLoadEvent) {
  this.pagina += event.first!;
}
}