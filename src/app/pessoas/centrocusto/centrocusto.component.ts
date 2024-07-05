import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LazyLoadEvent } from 'primeng/api';
import { CategoriaService } from 'src/app/categorias/categoria.service';

@Component({
  selector: 'app-centrocusto',
  templateUrl: './centrocusto.component.html',
  styleUrls: ['./centrocusto.component.css']
})
export class CentrocustoComponent implements OnInit {
centrocusto:any;
totalRegistros:any;
pagina = 0
filtro:any = {
  "Descricao":''
};
  constructor(private categoriaService: CategoriaService,
    private title: Title
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Centros de Custo');
    this.categoriaService.getcetrocusto(this.filtro).then(dados => {this.centrocusto = dados})
  }
  
  pesquisar(){
    this.pagina = 0
    this.categoriaService.getcetrocusto(this.filtro).then(dados => {
      this.centrocusto = dados
   })

  }

  aoMudarPagina(event: LazyLoadEvent) {
    this.pagina = event.first!;
  }
}
