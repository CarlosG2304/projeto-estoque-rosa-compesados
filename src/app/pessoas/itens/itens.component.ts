import { Component, OnInit } from '@angular/core';
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
  this.lacamentoService.getAllitens(this.filtro).then(dados => {
    this.itens = dados
 })

}


}