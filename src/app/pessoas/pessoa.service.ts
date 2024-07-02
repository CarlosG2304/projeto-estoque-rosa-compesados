import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { classificacao } from '../core/model';

export class PessoaFiltro {
  nome?: string;
  pagina: number = 0;
  itensPorPagina: number = 5;
}

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  classificacaoUrl = 'http://localhost:3001/classificacao';

  constructor(private http: HttpClient) { }
/* 
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    let params = new HttpParams()
      .set('page', filtro.pagina)
      .set('size', filtro.itensPorPagina); */
  post(classificacao:classificacao): Promise<any> {
   return this.http.post(this.classificacaoUrl, classificacao).toPromise()
}}
