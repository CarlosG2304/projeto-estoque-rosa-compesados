const knex = require('./config');

const select = knex('Saldo as s')
.select('E.nome','s.data',knex.raw('SUM("m"."Quantidade" - "s"."quantidade") as Quantidade'), knex.raw('SUM(("m"."Quantidade" - "s"."quantidade") * "s"."Valor_unitario") as Valor_Total'), knex.raw('ROUND(AVG("s"."Valor_unitario"),2) AS Valor_Unitario'))
/* .avg('Valor_unitario as valor_unitario') */
.leftJoin('Estoque as E', 's.codigoItem','E.Id')
.leftJoin('Movimentação as m', 'm.codigoSaldo', 's.codigoMovimentacao' )
/*  .whereBetween('s.data', [req.query.dataInicio,req.query.dataFim]) */

.groupBy('E.Id')
.groupBy('s.data')
.orderBy('s.data')
.orderBy('E.nome')
select.then(dados => {
    console.log(dados)
})