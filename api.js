
const knex = require('./config');
const express = require('express');
const app = express()
var cors = require('cors')
const bodyParser = require('body-parser')
const port = 3000
var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
var PdfPrinter = require('pdfmake');
var fs = require('fs');
app.use(bodyParser.json())

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

app.get('/movimentacao', (req,res) => {
  
  const select = knex('Movimentação as m')
  .join('Itens as I', 'm.codigoItem', 'I.Id')
  .select('m.Id','m.Quantidade','m.tipo','m.unidade','m.data','I.nome')
   .whereILike('I.nome', '%'+req.query.filtro+'%') 
   .whereBetween('data', [req.query.dataInicio,req.query.dataFim])


  select.then(data => {
       res.send(data)
  })

})

app.get('/movimentacao/relatorio',async(req,res) => {

  const select = await knex('Movimentação as m')
  .join('Itens', 'm.codigoItem', 'Itens.Id')
  .leftJoin('classificacao as c',  'm.codigoClassificacao', 'c.Id')
  .leftJoin('CentroCusto as cc', 'm.codigoCentroCusto', 'cc.Id')
  .select('m.Id', 'Quantidade', 'tipo', 'unidade', 'data',  'Itens.Id as ItemId', 'Itens.nome as nomeItem', 'c.Id as cId', 'c.nome as nomeClassificacao', 'cc.Id as CCId', 'cc.nome as CCNome')

 
  var fonts = {
     Courier: {
    normal: 'Courier',
    bold: 'Courier-Bold',
    italics: 'Courier-Oblique',
    bolditalics: 'Courier-BoldOblique'
  },
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  },
  Times: {
    normal: 'Times-Roman',
    bold: 'Times-Bold',
    italics: 'Times-Italic',
    bolditalics: 'Times-BoldItalic'
  },
  Symbol: {
    normal: 'Symbol'
  },
  ZapfDingbats: {
    normal: 'ZapfDingbats'
  }
    };


    body = []
    for(let movimentacacao of select){
      rows = []
      rows.push(movimentacacao.nomeItem)
      rows.push(movimentacacao.tipo)
      rows.push((movimentacacao.data.getDate() ) + "/" + (movimentacacao.data.getMonth() + 1) + "/" + movimentacacao.data.getFullYear() )
      rows.push(movimentacacao.Quantidade)
      rows.push(movimentacacao.unidade)
        rows.push(movimentacacao.CCNome)
      rows.push(movimentacacao.nomeClassificacao)
      body.push(rows) 
    
    }
    var docDefinition = {
      content: [{
        text:'Relatorio da movimentação de estoque\n\n', style:'header',
      },
       { table: {
        widths: [100, 'auto', 'auto', 75,'auto','auto',85],
    
        body: [
          [{text: "Descrição", style: 'columnsTitle'}, {text: "Tipo" , style: 'columnsTitle'},{text:"Data", style: 'columnsTitle'}, {text:"Quantidade", style: 'columnsTitle'}, {text: "Unidade", style: 'columnsTitle'},{text: "Centro de Custo", style: 'columnsTitle'}, {text: "Classificação", style: 'columnsTitle'}],
          ...body
      
      ]
       },
       alignment: "center",
       layout: {hLineWidth: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 2 : 1;
      },
      vLineWidth: function (i, node) {
        return (i === 0 || i === node.table.widths.length) ? 2 : 0;
      },
      hLineColor: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
      },
      vLineColor: function (i, node) {
        return (i === 0 || i === node.table.widths.length) ? 'black' : 'white';
      },}
    }
      ],
      defaultStyle: {
        font: 'Helvetica',
        fontSize: 11,
      
      },
      styles: {
        header: {
          font:'Courier',
          fontSize: 16,
          bold: true,
          alignment: "center",
          color:'gray'
      
      
        },
        columnsTitle: {
          fontSize: 13,
          bold: true,
          fillColor:"gray",
          color:'#fff',
          alignment: "center",
        
         }
      }
    };
  const printer =  new PdfPrinter(fonts);
  const pdfDoc = printer.createPdfKitDocument(docDefinition)
  const chunks = []
  pdfDoc.on("data", (chunk) => {
    chunks.push(chunk)
  })
pdfDoc.end();
  pdfDoc.on("end", () => {
    const result = Buffer.concat(chunks)
    res.end(result)
  })
  
})
app.get('/movimentacao/:id', (req,res) => {
  
  const select = knex('Movimentação as m')
  .join('Itens', 'm.codigoItem', 'Itens.Id')
  .fullOuterJoin('classificacao as c',  'm.codigoClassificacao', 'c.Id')
  .fullOuterJoin('CentroCusto as cc', 'm.codigoCentroCusto', 'cc.Id')
  .select('m.Id', 'Quantidade', 'tipo', 'unidade', 'data',  'Itens.Id as ItemId', 'Itens.nome as nomeItem', 'c.Id as cId', 'c.nome as nomeClassificacao', 'cc.Id as CCId', 'cc.nome as CCNome')
  .where('m.Id', req.params.id)
  
  select.then(data => {

    movimentacacao = {
      "Id": data[0].Id,
      "data": data[0].data,
      "Quantidade": data[0].Quantidade,
      "unidade": data[0].unidade,
      "tipo": data[0].tipo,
      "item": {
        "Id": data[0].ItemId,
        "nome": data[0].nomeItem
      },
      "centrocusto": {
        "Id": data[0].CCId,
        "nome": data[0].CCNome},
     "classificacao": {
        "Id":  data[0].cId,
        "nome":data[0].nomeClassificacao},
    } 

       res.send(movimentacacao)
       
  })

})

app.post('/movimentacao', (req,res) => {
  
  movimentacacao = {
    "Quantidade": req.body.Quantidade,
    "tipo":  req.body.tipo,
    "unidade": req.body.unidade,
    "data": req.body.data,
    "codigoItem": req.body.item.Id,
    "codigoCentroCusto":  req.body.centrocusto.Id,
    "codigoClassificacao": req.body.classificacao.Id}

console.log(movimentacacao)

  const insert = knex('Movimentação')
  .insert(movimentacacao)

  insert.then(data => {
       res.send(data)
  }) 
   
       if(req.body.tipo == 'ENTRADA'){
   const update = knex.raw('UPDATE  "Estoque" SET  "Quantidade"= "Quantidade" + ? WHERE "nome" = ?', [req.body.Quantidade,req.body.item.nome])
     update.then(data => console.log('Entrada ok '+ data))
  }else if(req.body.tipo == 'SAIDA' ){
        const update = knex.raw('UPDATE  "Estoque" SET  "Quantidade"= "Quantidade" - ? WHERE "Id" = ?', [req.body.Quantidade,req.body.item.Id])
       update.then(data => console.log('Saida ok '+data))
      }  
      
   console.log(req.body)
})


app.get('/estoque', (req,res) => {
  const select = knex('Estoque')
  .select('*')
  .whereILike('nome','%'+req.query.filtro+'%' )
  select.then(data => {
       res.send(data)
  })

})
app.get('/estoque/relatorio',async(req,res) => {

  const select = await knex('Estoque')
  .select('*')
  .orderBy('nome')
  var fonts = {
    Courier: {
      normal: 'Courier',
      bold: 'Courier-Bold',
      italics: 'Courier-Oblique',
      bolditalics: 'Courier-BoldOblique'
    },
    Helvetica: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique'
    },
    Times: {
      normal: 'Times-Roman',
      bold: 'Times-Bold',
      italics: 'Times-Italic',
      bolditalics: 'Times-BoldItalic'
    },
    Symbol: {
      normal: 'Symbol'
    },
    ZapfDingbats: {
      normal: 'ZapfDingbats'
    }
    };


    body = []

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    for(let movimentacacao of select){
      rows = []

      rows.push(movimentacacao.Id)
      rows.push(movimentacacao.nome)
      rows.push(movimentacacao.Quantidade)
      body.push(rows)  
    
    }
    var docDefinition = {
      content: [{
        columns: [{
        text:'Relatorio do estoque', style:'header'} ,{
        image: 'E:\\Workspace\\projeto-estoque\\src\\app\\core\\navbar\\LogoRosa.jpg',
        style:'logo',
        width: 180,
        margin: [0,0,5,8],
      },{text: 'Data: '+ today.toLocaleDateString()+'' , style:'data'}],
    },{ table: {
        body: [
          [{text: "Id", style: "columnsTitle"},{text: "Descrição", style: "columnsTitle"}, {text: "Quantidade", style: "columnsTitle"}],
          ...body]
       },alignment: "center",}
      ],
      defaultStyle: {
        font: 'Helvetica',
        header: {
          fontSize: 18
        }
      },
      styles: {
        header: {
          font: 'Courier',
          fontSize: 18,
          bold: true,
          alignment: "left",
          color:'gray'
        },
        data: {
          font: 'Courier',
          fontSize: 14,
          bold: true,
          alignment: "right",
          color:'gray'
        },
        logo: {
          alignment:"center"
        },
       columnsTitle: {
        fontSize: 15,
        bold: true,
        fillColor:"gray",
        color:'#fff',
        alignment: "center",
       }
      }
    };
  const printer =  new PdfPrinter(fonts);
  const pdfDoc = printer.createPdfKitDocument(docDefinition)
  const chunks = []
  pdfDoc.on("data", (chunk) => {
    chunks.push(chunk)
  })
pdfDoc.end();
  pdfDoc.on("end", () => {
    const result = Buffer.concat(chunks)
    res.end(result)
  })
  

  

})

app.get('/itens', (req,res) => {
  const select = knex('Itens')
  .select('*')
  .whereILike('nome','%'+req.query.filtro+'%' )
  .orderBy("nome")
  select.then(data => {
       res.send(data)
  })

})
app.post('/itens', (req,res) => {
  
  const insertItens = knex('Itens')
  .insert(req.body)
  const insertEstoque = knex('Estoque')
  .insert(req.body)
   
   insertItens.then(data => {
       res.send(data)
  })
  insertEstoque.then(data => {
    console.log(data)
  })

})
app.get('/centroCusto', (req,res) => {
  const select = knex('CentroCusto')
  .select('*')
  .whereILike('nome','%'+req.query.filtro+'%' )
  select.then(data => {
       res.send(data)
  })

})
app.post('/centroCusto', (req,res) => {
  const insert = knex('CentroCusto')
  .insert(req.body)

  insert.then(data => {
       res.send(data)
  })

})
app.get('/classificacao', (req,res) => {
  const select = knex('classificacao')
  .select('*')
  .whereILike('nome','%'+req.query.filtro+'%' )
  select.then(data => {
       res.send(data)
  })

})

app.post('/classificacao', (req,res) => {
  const insert = knex('classificacao')
  .insert(req.body)

  insert.then(data => {
       res.send(data)
  })

})


app.listen(port)

  