

export class Estoque {
  Id?:string
  nome?: string;
  quantidade?:number
}


export class Movimentacao {
  Id?:number
  item? = {}
  data?:string
  tipo?:string
  Quantidade?: number;
  unidade?:string
  centrocusto? = {}
  classificacao?  = {}
  valorUnitario?:number
  observacao?:string
}