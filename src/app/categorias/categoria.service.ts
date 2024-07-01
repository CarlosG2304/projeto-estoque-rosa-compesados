import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

   centrocustoURl = 'http://localhost:3000/centrocusto'
   classicacaoURl = 'http://localhost:3000/classificacao'
  params = new HttpParams();
  constructor(private http: HttpClient) { }

  getcetrocusto(filtro:any):Promise<any>{
    this.params = this.params.set('filtro', filtro.Descricao)
    return this.http.get(this.centrocustoURl, {params:this.params}).toPromise()
  }

  getclassificacao(filtro:any):Promise<any>{
    this.params = this.params.set('filtro', filtro.Descricao)
    return this.http.get(this.classicacaoURl, {params:this.params}).toPromise()
  }

  postCentroCusto(dados:any):Promise<any>{
    return this.http.post(this.centrocustoURl, dados).toPromise()
  }
}