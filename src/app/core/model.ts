export class Item {
  Id?:string
  nome?: string;
}

export class Estoque {
  Id?:string
  nome?: string;
  quantidade?:number
}
export class centrocusto {
  Id?:number
  nome?: string;
}

export class classificacao {
  Id?:number
  nome?: string;
}

export interface Unidade {
  label?:string
  value?: string;
}



export class Movimentacao {
  Id?:number
  item = new Item();
  data?:string
  tipo?:string
  Quantidade?: number;
  unidade?:string
  centrocusto? = new centrocusto()
  classificacao? = new classificacao();
}