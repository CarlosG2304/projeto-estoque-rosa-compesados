import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

import { PessoaCadastroComponent } from "./pessoa-cadastro/pessoa-cadastro.component";
import { PessoasPesquisaComponent } from "./pessoas-pesquisa/pessoas-pesquisa.component";
import { ClassificacaoComponent } from './classificacao/classificacao.component';
import { ClassificacaoCadastroComponent } from './classificacao-cadastro/classificacao-cadastro.component';
import { ItensComponent } from './itens/itens.component';
import { CentrocustoComponent } from './centrocusto/centrocusto.component';

const routes: Routes = [
  { path: 'estoque', component: PessoasPesquisaComponent },
  { path: 'estoque/nova', component: PessoaCadastroComponent },
  { path: 'pessoas/:codigo', component: PessoaCadastroComponent },
  { path: 'itens', component: ItensComponent },
  { path: 'classificacao', component: ClassificacaoComponent },
  { path: 'centrocusto', component: CentrocustoComponent },
  { path: 'cadastros', component: ClassificacaoCadastroComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PessoasRoutingModule { }