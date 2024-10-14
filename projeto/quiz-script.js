// DOM

let titulo = document.querySelector("#titulo");

let totalDePerguntas = document.querySelector(".quantidade");
let numDaPergunta = document.querySelector(".numDaPergunta");
let enunciado = document.querySelector(".enunciado");

let alternativaA = document.querySelector("#alternativaA");
let alternativaB = document.querySelector("#alternativaB");
let alternativaC = document.querySelector("#alternativaC");
let alternativaD = document.querySelector("#alternativaD");

let btnAvancar = document.querySelector("#avancar");
let btnVoltar = document.querySelector("#voltar");
let btnConcluir = document.querySelector("#concluir");

let aviso = document.querySelector(".aviso");

// Event Listeners

alternativaA.addEventListener("click", escolhas);
alternativaB.addEventListener("click", escolhas);
alternativaC.addEventListener("click", escolhas);
alternativaD.addEventListener("click", escolhas);

btnAvancar.addEventListener("click", prox);
btnVoltar.addEventListener("click", ant);

btnConcluir.setAttribute('disabled', 'disabled');
btnVoltar.setAttribute('disabled', 'disabled');

// Variaveis Globais

const url = "questoes-astronomia.json"; // ENDERECO DO ARQUIVO JSON

let quantidadeTotalDePerguntas;
let nota = 0;

let alternativaAnterior = null;

let perguntaAtual = 0;
let alternativasEscolhidas = [];
let respostasCorretas = [];

// Funcoes

const pegarDados = (perguntaAtualParam) => 
{
  fetch(url).then(response => {     
    return response.json();
  }).then(data => {

    if(data.erro)
    {
      console.log("Erro ao acessar o JSON");
      return;
    }

    pegarQuantidadeTotalDeQuestoes(data);
    montarQuestao(data, perguntaAtualParam);
  })
}

pegarDados(perguntaAtual); // monta a primeira questao na tela

const pegarQuantidadeTotalDeQuestoes = (dataDoJSON) => {
  let qtdQuestoes = (dataDoJSON.perguntas.length) - 1;

  quantidadeTotalDePerguntas = parseInt(qtdQuestoes);

  totalDePerguntas.textContent = parseInt(qtdQuestoes) + 1 + " questões"; // exibir o total de questoes do quiz para o usuario

  alternativasEscolhidas.length = quantidadeTotalDePerguntas + 1; // atribuindo o tamanho da array que guarda as escolhas
}

const montarQuestao = (data, i) =>
{
  titulo.textContent = data.titulo;
  numDaPergunta.textContent = data.perguntas[i].numPerg + ". ";
  enunciado.textContent = data.perguntas[i].questao;

  alternativaA.textContent = data.perguntas[i].altA;
  alternativaB.textContent = data.perguntas[i].altB;
  alternativaC.textContent = data.perguntas[i].altC;
  alternativaD.textContent = data.perguntas[i].altD;

  respostasCorretas[i] = data.perguntas[i].resposta;
}

const restaurarEstilos = (a, b, c, d) => {
  a.style.fontSize = "1rem";
  b.style.fontSize = "1rem";
  c.style.fontSize = "1rem";
  d.style.fontSize = "1rem";

  a.style.backgroundColor = "";
  b.style.backgroundColor = "";
  c.style.backgroundColor = "";
  d.style.backgroundColor = "";
}

function escolhas(altEscolhida)
{
  let resp = altEscolhida.target;

  // se uma alternativa anterior ja foi clicada, restaura o estilo original
  if (alternativaAnterior)
  {
    restaurarEstilos(alternativaA, alternativaB, alternativaC, alternativaD);
  }

  alternativasEscolhidas[perguntaAtual] = {
    texto: resp.textContent, // text content para comparar as respostas no final
    elemento: resp // para alterar os estilos
  };
  
  resp.style.fontSize = "1.2rem"; // aplica o estilo a alternativa atual
  resp.style.backgroundColor = "#f39c12";

  alternativaAnterior = alternativasEscolhidas[perguntaAtual];
}

const aplicarEstilos = () => 
{
  restaurarEstilos(alternativaA, alternativaB, alternativaC, alternativaD);

  if(alternativasEscolhidas[perguntaAtual]) // aplica o estilo a alternativa selecionada, se houver
  {
    alternativasEscolhidas[perguntaAtual].elemento.style.fontSize = "1.2rem";
    alternativasEscolhidas[perguntaAtual].elemento.style.backgroundColor = "#f39c12";
  }
}

function ant()
{
  console.log(alternativasEscolhidas);

  if (perguntaAtual > 0)
  {
    perguntaAtual -= 1;
    pegarDados(perguntaAtual);
    btnAvancar.removeAttribute("disabled");
    aplicarEstilos();

    setTimeout(function isFirst() {
      if (perguntaAtual == 0)
        {
          btnVoltar.setAttribute("disabled", "disabled");
        }
    }, 1);
  }
}

function prox()
{
  console.log(alternativasEscolhidas);

  if (perguntaAtual < quantidadeTotalDePerguntas)
  {
    perguntaAtual += 1;
    pegarDados(perguntaAtual);
    btnVoltar.removeAttribute("disabled");
    aplicarEstilos();

    setTimeout(function seForUltimaQuestao() {
      if (perguntaAtual == quantidadeTotalDePerguntas)
        {
          btnAvancar.setAttribute("disabled", "disabled");
          btnConcluir.removeAttribute("disabled");
          btnConcluir.addEventListener("click", concluir);
        }
    }, 1);
  }
} 

const seRespondeuTodas = (array) =>
{
  for (var i = 0; i < array.length; i++)
  {
    if (array[i] == null || array[i] === "")
    {
      return false;
    }
  }
  return true;
}

function concluir()
{  
  if (!seRespondeuTodas(alternativasEscolhidas))
  {
    aviso.textContent = "Por favor responda todas as questões.";
    setTimeout(() => {
    aviso.textContent = ""}, 3000);
  }
  else
  {
    verificarRespostas();
    btnConcluir.remove();
  }
}

const verificarRespostas = () =>
{
  alternativasEscolhidas.forEach((respostaEscolhida, i) => {
    if (respostaEscolhida.texto === respostasCorretas[i])
    {
      nota++;
    }
  });
  fim();
}

const fim = () =>
{
  const acertos = document.createElement("div");
  acertos.classList.add("acertos");
  document.body.appendChild(acertos);
  acertos.textContent = `Você acertou ${nota} questões`;

  criarTabela(alternativasEscolhidas, respostasCorretas);
}

const criarTabela = (altEscolhidasParam, altCorretasParam) =>
{   
  const tabela = document.createElement("table");
  tabela.style.width = "50%";

  const cabecalho = tabela.createTHead();
  const linhaCabecalho = cabecalho.insertRow();
  
  const colunas = ["Número da Questão", "Escolhida", "Correta"];
  colunas.forEach(texto => {
    const th = document.createElement('th');
    th.appendChild(document.createTextNode(texto));
    linhaCabecalho.appendChild(th);
  });

  const corpoDaTabela = tabela.createTBody();

  // preenche as linhas com os dados
  altEscolhidasParam.forEach((escolhida, i) => {
    const linha = corpoDaTabela.insertRow();

    // numero da questao
    const celulaNumero = linha.insertCell();
    celulaNumero.appendChild(document.createTextNode(i + 1));
    celulaNumero.classList.add("celulaNumero"); // classes para manipular no css depois

    // alternativa escolhida
    const celulaEscolhida = linha.insertCell();
    celulaEscolhida.appendChild(document.createTextNode(escolhida ? escolhida.texto : "Não respondida"));
    celulaEscolhida.classList.add("celulaEscolhida");

    // alternativa correta
    const celulaCorreta = linha.insertCell();
    celulaCorreta.appendChild(document.createTextNode(altCorretasParam[i]));
    celulaCorreta.classList.add("celulaCorreta");

    if (escolhida.texto === altCorretasParam[i])
    {
      celulaCorreta.style.backgroundColor = "green";
    }
    else
    {
      celulaCorreta.style.backgroundColor = "red";
    }
  });

  document.body.appendChild(tabela);
}

// ideia: montar o proprio quiz
