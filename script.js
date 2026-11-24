// ===== Funções auxiliares (usadas pelas três calculadoras) =====

// Lê o valor de um campo e devolve como número.
// Se o campo estiver vazio, devolve NaN (não é número).
function lerNumero(id) {
  const texto = document.getElementById(id).value;
  if (texto.trim() === "") {
    return NaN;
  }
  return Number(texto);
}

// Valida um número. Devolve uma mensagem de erro ou "" se estiver tudo certo.
// permiteZero = true aceita o valor 0 (ex.: percentual de desconto).
function validarNumero(valor, nomeDoCampo, permiteZero) {
  if (isNaN(valor)) {
    return "Preencha o campo " + nomeDoCampo + ".";
  }
  if (valor < 0) {
    return "O campo " + nomeDoCampo + " não pode ser negativo.";
  }
  if (valor === 0 && !permiteZero) {
    return "O campo " + nomeDoCampo + " deve ser maior que zero.";
  }
  return "";
}

// Mostra uma mensagem de erro na área de resultado
function mostrarErro(idResultado, mensagem) {
  const area = document.getElementById(idResultado);
  area.classList.add("erro");
  area.innerHTML = "<p>" + mensagem + "</p>";
}

// Mostra o resultado (HTML) na área de resultado
function mostrarResultado(idResultado, html) {
  const area = document.getElementById(idResultado);
  area.classList.remove("erro");
  area.innerHTML = html;
}

// Formata um número como dinheiro: R$ 1.234,56
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ===== Calculadora de IMC =====

function calcularIMC() {
  const peso = lerNumero("imc-peso");
  const altura = lerNumero("imc-altura");

  // Validações: o operador || devolve o primeiro erro encontrado
  let erro = validarNumero(peso, "peso", false) || validarNumero(altura, "altura", false);
  if (!erro && altura > 3) {
    erro = "Informe a altura em metros (exemplo: 1.75).";
  }
  if (erro) {
    mostrarErro("resultado-imc", erro);
    return;
  }

  // Fórmula: peso / (altura * altura)
  const imc = peso / (altura * altura);

  // Classificação conforme o valor do IMC
  let classificacao;
  if (imc < 18.5) {
    classificacao = "Abaixo do peso";
  } else if (imc < 25) {
    classificacao = "Peso normal";
  } else if (imc < 30) {
    classificacao = "Sobrepeso";
  } else if (imc < 35) {
    classificacao = "Obesidade grau I";
  } else if (imc < 40) {
    classificacao = "Obesidade grau II";
  } else {
    classificacao = "Obesidade grau III";
  }

  mostrarResultado(
    "resultado-imc",
    "<p><strong>IMC: " + imc.toFixed(2) + "</strong></p>" +
    "<p>Classificação: " + classificacao + "</p>"
  );
}

// ===== Calculadora de Taxa Metabólica Basal =====

function calcularTMB() {
  const sexo = document.getElementById("tmb-sexo").value;
  const idade = lerNumero("tmb-idade");
  const peso = lerNumero("tmb-peso");
  const altura = lerNumero("tmb-altura");

  if (sexo === "") {
    mostrarErro("resultado-tmb", "Selecione o sexo.");
    return;
  }
  const erro =
    validarNumero(idade, "idade", false) ||
    validarNumero(peso, "peso", false) ||
    validarNumero(altura, "altura", false);
  if (erro) {
    mostrarErro("resultado-tmb", erro);
    return;
  }

  // Fórmula de Mifflin-St Jeor
  let tmb = (10 * peso) + (6.25 * altura) - (5 * idade);
  if (sexo === "masculino") {
    tmb = tmb + 5;
  } else {
    tmb = tmb - 161;
  }

  // Impede resultado inválido (valores muito fora do normal)
  if (tmb <= 0) {
    mostrarErro("resultado-tmb", "Os valores informados geraram um resultado inválido. Confira os dados.");
    return;
  }

  mostrarResultado(
    "resultado-tmb",
    "<p><strong>TMB: " + tmb.toFixed(0) + " kcal por dia</strong></p>" +
    "<p>É a energia que o corpo gasta em repouso.</p>"
  );
}

// ===== Calculadora de Salário Líquido =====

function calcularSalario() {
  const bruto = lerNumero("sal-bruto");
  const percentualINSS = lerNumero("sal-inss");
  const percentualIR = lerNumero("sal-ir");
  let outros = lerNumero("sal-outros");

  // "Outros descontos" é opcional: campo vazio vale 0
  if (isNaN(outros)) {
    outros = 0;
  }

  let erro =
    validarNumero(bruto, "salário bruto", false) ||
    validarNumero(percentualINSS, "INSS", true) ||
    validarNumero(percentualIR, "Imposto de Renda", true) ||
    validarNumero(outros, "outros descontos", true);

  if (!erro && (percentualINSS > 100 || percentualIR > 100)) {
    erro = "Os percentuais não podem ser maiores que 100.";
  }
  if (erro) {
    mostrarErro("resultado-salario", erro);
    return;
  }

  // Valores descontados
  const descontoINSS = bruto * percentualINSS / 100;
  const descontoIR = bruto * percentualIR / 100;
  const totalDescontos = descontoINSS + descontoIR + outros;

  if (totalDescontos > bruto) {
    mostrarErro("resultado-salario", "Os descontos somam mais que o salário bruto. Confira os valores.");
    return;
  }

  const liquido = bruto - totalDescontos;

  mostrarResultado(
    "resultado-salario",
    "<p>Desconto INSS: " + formatarMoeda(descontoINSS) + "</p>" +
    "<p>Desconto Imposto de Renda: " + formatarMoeda(descontoIR) + "</p>" +
    "<p>Outros descontos: " + formatarMoeda(outros) + "</p>" +
    "<p>Total de descontos: " + formatarMoeda(totalDescontos) + "</p>" +
    "<p><strong>Salário líquido: " + formatarMoeda(liquido) + "</strong></p>"
  );
}

// ===== Eventos: ligam cada botão à sua função =====

document.getElementById("botao-imc").addEventListener("click", calcularIMC);
document.getElementById("botao-tmb").addEventListener("click", calcularTMB);
document.getElementById("botao-salario").addEventListener("click", calcularSalario);
