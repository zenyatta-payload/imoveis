/*************************************************************************************************************
Este código irá plotar 5 gráficos: 
1 - Quantidade de Imóveis por Modaliddade de Venda (Gráfico de Colunas)
2 - Valor Total de Imóveis por Modaliddade de Venda (Gráfico de Colunas)
3 - Preço Oferta Total de Imóveis por Modaliddade de Venda (Gráfico de Colunas)
4 - Quantidade de Imóveis por Cidade (Gráfico de Pizza)
5 - Valor Total de Imóveis por Cidade (Gráfico de Pizza)
Com base nos dados do arquivo "imoveis.json" recebidos será calculado os totalizadores de quantidade e valor
total de imóveis por modalidade de venda. 
Em se tratando de importantes indicadores ainda será calculado o preço oferta total por modalidade de venda
bem como a distribuição do volume de venda por cidades tanto em termos de quantidades como de valor total.
*************************************************************************************************************/

// Carregando os pacotes do Google Charts e inicializando os gráficos
// Recebe os dados carregados do arquivo Json "imoveis" 
function carregaGraficos(dadosImoveisJson){
	// Carregando o pacotes necessários - versão mais recente
  	google.charts.load('current', {'packages':['corechart','treemap'],'language':'pt'});
  	// Função de retorno para chamar a função que desenha os gráficos
  	google.charts.setOnLoadCallback(
        function() { // Função anônima que obtém as informações e chama as funções que montam cada gráfico
    		// Obtendo as informações necessárias para cada modalidade de venda
    		var tabelaDadosPorModalidade = montaTabelaDadosPorModalidade(dadosImoveisJson);
    		var tabelaDadosPorCidade = montaTabelaDadosPorCidade(dadosImoveisJson);
    		desenhaGraficoQuantidadePorModalidade(tabelaDadosPorModalidade);
    		desenhaGraficoValorPorModalidade(tabelaDadosPorModalidade);
    		desenhaGraficoPrecoPorModalidade(tabelaDadosPorModalidade);
    		desenhaGraficoVendaPorCidade(tabelaDadosPorCidade);
  	});
}

// Para cada Modalidade de Venda que houver:
// Monta um array de objetos com as informações de Modalidade de Venda, Quantidade de Imóveis, Valor Total e Preço Oferta Total;
// Objetos no seguinte formato: {"modalidade": "a","quantidade": "999","valorTotal": "999","precoTotal" : "999"}
function montaTabelaDadosPorModalidade(dadosImoveisJson){
	modalidades = [];
	// Lendo registros de cada imóvel
	$.each(dadosImoveisJson, function(indice,imovel){
		// Encontrando o indice da modalidade de venda do registro lido no array modalidades
		var posicao = modalidades.findIndex(elementos => elementos.modalidade === imovel.modalidadeVenda);

		// Retorna um valor float para poder realizar a soma
		valorAvaliacao = parseFloat((imovel.valorAvaliacao).replace(".","").replace(",","."));
		precoOferta = parseFloat((imovel.precoOferta).replace(".","").replace(",","."));

		// Se não encontrar um elemento no array modalidades com o atributo modalidade igual 
		// a modadalidade de venda do registro lido: guarda a nova modalidade e suas 
		// informações no array modalidades;
		// Caso contrário, realiza a soma dos atributos respectivamente
		if(!modalidades.find(elementos => elementos.modalidade === imovel.modalidadeVenda)) {
			modalidades.push({
				"modalidade": imovel.modalidadeVenda,
				"quantidade": 1,
				"valorTotal": valorAvaliacao,
				"precoTotal": precoOferta,
				"cor": atribuiCorColunas(modalidades.length) // Atribuindo uma cor para cada modalidade
			});
		} else{
			modalidades[posicao].quantidade += 1,
			modalidades[posicao].valorTotal += valorAvaliacao,
			modalidades[posicao].precoTotal += precoOferta
		}
	});	
	return modalidades;
}

// Para cada Cidade que houver
// Monta um array de objetos com as informações de Cidade, Qantidade de Imóveis, Valor Total
// Objetos no seguinte formato: {"cidade": "a","quantidade": "999","valorTotal": "999"}
function montaTabelaDadosPorCidade(dadosImoveisJson){
	cidades = [];
	// Lendo registros de cada imóvel
	$.each(dadosImoveisJson, function(indice,imovel){
		// Encontrando o indice da modalidade de venda do registro lido no array cidades
		var posicao = cidades.findIndex(elementos => elementos.cidade === imovel.cidade.trim());
		// Retorna um valor float para poder realizar a soma
		valorAvaliacao = parseFloat((imovel.valorAvaliacao).replace(".","").replace(",","."));

		// Se não encontrar um elemento no array cidades com o atributo cidade igual 
		// a cidade do registro lido: guarda a nova cidade e suas 
		// informações no array cidades;
		// Caso contrário, realiza a soma dos atributos respectivamente
		if(!cidades.find(elementos => elementos.cidade === imovel.cidade)) {
			cidades.push({
				"cidade": imovel.cidade,
				"quantidade": 1,
				"valorTotal": valorAvaliacao,
			});
		} else{
			cidades[posicao].quantidade += 1,
			cidades[posicao].valorTotal += valorAvaliacao
		}
	});	

	// Ordenando o array pelo valorTotal decrescente
	cidades = cidades.sort(function(a,b) { 
		return b.valorTotal - a.valorTotal;
  	});

  	// Retorando os dez primeiros registros do array
  	cidades = cidades.slice(0,10);

  	// Iterando o array para atribuir uma cor por cidade (10 Maiores Volumes de Venda)
  	$.each(cidades, function (indice, cidade){
    	cidade.cor =  atribuiCorFatias(indice) // Atribuindo uma cor para cada cidade
  	});
    
	return cidades;
}

// Desenha gráfico da Quantidade de Imóveis por Modalidade de Venda
function desenhaGraficoQuantidadePorModalidade(tabelaDadosPorModalidade){
	// Monta uma tabela em formato de array bidimensional com os dados da Modalidade de Venda e respectiva quantidade de imóveis
	var dadosQuantidade = [];
	dadosQuantidade[0] = ['Modalidade','Quantidade',{role:'annotation'},{role:'style'}]; // Nomes das colunas
	var cor = "";
	$.each(tabelaDadosPorModalidade, function(indice,conteudo){
		cor = conteudo.cor;
	  	dadosQuantidade.push([conteudo.modalidade,conteudo.quantidade,conteudo.quantidade,'color:'+cor+';opacity: 0.9;stroke-color:' + cor + '; stroke-width: 5;']);
	 });

	// Configurando opções do gráfico
	var opcoes = {
		fontName:'Segoe UI',
	  	width: 500, // Largura
	  	height: 500, // Altura
		legend: 'none',
		vAxis:{ 
			title: 'Quantidade de Imóveis',
			ticks: [0,200,400,600,800,1000,1200,1400,1600,1800,2000],
			titleTextStyle:{
		  		fontSize: 16
			}  			
		},
		hAxis:{
			title: 'Modalidade de Venda',
			titleTextStyle:{
		  		fontSize: 16
			}  			
		},
		annotations:{
			textStyle:{
				italic: true,
				fontSize: 14
			},
			alwaysOutside: true
		},
		chartArea :{
			top: '8%',
			width: "70%",
			height: "70%"
		} 
	};
  
	// Instanciando um objeto do tipo gráfico de barras e informando a div alvo
	var tabelaQuantidade = google.visualization.arrayToDataTable(dadosQuantidade);
	tabelaQuantidade.sort([{ column: 1, desc: true }]); // Ordenando as colunas de forma decrescente
	var graficoQuantidade = new google.visualization.ColumnChart(document.getElementById('grafico_quantidade_modalidade'));
	graficoQuantidade.draw(tabelaQuantidade,opcoes);
}

// Desenha gráfico do Valor Total de Imóveis por Modalidade de Venda
function desenhaGraficoValorPorModalidade(tabelaDadosPorModalidade){
	// Monta uma tabela em formato de array bidimensional com os dados da Modalidade de Venda e respectivo Valor Total de imóveis
 	var dadosValorTotal = [];
  	// Adicioando coluna de anotações para mostrar o valor total em R$ e coluna de estilo para adicionar borda
  	dadosValorTotal[0] = ['Modalidade','Valor Total de Imóveis',{role:'annotation'},{role:'style'}]; // Nomes das colunas
  	$.each(tabelaDadosPorModalidade, function(indice,conteudo){
	  	valorTotalFormatoMoeda = formataMoeda(conteudo.valorTotal);
	  	dadosValorTotal.push([conteudo.modalidade,conteudo.valorTotal,valorTotalFormatoMoeda,'color:'+conteudo.cor+';opacity: 0.9;stroke-color:' + conteudo.cor + '; stroke-width: 5;']);
  	});

  	// Configurando opções do gráfico
  	var opcoes = {
	  	fontName:'Segoe UI',
	  	width: 600, // Largura
	  	height: 500, // Altura
		legend: 'none',
		vAxis:{ 
			title: 'Valor Total',
			format: 'short',
			titleTextStyle:{
		  		fontSize: 16
			}
		},
		hAxis:{
			title: 'Modalidade de Venda',
			titleTextStyle:{
		  		fontSize: 16
			}  			
		},
		annotations:{
			alwaysOutside: true,  	 	
			textStyle:{
		  		fontSize: 14,
		  		italic: true
			}
		},
		chartArea :{
			top: '8%',
			width: "70%",
			height: "70%"
		}  		
	};
  	
	// Instanciando um objeto do tipo gráfico de barras e informando a div alvo 
	var tabelaValor = google.visualization.arrayToDataTable(dadosValorTotal);
	tabelaValor.sort([{ column: 1, desc: true }]); // Ordenando as colunas de forma decrescente
	var graficoValor = new google.visualization.ColumnChart(document.getElementById('grafico_valor_total_modalidade'));
	graficoValor.draw(tabelaValor,opcoes);
}

// Desenha gráfico Indicador do Preço Total de Imóveis por Modalidade de Venda
function desenhaGraficoPrecoPorModalidade(tabelaDadosPorModalidade){
	// Monta uma tabela em formato de array bidimensional com os dados da Modalidade de Venda e respectivo de Preço Oferta Total de imóveis
 	var dadosPrecoTotal = [];
  	// Adicioando coluna de anotações para mostrar o preço oferta total em R$ e coluna de estilo para adicionar borda
  	dadosPrecoTotal[0] = ['Modalidade','Preço Oferta Total de Imóveis',{role:'annotation'},{ role:'style'}]; // Nomes das colunas
  	$.each(tabelaDadosPorModalidade, function(indice,conteudo){
	  	precoTotalFormatoMoeda = formataMoeda(conteudo.precoTotal);
	  	dadosPrecoTotal.push([conteudo.modalidade,conteudo.precoTotal,precoTotalFormatoMoeda,'color:'+conteudo.cor+';opacity: 0.9;stroke-color:' + conteudo.cor + '; stroke-width: 5;']);
  	});

  	// Configurando opções do gráfico
  	var opcoes = {
	  	fontName:'Segoe UI',
	  	width: 600, // Largura
	  	height: 500, // Altura
		legend: 'none',
		vAxis:{ 
			title: 'Preço Oferta Total',
			format: 'short',
			titleTextStyle:{
		  		fontSize: 16
			}
		},
		hAxis:{
			title: 'Modalidade de Venda',
			titleTextStyle:{
		  		fontSize: 16
			}
		},
		annotations:{
			alwaysOutside: true,
	 		textStyle:{
		  		fontSize: 14,
		  		italic: true
			}
		},
		chartArea :{
			top: '8%',
			width: "70%",
			height: "70%"
		}  		
	};
  	
	// Instanciando um objeto do tipo gráfico de barras e informando a div alvo 
	var tabelaPreco = google.visualization.arrayToDataTable(dadosPrecoTotal);
	tabelaPreco.sort([{ column: 1, desc: true }]); // Ordenando as colunas de forma decrescente
	var graficoPreco = new google.visualization.ColumnChart(document.getElementById('grafico_preco_total_modalidade'));
	graficoPreco.draw(tabelaPreco,opcoes);
}

// Desenha gráficos do Indicador da Distribuição de Quantidade de Imóveis e Valores de Venda Imóveis por Cidade
function desenhaGraficoVendaPorCidade(tabelaDadosPorCidade){

	// Definindo opções dos gráficos de pizza
  	var opcoes = {
    	fontName: 'Segoe UI',
    	height: 400,
		width: 800,
		pieSliceText: 'percentage',
		chartArea :{
  			top: '8%',
  			left: '1%',
  			width: "70%",
  			height: "70%"
  		}  
  	};

	// Monta uma tabela em formato de array bidimensional dadosCidadesQuantidade com os dados da Cidade e respectiva Quantidade de Imóveis
	// Monta uma tabela em formato de array bidimensional dadosCidadesValor com os dados da Cidade e respectivo Valor Total de Venda de Imóveis
  	// Coloca no array opcoesCores a cor específica para cada cidade 
  	var dadosCidadesQuantidade = [];  	
  	var dadosCidadesValor = [];  	
  	var opcoesCores = [];
  	dadosCidadesQuantidade[0] = ['Cidade','Quantidade'];
  	dadosCidadesValor[0] = ['Cidade','Valor'];
  	$.each(tabelaDadosPorCidade, function(indice,conteudo){
	  	dadosCidadesQuantidade.push([conteudo.cidade,conteudo.quantidade]);
	  	dadosCidadesValor.push([conteudo.cidade,conteudo.valorTotal]);
	  	opcoesCores.push(conteudo.cor);
  	});   
	
  	// Atribui as cores de cada fatia do gráfico pizza
	opcoes.colors = opcoesCores;

	// Instanciando um objeto do tipo pizza e informando a div alvo 
  	var tabelaCidades = google.visualization.arrayToDataTable(dadosCidadesQuantidade);
    var graficoCidades = new google.visualization.PieChart(document.getElementById('grafico_cidades'));
  	graficoCidades.draw(tabelaCidades,opcoes);

  	// Instanciando um objeto do tipo pizza e informando a div alvo 
  	var tabelaCidadesValor = google.visualization.arrayToDataTable(dadosCidadesValor);
  	var graficoCidadesValor = new google.visualization.PieChart(document.getElementById('grafico_cidades_valor'));
	graficoCidadesValor.draw(tabelaCidadesValor,opcoes);
}

