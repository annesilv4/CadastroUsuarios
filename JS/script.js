// Evitando o envio do formulário
document.getElementById("cadastro-pessoal").addEventListener("submit", (e) => {
  e.preventDefault();
});

// Função para salvar os dados do formulário
const form = document.getElementById("cadastro-pessoal");

function salvarDados() {
  const dados = {}; // ← usa objeto, não array
  const inputs = form.querySelectorAll("input");

  inputs.forEach((input) => {
    dados[input.name] = input.value;
  });

  localStorage.setItem("cadastroPessoal", JSON.stringify(dados));
}

// Carregar os dados salvos ao abrir a página
window.addEventListener("DOMContentLoaded", () => {
  const dadosSalvos = JSON.parse(localStorage.getItem("cadastroPessoal")); // ← corrigido getItem

  if (dadosSalvos) {
    Object.keys(dadosSalvos).forEach((campo) => {
      const input = form.querySelector(`[name="${campo}"]`);
      if (input) input.value = dadosSalvos[campo];
    });
  }
});

// Salvar sempre que digitar algo
form.addEventListener("input", salvarDados);

// Capturando os dados do usuário
// Nome
document.getElementById("name").addEventListener("blur", (e) => {
  const nameElement = e.target;
  const nameValue = nameElement.value;

  salvarDados();
});

// CPF
document.getElementById("cpf").addEventListener("input", (e) => {
  const cpfElement = e.target;
  let cpfValue = cpfElement.value;

  // remove tudo que não for número
  cpfValue = cpfValue.replace(/\D/g, "");

  // limita a 11 dígitos
  cpfValue = cpfValue.substring(0, 11);

  // aplica a máscara de CPF
  if (cpfValue.length > 9) {
    cpfValue = cpfValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else if (cpfValue.length > 6) {
    cpfValue = cpfValue.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
  } else if (cpfValue.length > 3) {
    cpfValue = cpfValue.replace(/(\d{3})(\d+)/, "$1.$2");
  }

  // atualiza o campo
  cpfElement.value = cpfValue;
  salvarDados()
});

// RG
const rgNumber = document.getElementById("registro-geral");
const rgDV = document.getElementById("registro-geral-dv");

rgNumber.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/\D/g, "");
  if (e.target.value.length === e.target.maxLength) {
    rgDV.focus();
  }
  salvarDados();
});

rgDV.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/[^0-9Xx]/g, "").toUpperCase();
  salvarDados();
});

// Data de Nascimento
document.getElementById("data-nascimento").addEventListener("blur", (e) => {
  const dateElement = e.target;
  const dateValue = dateElement.value;
  salvarDados();
});

// Telefone
document.getElementById("telefone").addEventListener("input", (e) => {
  const phoneElement = e.target;
  let phoneValue = phoneElement.value;

  // remove tudo que não for número
  phoneValue = phoneValue.replace(/\D/g, "");

  // se for celular (11 dígitos) -> (99) 99999-9999
  if (phoneValue.length === 11) {
    phoneValue = phoneValue.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  // se for fixo (10 dígitos) -> (99) 9999-9999
  else if (phoneValue.length === 10) {
    phoneValue = phoneValue.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  // atualiza o campo
  phoneElement.value = phoneValue;
  salvarDados();
});

// E-mail
document.getElementById("e-mail").addEventListener("blur", (e) => {
  const emailElement = e.target;
  const emailValue = emailElement.value;
  salvarDados();
});

// CEP
// Formatação do CEP
document.getElementById("cep").addEventListener("input", (e) => {
  const cepElement = e.target;
  let cepValue = cepElement.value;

  // Removendo tudo que não for número
  cepValue = cepValue.replace(/\D/g, "");

  if (cepValue.length > 5) {
    cepValue = cepValue.replace(/(\d{5})(\d)/, "$1-$2");
  }

  cepElement.value = cepValue;
  salvarDados();
});

// Retirando o hifen e buscando o CEP na API
document.getElementById("cep").addEventListener("input", (e) => {
  const cepElement = e.target;
  let cepValue = cepElement.value;

  // Removendo o hífen para a consulta
  cepValue = cepValue.replace(/\D/g, "");

  // Verificando se o CEP é válido
  if (!(cepValue.length === 8)) {
    return;
  }

  // Fazendo a requisição para a API ViaCEP
  fetch(`https://viacep.com.br/ws/${cepValue}/json/`)
    .then((response) => response.json())
    .then((data) => {
      if (!data.erro) {
        // Preenchendo os campos de endereço
        document.getElementById("logradouro").value = data.logradouro;
        document.getElementById("bairro").value = data.bairro;
        document.getElementById("cidade").value = data.localidade;
        document.getElementById("estado").value = data.uf;
      } else {
        alert("CEP não encontrado.");
      }
    })
    .catch((error) => console.error("Erro ao buscar o CEP:", error));
});
