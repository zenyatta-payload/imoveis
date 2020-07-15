/*************************************************************************************************************
Funções auxiliares para formatação de valor e fornecer cores para estilo dos gráficos utilizados na página.
*************************************************************************************************************/

// Formata o valor recebido em R$ e divide por 1 milhão para ser usado em uma escala = "R$ em milhões de reais"
function formataMoeda(valor){
	if(valor === ""){
    	 valor =  0;
  	}else{
     	valor = valor / 1000000;
     	valor = valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
  	}
  	return valor;
}  

// Fornece uma cor para cada coluna dos gráficos de coluna de acordo com o índice recebido 
function  atribuiCorColunas(indice){
  // 10 Cores pré-definidas para colorir os gráficos por Modalidade
  // Definindo as cores para dar identidade a cada coluna e melhorar a usabilidade
	var paletaCores = [
		'salmon',
		'orange',
		'lightblue',
		'darkblue',
		'green',
		'gray',
		'yellow',
		'black',
		'brown',
		'pink' 
	]
  // Retorna uma cor da paleta de 10 cores pré-definidas
  // Caso exceda as 10 possibilidades gera uma cor aleatoriamente
  // Dessa forma pode-se usar para quantas forem necessário
  // Utilizando sintaxe reduzida
  return indice > 10 ? '#' + Math.random().toString(16).substr(-6) : paletaCores[indice];
}

// Fornece uma cor para cada fatia dos gráficos de pizza de acordo com o índice recebido 
function  atribuiCorFatias(indice){
  // 20 Cores pré-definidas para colorir o gráfico por cidades
	var paletaCores = [
    'RoyalBlue',
    'ForestGreen',
 		'LightSkyBlue',
 		'Navy',
    'SteelBlue',
    'LightSteelBlue',
    'DarkTurquoise',
    'SlateGray',
    'Aquamarine',
    'OliveDrab',
    'LightBlue',
    'DarkSlateBlue',
    'LightSlateGray',
 		'DarkBlue',
 		'MediumBlue',
 		'Blue',
 		'SlateBlue',
    'DodgerBlue',
    'DeepSkyBlue',
    'MidnightBlue'
	]
  // Retorna uma cor da paleta de 20 cores pré-definidas
  // Caso exceda as 20 possibilidades gera uma cor aleatoriamente
  // Dessa forma pode-se usar para quantas forem necessário
  // Utilizando sintaxe reduzida
  return indice > 20 ? '#' + Math.random().toString(16).substr(-6) : paletaCores[indice];
}