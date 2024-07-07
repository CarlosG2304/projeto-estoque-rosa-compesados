import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { SharedModule } from '../shared/shared.module';
import { PessoasRoutingModule } from './pessoas-routing.module';
import { InputNumberModule } from 'primeng/inputnumber';

import { PessoaCadastroComponent } from './pessoa-cadastro/pessoa-cadastro.component';
import { PessoasPesquisaComponent } from './pessoas-pesquisa/pessoas-pesquisa.component';
import { ClassificacaoComponent } from './classificacao/classificacao.component';
import { ClassificacaoCadastroComponent } from './classificacao-cadastro/classificacao-cadastro.component';
import { ItensComponent } from './itens/itens.component';
import { CentrocustoComponent } from './centrocusto/centrocusto.component';
import { SaldoComponent } from '../saldo/saldo.component';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
@NgModule({
  declarations: [
    PessoaCadastroComponent,
    SaldoComponent,
    PessoasPesquisaComponent,
    ClassificacaoComponent,
    ClassificacaoCadastroComponent,
    ItensComponent,
    CentrocustoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    InputNumberModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    SelectButtonModule,
    InputMaskModule,
    CalendarModule,
    SharedModule,
    PessoasRoutingModule
  ],
  exports: []
})
export class PessoasModule { }
