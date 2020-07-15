function montaTabela(dadosImoveisJson){
  $('#tblImoveis').DataTable({
      "data": dadosImoveisJson,
      "columns": [
          { "data": "endereco"},
          { "data": "bairro" },
          { "data": "cidade" },
          { "data": "modalidadeVenda" },
          { "data": "precoOferta"  }, 
          { "data": "valorAvaliacao" },
          { "data": "porcentagemDesconto" },
      ],
      "columnDefs": [{
          "render": function(data){
                      data = data.replace(".","").replace(",",".");
                      return parseFloat(data).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
                    },
          "targets": [4,5]
      },
      {
          "render": function ( data, type, row ) {
                      return parseFloat(data).toLocaleString() + '%';
                    },
          "targets": [6]
      },
      {
          "render": function ( data, type, row ) {
                      return data.trim();
                    },
          "targets": [0,1,2]
      }
      ],
      oLanguage: {
          sLengthMenu:   "Mostrar _MENU_ registros",
          sInfo:         "Mostrando de _START_ até _END_ de _TOTAL_ registros",
          sInfoEmpty:    "Mostrando de 0 até 0 de 0 registros",
          sInfoFiltered: "(filtrado de _MAX_ registros no total)",
          sSearch:       "Procurar:",
          oPaginate: {
              sFirst:    "Primeiro",
              sPrevious: "Anterior",
              sNext:     "Seguinte",
              sLast:     "Último"
          },
          oAria: {
              sSortAscending:  ": Ordenar colunas de forma ascendente",
              sSortDescending: ": Ordenar colunas de forma descendente"
          }
      },
      "language": {
        "decimal": ",",
        "thousands": "."
      },
      lengthChange: true,
      initComplete: function () {
        this.api().columns().every( function () {
          var column = this;
          var select = $('<select class="browser-default custom-select form-control-sm"><option value="" selected>Filtrar</option></select>')
              .appendTo( $(column.footer()).empty() )
              .on( 'change', function () {
                  var val = $.fn.dataTable.util.escapeRegex(
                      $(this).val()
                  );
                  column
                      .search( val ? '^'+val+'$' : '', true, false )
                      .draw();
              });

          column.cells('', column[0]).render('display').sort().unique().each( function ( d, j ){            
              select.append( '<option value="'+d+'">'+d+'</option>' )
          });
        });
      }
  });
}  
 