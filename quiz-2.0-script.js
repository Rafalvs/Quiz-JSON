// variaveis do HTML
let titulo = document.querySelector("#titulo");

let botoes = document.querySelector(".botoes");

let total = document.querySelector(".total");
let nPergunta = document.querySelector(".numDaPergunta");
let enunciado = document.querySelector(".enunciado");

let altA = document.querySelector("#alternativaA");
let altB = document.querySelector("#alternativaB");
let altC = document.querySelector("#alternativaC");
let altD = document.querySelector("#alternativaD");

let btnAvancar = document.querySelector("#avancar");
let btnVoltar = document.querySelector("#voltar");
let btnConcluir = document.querySelector("#concluir"); // botao de terminar o quiz

let aviso = document.querySelector(".aviso");

// Event Listeners

altA.addEventListener("click", escolhas);
altB.addEventListener("click", escolhas);
altC.addEventListener("click", escolhas);
altD.addEventListener("click", escolhas);

btnAvancar.addEventListener("click", prox);
btnVoltar.addEventListener("click", ant);

btnConcluir.setAttribute('disabled', 'disabled');
btnVoltar.setAttribute('disabled', 'disabled');

// ENDERECO DO ARQUIVO JSON
const url = "questoes.json";
let quantidade; // variavel globa para guardar o numero total de perguntas
let respostaJson;
let nota = 0;

let alternativaAnterior = null; // variavel global para guardar a alternativa previamente selecionada

const altEscolhidas = []; // array para guardar as alternativas escolhidas
let respostasCorretas = [];

// Funcoes

function pegarDados(i)
{
  fetch(url).then(response => {
      
    return response.json();
    
  }).then(data => {

    if(data.erro)
    {
      console.log("Erro ao acessar o JSON");
      return;
    }
    
    let qtdQuestoes = (data.perguntas.length) - 1;
    total.textContent = parseInt(qtdQuestoes) + 1 + " questões"; // exibir o total de questoes do quiz para o usuario
    
    quantidade = parseInt(qtdQuestoes); // atribue o valor da variavel local qtdQuestoes para uma variavel global

    altEscolhidas.length = quantidade + 1; // atribuindo o tamanho da array que guarda as escolhas

    montarPergunta(data, i);
  })
}

let perguntaAtual = 0;
pegarDados(perguntaAtual); // monta a primeira questao na tela

function montarPergunta(data, i)
{
  titulo.textContent = data.titulo;
  nPergunta.textContent = data.perguntas[i].numPerg + ". ";
  enunciado.textContent = data.perguntas[i].questao;

  altA.textContent = data.perguntas[i].altA;
  altB.textContent = data.perguntas[i].altB;
  altC.textContent = data.perguntas[i].altC;
  altD.textContent = data.perguntas[i].altD;

  respostaJson = data.perguntas[i].resposta;
  respostasCorretas[i] = respostaJson;
}

function escolhas(r) 
{
  let resp = r.target;

  // se uma alternativa anterior ja foi clicada, restaura o estilo original
  if (alternativaAnterior)
  {
    /*
    tava usando esse metodo abaixo, mas ele gerava um bug estranho quando selecionava uma alternativa,
    avancava e voltava para mudar, nao atualizando os estilos corretamente

    alternativaAnterior.elemento.style.backgroundColor = ""; 
    alternativaAnterior.elemento.style.fontSize = "1rem";
    */

    // entao fiz do jeito bruto abaixo e deu certo

    altA.style.fontSize = "1rem";
    altB.style.fontSize = "1rem";
    altC.style.fontSize = "1rem";
    altD.style.fontSize = "1rem";
  
    altA.style.backgroundColor = "";
    altB.style.backgroundColor = "";
    altC.style.backgroundColor = "";
    altD.style.backgroundColor = "";
  }

  altEscolhidas[perguntaAtual] = {
    texto: resp.textContent, // text content para comparar as respostas no final
    elemento: resp // para alterar os estilos
  };
  
  resp.style.fontSize = "1.2rem"; // aplica o estilo a alternativa atual
  resp.style.backgroundColor = "plum";

  alternativaAnterior = altEscolhidas[perguntaAtual]; // armazena a alternativa atual como a ultima selecionada
}

function estilos()
{
  altA.style.fontSize = "1rem";
  altB.style.fontSize = "1rem";
  altC.style.fontSize = "1rem";
  altD.style.fontSize = "1rem";

  altA.style.backgroundColor = "";
  altB.style.backgroundColor = "";
  altC.style.backgroundColor = "";
  altD.style.backgroundColor = "";

  // aplica o estilo a alternativa selecionada, se houver
  if(altEscolhidas[perguntaAtual])
  {
    altEscolhidas[perguntaAtual].elemento.style.fontSize = "1.2rem";
    altEscolhidas[perguntaAtual].elemento.style.backgroundColor = "plum";
  }
}

function ant() // botao de voltar
{
  console.log(altEscolhidas);
  if (perguntaAtual > 0)
  {
    perguntaAtual -= 1;
    pegarDados(perguntaAtual);
    btnAvancar.removeAttribute("disabled");
    estilos();

    // funcao para checar se esta no começo e desabilitar o botao
    setTimeout(function isFirst() {
      if (perguntaAtual == 0)
        {
          btnVoltar.setAttribute("disabled", "disabled");
        }
    }, 1);
  }
}

function prox() // botao de avancar
{
  console.log(altEscolhidas);
  if (perguntaAtual < quantidade)
  {
    perguntaAtual += 1;
    pegarDados(perguntaAtual);
    btnVoltar.removeAttribute("disabled");
    estilos();

    // funcao para checar se esta no fim e desabilitar o botao
    setTimeout(function isLast() {
      if (perguntaAtual == quantidade)
        {
          btnAvancar.setAttribute("disabled", "disabled");
          btnConcluir.removeAttribute("disabled"); // deixa o botao concluir clicavel
          btnConcluir.addEventListener("click", concluir); // evento para calcular a nota
        }
    }, 1);
  }
} 

function seRespondeuTodas(array) // funcao para checar se todas perguntas foram respondidas
{
  for (var i = 0; i < array.length; i++)
  {
    if (array[i] == null || array[i] === "")
    {
      return true;
    }
  }
  return false;
}

function concluir()
{
  const valorVazio = false;
  
  if (seRespondeuTodas(altEscolhidas))
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

// nota final

function verificarRespostas()
{
  altEscolhidas.forEach((respostaEscolhida, index) => {
    if (respostaEscolhida.texto === respostasCorretas[index])
    {
      nota++;
    }
  });
  fim();
  console.log(nota);
}

function fim() {
  const acertos = document.createElement("div");
  acertos.classList.add("acertos");
  document.body.appendChild(acertos);
  acertos.textContent = `Você acertou ${nota} questões`;

  const respostas = document.createElement("button");
  respostas.textContent = "Ver Respostas";
  respostas.classList.add("respostas");
  document.body.appendChild(respostas);

  let btnVerRespostas = document.querySelector(".respostas");
  btnVerRespostas.addEventListener("click", () => criarTabela(altEscolhidas, respostasCorretas));
}

function criarTabela(alternsEscolhidas, alternsCorretas) { 
  
  const tabela = document.createElement("table");
  tabela.style.width = "50%";
  tabela.border = "1";

  // cria o cabecalho da tabela
  const cabecalho = tabela.createTHead();
  const linhaCabecalho = cabecalho.insertRow();
  
  // define os titulos das colunas
  const colunas = ["Número da Questão", "Escolhida", "Correta"];
  colunas.forEach(texto => {
    const th = document.createElement('th');
    th.appendChild(document.createTextNode(texto));
    linhaCabecalho.appendChild(th);
  });

  // cria o corpo da tabela
  const corpoTabela = tabela.createTBody();

  // preenche as linhas com os dados
  alternsEscolhidas.forEach((escolhida, index) => {
    const linha = corpoTabela.insertRow();

    // numero da questao
    const celulaNumero = linha.insertCell();
    celulaNumero.appendChild(document.createTextNode(index + 1));

    // alternativa escolhida
    const celulaEscolhida = linha.insertCell();
    celulaEscolhida.appendChild(document.createTextNode(escolhida ? escolhida.texto : "Não respondida"));

    // alternativa correta
    const celulaCorreta = linha.insertCell();
    celulaCorreta.appendChild(document.createTextNode(alternsCorretas[index]));
  });

  // insere a tabela no container HTML
  document.body.appendChild(tabela);
}

/*
quiz 3.0 montar o proprio quiz
*/
