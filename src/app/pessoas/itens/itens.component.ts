import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Item } from 'src/app/core/model';
import { LancamentoService } from 'src/app/lancamentos/lancamento.service';

@Component({
  selector: 'app-itens',
  templateUrl: './itens.component.html',
  styleUrls: ['./itens.component.css']
})
export class ItensComponent implements OnInit {
itens:Item[] = []
totalRegistros:any;
pagina = 0
filtro:any = {
  "Descricao":''
};
  constructor(private lacamentoService:LancamentoService) { }

  ngOnInit(): void {
   this.lacamentoService.getAllitens(this.filtro).then(dados => {
      this.itens = dados
   }
   )
  }


pesquisar(){
  this.pagina = 0
  this.lacamentoService.getAllitens(this.filtro).then(dados => {
    this.itens = dados
 })

}
relatorio(){
  window.open("http://localhost:3001/estoque/relatorio")
}

aoMudarPagina(event: LazyLoadEvent) {
  this.pagina += event.first!;
}
}