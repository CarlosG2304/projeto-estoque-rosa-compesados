import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


const date = new Date();
const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
const firstDayDate = `${date.getFullYear()}/${date.getMonth() + 1}/01`
const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
const lastDayDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`

export class LancamentoFiltro {
  descricao?: string = ''
  dataInicio?: string = firstDayDate
  dataFim?: string = lastDayDate

}



@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  movimentacaoUrl = 'http:'+window.location.href.toString().split(':')[1]+':3001/movimentacao';
  movimentacaoUrlS = 'http:'+window.location.href.toString().split(':')[1]+':3001/entradas';
  itensUrl = 'http:'+window.location.href.toString().split(':')[1]+':3001/itens';
  estoqueURL ='http:'+window.location.href.toString().split(':')[1]+':3001/estoque'
  saldoURL = 'http:'+window.location.href.toString().split(':')[1]+':3001/saldo'
 params = new HttpParams();
  constructor(private http: HttpClient,
    private datePipe: DatePipe) { }

    
getAll(filtro:any):Promise<any>{
  if(typeof filtro.dataInicio === 'object'){
    filtro.dataInicio =  this.datePipe.transform(filtro.dataInicio, 'yyyy/MM/dd')?.toString()
  }
    if(typeof filtro.dataFim === 'object'){
    filtro.dataFim =  this.datePipe.transform(filtro.dataFim, 'yyyy/MM/dd')?.toString()
    }
  this.params = this.params.set('filtro', filtro.descricao)
  this.params = this.params.set('dataInicio', filtro.dataInicio)
  this.params = this.params.set('dataFim', filtro.dataFim) 
return this.http.get(this.movimentacaoUrl,{params:this.params}).toPromise()
}

getAllitens(filtro:any):Promise<any>{
  this.params = this.params.set('filtro', filtro.Descricao)
  return this.http.get(this.itensUrl, {params: this.params}).toPromise()
  }

  getSaldo(filtro:any):Promise<any>{
    this.params = this.params.set('filtro', filtro.descricao)
    this.params = this.params.set('dataInicio', filtro.dataInicio)
    this.params = this.params.set('dataFim', filtro.dataFim) 
    this.params = this.params.set('tipo', filtro.tipo) 
    return this.http.get(this.saldoURL, {params: this.params}).toPromise()
    }
    

  getEstoque(filtro:any): Promise<any>{
    this.params = this.params.set('filtro', filtro.Descricao)
    return this.http.get(this.estoqueURL, {params: this.params}).toPromise()
  }
  
 
  getUnitarios(codigo:any){
    this.params = this.params.set('codigoItem', codigo.Id)
    return this.http.get('http:'+window.location.href.toString().split(':')[1]+':3001/valoresUnitarios', {params: this.params}).toPromise()
  }
post(dados:any):Promise<any>{

    return this.http.post(this.movimentacaoUrl, dados).toPromise()
  }
  put(dados:any):Promise<any>{

    return this.http.put(this.movimentacaoUrl, dados).toPromise()
  }
  putEstoque(dados:any):Promise<any>{

    return this.http.put(this.estoqueURL, dados).toPromise()
  }

  putSaldo(dados:any):Promise<any>{

    return this.http.put(this.saldoURL, dados).toPromise()
  }

  putEdicao(dados:any):Promise<any>{

    return this.http.put('http:'+window.location.href.toString().split(':')[1]+':3001/estoque/edicao', dados).toPromise()
  }
  postItem(dados:any):Promise<any>{

    return this.http.post(this.itensUrl, dados).toPromise()
  }
  
  postEstoque(dados:any):Promise<any>{
    return this.http.post(this.estoqueURL, dados).toPromise()
  }
  postSaldo(dados:any):Promise<any>{
    return this.http.post(this.saldoURL, dados).toPromise()
  }



  editarItem(id:any, item:any){
    return this.http.put(this.estoqueURL+ '/'+id, item).toPromise()
  }

  excluirItem(id:any){
    return this.http.delete(this.movimentacaoUrl+ '/'+id).toPromise()
  }

  buscarPorCodigo(codigo: number): Promise<any> {
  /*   const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg=='); */

    return this.http.get(`${this.movimentacaoUrl}/${codigo}`)
      .toPromise()

  }
  /* pesquisar(filtro: LancamentoFiltro): Promise<any> {
    const headers = new HttpHeaders()
     /*  .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    let params = new HttpParams()
      .set('page', filtro.pagina)
      .set('size', filtro.itensPorPagina);


    if (filtro.descricao) {
      params = params.set('descricao', filtro.descricao);
    }

    if (filtro.dataVencimentoInicio) {
      params = params.set('dataVencimentoDe', this.datePipe.transform(filtro.dataVencimentoInicio, 'yyyy-MM-dd')!);
    }

    if (filtro.dataVencimentoFim) {
      params = params.set('dataVencimentoAte', this.datePipe.transform(filtro.dataVencimentoFim, 'yyyy-MM-dd')!);
    }

    return this.http.get(`${this.lancamentosUrl}?resumo`, { headers, params })
      .toPromise()
      .then((response: any) => {
        const lancamentos = response['content'];

        const resultado = {
          lancamentos,
          total: response['totalElements']
        };

        return resultado;
      });
  }

  excluir(codigo: number): Promise<void> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.http.delete<void>(`${this.lancamentosUrl}/${codigo}`, { headers })
      .toPromise();
  }

  adicionar(lancamento: Lancamento): Promise<Lancamento> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
      .append('Content-Type', 'application/json');

    return this.http.post<Lancamento>(this.lancamentosUrl, lancamento, { headers })
      .toPromise();
  }

  atualizar(lancamento: Lancamento): Promise<Lancamento> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
      .append('Content-Type', 'application/json');

    return this.http.put<Lancamento>(`${this.lancamentosUrl}/${lancamento.codigo}`, lancamento, { headers })
      .toPromise()
      .then((response: any) => {
        this.converterStringsParaDatas([response]);

        return response;
      });
  }



  private converterStringsParaDatas(lancamentos: Lancamento[]) {
    for (const lancamento of lancamentos) {
      let offset = new Date().getTimezoneOffset() * 60000;

      lancamento.dataVencimento = new Date(new Date(lancamento.dataVencimento!).getTime() + offset);

      if (lancamento.dataPagamento) {
        lancamento.dataPagamento = new Date(new Date(lancamento.dataPagamento).getTime() + offset);
      }
    }
  } */
}