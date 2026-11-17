const menu = document.getElementById("menu");
const menuBotao = document.getElementById("menuBotao");
const temaBotao = document.getElementById("temaBotao");
const modal = document.getElementById("modal");
const busca = document.getElementById("buscaTopo");
const dadosSalvos = ["usuarios", "emailLogado", "carrinho", "pedidos", "tema"];
for (let d = 0; d < dadosSalvos.length; d++) {
  const chave = dadosSalvos[d];
  if (sessionStorage.getItem(chave) != null) {
    localStorage.setItem(chave, sessionStorage.getItem(chave));
  }
  sessionStorage.removeItem(chave);
}
const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
const emailLogado = localStorage.getItem("emailLogado");
let usuarioLogado = usuarios.find(function (u) { return u.email == emailLogado; }) || null;
let carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
const pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");
for (let p = 0; p < pedidos.length; p++) {
  if (pedidos[p].status == "Preparando") { pedidos[p].status = "Em preparo"; }
}
let categoria = "Todos";

function salvar() {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  localStorage.setItem("emailLogado", usuarioLogado == null ? "" : usuarioLogado.email);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
}
function mostrar(pagina) {
  const arquivos = { inicio: "index.html", produtos: "cardapio.html", cadastro: "cadastro.html",
    carrinho: "carrinho.html", pedidos: "pedidos.html", perfil: "perfil.html", login: "login.html" };
  location.href = arquivos[pagina];
}
function abrirModal(titulo, texto) {
  document.getElementById("modalTitulo").textContent = titulo;
  document.getElementById("modalTexto").textContent = texto;
  modal.classList.add("aberto");
}
function avisar(titulo, texto, pagina) {
  sessionStorage.setItem("aviso", JSON.stringify({ titulo: titulo, texto: texto }));
  mostrar(pagina);
}
function abrirModalLogin(paginaVolta) {
  if (paginaAtual != "login") { sessionStorage.setItem("voltarLogin", paginaVolta || paginaAtual); }
  mostrar("login");
}
function paginaDepoisDoLogin() {
  const pagina = sessionStorage.getItem("voltarLogin") || "inicio";
  sessionStorage.removeItem("voltarLogin");
  return pagina;
}
menuBotao.onclick = function () {
  menu.classList.toggle("aberto");
  menuBotao.setAttribute("aria-expanded", menu.classList.contains("aberto") ? "true" : "false");
};
document.addEventListener("click", function (evento) {
  if (!evento.target.closest("nav")) {
    menu.classList.remove("aberto");
    menuBotao.setAttribute("aria-expanded", "false");
  }
});
document.addEventListener("keydown", function (evento) {
  if (evento.key == "Escape") {
    const painel = document.getElementById("carrinhoLateral");
    if (painel != null && painel.classList.contains("aberto")) {
      fecharPainelCarrinho();
      return;
    }
    menu.classList.remove("aberto");
    menuBotao.setAttribute("aria-expanded", "false");
    menuBotao.focus();
  }
});
if (localStorage.getItem("tema") == "escuro") { document.body.classList.remove("claro"); }
temaBotao.onclick = function () {
  document.body.classList.toggle("claro");
  const claro = document.body.classList.contains("claro");
  localStorage.setItem("tema", claro ? "claro" : "escuro");
};
document.getElementById("fecharModal").onclick = function () { modal.classList.remove("aberto"); };
let aviso = sessionStorage.getItem("aviso");
if (aviso) {
  sessionStorage.removeItem("aviso");
  aviso = JSON.parse(aviso);
  abrirModal(aviso.titulo, aviso.texto);
}
const btnEntrar = document.getElementById("btnEntrar");
const btnCadastrar = document.getElementById("btnCadastrar");
const btnEntrarMobile = document.getElementById("btnEntrarMobile");
const menuCadastrarMobile = document.getElementById("menuCadastrarMobile");
function atualizarMenu() {
  if (usuarioLogado == null) {
    btnEntrar.textContent = "Entrar";
    btnEntrar.href = "login.html";
    btnCadastrar.textContent = "Cadastrar";
    btnCadastrar.href = "cadastro.html";
    btnEntrarMobile.textContent = "Entrar";
    btnEntrarMobile.href = "login.html";
    menuCadastrarMobile.style.display = "";
  } else {
    btnEntrar.textContent = "Perfil";
    btnEntrar.href = "perfil.html";
    btnCadastrar.textContent = "Sair";
    btnCadastrar.href = "index.html";
    btnEntrarMobile.textContent = "Sair";
    btnEntrarMobile.href = "index.html";
    menuCadastrarMobile.style.display = "none";
  }
}
atualizarMenu();
function clicarSair(evento) {
  if (usuarioLogado != null) {
    evento.preventDefault();
    usuarioLogado = null;
    salvar();
    avisar("At\u00e9 logo!", "Voc\u00ea saiu da sua conta.", "inicio");
  }
}
btnCadastrar.onclick = clicarSair;
btnEntrarMobile.onclick = clicarSair;
const paginaAtual = document.querySelector("main section").id;
if (paginaAtual == "perfil" && usuarioLogado == null) { abrirModalLogin(); }
if (paginaAtual == "pedidos" && usuarioLogado == null) { abrirModalLogin(); }

function aplicarMascara(id, tipo) {
  const campo = document.getElementById(id);

  campo.oninput = function () {
    let v = campo.value;
    let n = v.replace(/\D/g, "");

    if (tipo == "nome") {
      v = v.replace(/[^A-Za-zÀ-ÿ ]/g, "");
    }

    if (tipo == "email") {
      v = v.replace(/ /g, "").toLowerCase();
    }

    if (tipo == "cpf") {
      n = n.substring(0, 11);
      n = n.replace(/(\d{3})(\d)/, "$1.$2");
      n = n.replace(/(\d{3})(\d)/, "$1.$2");
      n = n.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      v = n;
    }

    if (tipo == "telefone") {
      n = n.substring(0, 11);
      n = n.replace(/(\d{2})(\d)/, "($1) $2");
      n = n.replace(/(\d{4,5})(\d{4})$/, "$1-$2");
      v = n;
    }

    if (tipo == "cep") {
      n = n.substring(0, 8);
      n = n.replace(/(\d{5})(\d)/, "$1-$2");
      v = n;
    }

    if (tipo == "data") {
      n = n.substring(0, 8);
      n = n.replace(/(\d{2})(\d)/, "$1/$2");
      n = n.replace(/(\d{2})(\d)/, "$1/$2");
      v = n;
    }

    if (tipo == "numero") {
      v = n.substring(0, 6);
    }

    campo.value = v;
    campo.classList.remove("invalido");

    const erro = document.getElementById("erro-" + id);
    if (erro != null) { erro.innerHTML = ""; }

    const cont = document.getElementById("cont-" + id);
    if (cont != null) { cont.innerHTML = v.length + " / " + campo.maxLength; }
  };
}

const camposCad = [
  ["nome", "Nome completo", 50, "Seu nome", "text", "nome"],
  ["cpf", "CPF", 14, "000.000.000-00", "text", "cpf"],
  ["nascimento", "Data de nascimento", 10, "00/00/0000", "text", "data"],
  ["telefone", "Telefone", 15, "(00) 00000-0000", "text", "telefone"],
  ["email", "E-mail", 60, "voce@email.com", "text", "email"],
  ["cep", "CEP", 9, "00000-000", "text", "cep"],
  ["endereco", "Endereço", 80, "Rua e bairro", "text", ""],
  ["numero", "Número", 6, "000", "text", "numero"]
];

const camposSenha = [
  ["senha", "Senha", 20, "Mínimo 8 caracteres", "password", ""],
  ["confirmar", "Confirmar senha", 20, "Repita a senha", "password", ""]
];

function criarCampos(prefixo, lista) {
  let html = "";
  for (let i = 0; i < lista.length; i++) {
    const c = lista[i];
    const id = prefixo + c[0];
    html += '<div class="campo"><label for="' + id + '">' + c[1] + '</label>';
    html += '<input type="' + c[4] + '" id="' + id + '" maxlength="' + c[2] + '" placeholder="' + c[3] + '" autocomplete="off">';
    html += '<span class="erro" id="erro-' + id + '"></span>';
    html += '<span class="cont" id="cont-' + id + '">0 / ' + c[2] + '</span></div>';
  }
  return html;
}

function ligarMascaras(prefixo, lista) {
  for (let i = 0; i < lista.length; i++) {
    aplicarMascara(prefixo + lista[i][0], lista[i][5]);
  }
}

if (paginaAtual == "cadastro") {
  document.getElementById("camposCadastro").innerHTML = criarCampos("c-", camposCad) + criarCampos("c-", camposSenha);
  ligarMascaras("c-", camposCad);
  ligarMascaras("c-", camposSenha);
}
if (paginaAtual == "perfil" && usuarioLogado != null) {
  document.getElementById("camposPerfil").innerHTML = criarCampos("p-", camposCad);
  ligarMascaras("p-", camposCad);
}
if (paginaAtual == "login") { aplicarMascara("l-email", "email"); }

function validarData(v) {
  if (v.length != 10) { return false; }
  const p = v.split("/");
  const d = Number(p[0]);
  const m = Number(p[1]);
  const a = Number(p[2]);
  const x = new Date(a, m - 1, d);
  return x.getFullYear() == a && x.getMonth() == m - 1 && x.getDate() == d && a > 1900 && x < new Date();
}

function validarFormulario() {
  const prefixo = paginaAtual == "cadastro" ? "c-" : "p-";
  let tudoCerto = true;
  const nome = document.getElementById(prefixo + "nome");
  const cpf = document.getElementById(prefixo + "cpf");
  const nascimento = document.getElementById(prefixo + "nascimento");
  const telefone = document.getElementById(prefixo + "telefone");
  const email = document.getElementById(prefixo + "email");
  const cep = document.getElementById(prefixo + "cep");
  const endereco = document.getElementById(prefixo + "endereco");
  const numero = document.getElementById(prefixo + "numero");

  if (nome.value.trim().length < 5 || !nome.value.trim().includes(" ")) {
    nome.classList.add("invalido");
    document.getElementById("erro-" + prefixo + "nome").textContent = "Digite nome e sobrenome.";
    tudoCerto = false;
  }
  if (cpf.value.length != 14) {
    cpf.classList.add("invalido");
    document.getElementById("erro-" + prefixo + "cpf").textContent = "Digite os 11 números do CPF.";
    tudoCerto = false;
  }
  if (!validarData(nascimento.value)) {
    nascimento.classList.add("invalido");
    document.getElementById("erro-" + prefixo + "nascimento").textContent = "Data inválida.";
    tudoCerto = false;
  }
  if (telefone.value.length < 14) {
    telefone.classList.add("invalido");
    document.getElementById("erro-" + prefixo + "telefone").textContent = "Digite o telefone com DDD.";
    tudoCerto = false;
  }
  if (!email.value.includes("@") || !email.value.includes(".")) {
    email.classList.add("invalido");
    document.getElementById("erro-" + prefixo + "email").textContent = "Digite um e-mail válido.";
    tudoCerto = false;
  }
  if (cep.value.length != 9) {
    cep.classList.add("invalido");
    document.getElementById("erro-" + prefixo + "cep").textContent = "CEP incompleto.";
    tudoCerto = false;
  }
  if (endereco.value.trim().length < 5) {
    endereco.classList.add("invalido");
    document.getElementById("erro-" + prefixo + "endereco").textContent = "Digite o endereço.";
    tudoCerto = false;
  }
  if (numero.value.length == 0) {
    numero.classList.add("invalido");
    document.getElementById("erro-" + prefixo + "numero").textContent = "Digite o número.";
    tudoCerto = false;
  }

  if (paginaAtual == "cadastro") {
    const senha = document.getElementById("c-senha");
    const confirmar = document.getElementById("c-confirmar");
    if (senha.value.length < 8) {
      senha.classList.add("invalido");
      document.getElementById("erro-c-senha").textContent = "Mínimo de 8 caracteres.";
      tudoCerto = false;
    }
    if (confirmar.value != senha.value) {
      confirmar.classList.add("invalido");
      document.getElementById("erro-c-confirmar").textContent = "As senhas não coincidem.";
      tudoCerto = false;
    }
  }
  return tudoCerto;
}

if (paginaAtual == "cadastro") {
document.getElementById("formCadastro").onsubmit = function (evento) {
  evento.preventDefault();

  if (!validarFormulario()) {
    abrirModal("Confira os campos", "Alguns campos estão incorretos. Corrija e envie de novo.");
    return;
  }

  const email = document.getElementById("c-email").value;
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email == email) {
      document.getElementById("c-email").classList.add("invalido");
      document.getElementById("erro-c-email").innerHTML = "E-mail já cadastrado.";
      return;
    }
  }

  const usuario = {};
  for (let j = 0; j < camposCad.length; j++) {
    usuario[camposCad[j][0]] = document.getElementById("c-" + camposCad[j][0]).value;
  }
  usuario.senha = document.getElementById("c-senha").value;

  usuarios.push(usuario);
  usuarioLogado = usuario;
  salvar();
  const destino = sessionStorage.getItem("voltarLogin") ? paginaDepoisDoLogin() : "produtos";
  avisar("Cadastro realizado!", "Bem-vindo(a), " + usuario.nome + ".", destino);
};
}

if (paginaAtual == "login") {
document.getElementById("formLogin").onsubmit = function (evento) {
  evento.preventDefault();

  const email = document.getElementById("l-email").value;
  const senha = document.getElementById("l-senha").value;
  document.getElementById("erro-l-email").innerHTML = "";
  document.getElementById("erro-l-senha").innerHTML = "";

  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email == email && usuarios[i].senha == senha) {
      usuarioLogado = usuarios[i];
      salvar();
      avisar("Login realizado!", "Bem-vindo(a) de volta, " + usuarioLogado.nome + ".", paginaDepoisDoLogin());
      return;
    }
  }

  document.getElementById("erro-l-senha").innerHTML = "E-mail ou senha incorretos.";
};
}

function preencherPerfil() {
  for (let i = 0; i < camposCad.length; i++) {
    const id = camposCad[i][0];
    const campo = document.getElementById("p-" + id);
    campo.value = usuarioLogado[id];
    campo.classList.remove("invalido");
    document.getElementById("erro-p-" + id).innerHTML = "";
    document.getElementById("cont-p-" + id).innerHTML = campo.value.length + " / " + campo.maxLength;
  }
}

if (paginaAtual == "perfil") {
document.getElementById("formPerfil").onsubmit = function (evento) {
  evento.preventDefault();

  if (!validarFormulario()) {
    abrirModal("Confira os campos", "Alguns campos estão incorretos. Corrija e salve de novo.");
    return;
  }

  for (let i = 0; i < camposCad.length; i++) {
    const id = camposCad[i][0];
    usuarioLogado[id] = document.getElementById("p-" + id).value;
  }
  salvar();
  abrirModal("Dados salvos!", "Seu perfil foi atualizado.");
};
}

function filtrarProdutos() {
  if (paginaAtual != "produtos") { return; }
  const cards = document.getElementById("product").getElementsByClassName("productcard");
  const texto = busca.value.toLowerCase();
  let visiveis = 0;

  for (let i = 0; i < cards.length; i++) {
    const achouTexto = cards[i].textContent.toLowerCase().includes(texto);
    const achouCat = categoria == "Todos" || cards[i].dataset.cat == categoria;

    if (achouTexto && achouCat) {
      cards[i].style.display = "block";
      visiveis = visiveis + 1;
    } else {
      cards[i].style.display = "none";
    }
  }

  if (visiveis == 0) {
    document.getElementById("semResultado").style.display = "block";
  } else {
    document.getElementById("semResultado").style.display = "none";
  }
}

if (paginaAtual == "produtos") { busca.oninput = filtrarProdutos; }
document.getElementById("formBusca").onsubmit = function (evento) {
  evento.preventDefault();
  if (paginaAtual == "produtos") {
    filtrarProdutos();
  } else {
    sessionStorage.setItem("buscaProduto", busca.value);
    mostrar("produtos");
  }
};

function selecionarCategoria(nome) {
  categoria = nome;

  const todos = document.getElementsByClassName("filtro");
  for (let j = 0; j < todos.length; j++) {
    if (todos[j].dataset.cat == nome) {
      todos[j].classList.add("marcado");
    } else {
      todos[j].classList.remove("marcado");
    }
  }
  filtrarProdutos();
}

function criarFiltro(botao) {
  botao.onclick = function () {
    selecionarCategoria(botao.dataset.cat);
  };
}

function criarChipHome(botao) {
  botao.onclick = function () {
    sessionStorage.setItem("categoriaProduto", botao.dataset.cat);
    mostrar("produtos");
  };
}

const chipsHome = document.getElementsByClassName("chiphome");
for (let h = 0; h < chipsHome.length; h++) {
  criarChipHome(chipsHome[h]);
}

if (paginaAtual == "produtos") {
  busca.value = sessionStorage.getItem("buscaProduto") || "";
  categoria = sessionStorage.getItem("categoriaProduto") || "Todos";
  sessionStorage.removeItem("buscaProduto");
  sessionStorage.removeItem("categoriaProduto");
}
const filtros = document.getElementsByClassName("filtro");
for (let f = 0; f < filtros.length; f++) { criarFiltro(filtros[f]); }
if (paginaAtual == "produtos") { selecionarCategoria(categoria); }

function real(valor) {
  return "R$ " + valor.toFixed(2).replace(".", ",");
}

const imagensProdutos = {
  "Clássico Brasa": "classico-brasa.jpg",
  "Cheddar Bacon": "cheddar-bacon.jpg",
  "Duplo Smash": "duplo-smash.jpg",
  "Brasa Picante": "brasa-picante.jpg",
  "Frango Crocante": "frango-crocante.jpg",
  "Veggie Grill": "veggie-grill.jpg",
  "Combo Dupla": "combo-dupla.jpg",
  "Combo Família": "combo-familia.jpg"
};

function adicionar(nome, preco, qtd) {
  for (let i = 0; i < carrinho.length; i++) {
    if (carrinho[i].nome == nome) {
      carrinho[i].qtd = carrinho[i].qtd + qtd;
      atualizarContador();
      salvar();
      return;
    }
  }
  carrinho.push({ nome: nome, preco: preco, qtd: qtd });
  atualizarContador();
  salvar();
}

function criarAdicionar(botao) {
  botao.onclick = function () {
    adicionar(botao.dataset.nome, Number(botao.dataset.preco), 1);
    desenharCarrinho();
    abrirPainelCarrinho(botao);
  };
}

const botoesAdd = document.getElementsByClassName("btnadd");
for (let b = 0; b < botoesAdd.length; b++) {
  criarAdicionar(botoesAdd[b]);
}

let ultimoBotaoCarrinho = null;
if (botoesAdd.length > 0) {
  document.getElementById("fundoCarrinho").onclick = fecharPainelCarrinho;
  document.getElementById("fecharPainelCarrinho").onclick = fecharPainelCarrinho;
  document.getElementById("finalizarPainel").onclick = function () {
    finalizarPedido(document.getElementById("pagamentoPainel").value);
  };
  document.querySelector(".menucarrinho").onclick = function (evento) {
    evento.preventDefault();
    desenharCarrinho();
    abrirPainelCarrinho(this);
  };
}

function abrirPainelCarrinho(botao) {
  const painel = document.getElementById("carrinhoLateral");
  if (painel == null) { return; }
  ultimoBotaoCarrinho = botao;
  painel.classList.add("aberto");
  painel.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("fecharPainelCarrinho").focus();
}

function fecharPainelCarrinho() {
  const painel = document.getElementById("carrinhoLateral");
  if (painel == null) { return; }
  painel.classList.remove("aberto");
  painel.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (ultimoBotaoCarrinho != null) { ultimoBotaoCarrinho.focus(); }
}

function atualizarContador() {
  let soma = 0;
  for (let i = 0; i < carrinho.length; i++) {
    soma = soma + carrinho[i].qtd;
  }
  document.getElementById("contadorCarrinho").innerHTML = soma;
}

function mudarQtd(posicao, mudanca) {
  carrinho[posicao].qtd = carrinho[posicao].qtd + mudanca;
  if (carrinho[posicao].qtd <= 0) {
    carrinho.splice(posicao, 1);
  }
  atualizarContador();
  desenharCarrinho();
  salvar();
}

function remover(posicao) {
  carrinho.splice(posicao, 1);
  atualizarContador();
  desenharCarrinho();
  salvar();
}

function desenharCarrinho() {
  let html = "";
  let subtotal = 0;

  for (let i = 0; i < carrinho.length; i++) {
    const item = carrinho[i];
    subtotal = subtotal + item.preco * item.qtd;

    html += '<div class="itemcarrinho"><div class="mini">';
    if (imagensProdutos[item.nome]) { html += '<img src="imagens/' + imagensProdutos[item.nome] + '" alt="">'; }
    html += '</div>';
    html += '<div class="info"><b>' + item.nome + '</b><br>' + real(item.preco) + '</div>';
    html += '<div class="qtd"><button onclick="mudarQtd(' + i + ', -1)" aria-label="Diminuir">−</button>';
    html += '<b>' + item.qtd + '</b>';
    html += '<button onclick="mudarQtd(' + i + ', 1)" aria-label="Aumentar">+</button></div>';
    html += '<button class="btnremover" onclick="remover(' + i + ')">Remover</button></div>';
  }

  if (carrinho.length == 0) {
    html = '<div class="vazio"><p>Seu carrinho está vazio.</p><button class="botao" onclick="mostrar(\'produtos\')">Ver cardápio</button></div>';
  }

  let taxa = 0;
  if (subtotal > 0) { taxa = 6; }

  const listaPagina = document.getElementById("listaCarrinho");
  const listaPainel = document.getElementById("listaPainelCarrinho");
  if (listaPagina != null) { listaPagina.innerHTML = html; }
  if (listaPainel != null) { listaPainel.innerHTML = html; }

  const fotosCarrinho = document.querySelectorAll(".mini img");
  for (let j = 0; j < fotosCarrinho.length; j++) { esconderImagemQueFalhou(fotosCarrinho[j]); }

  if (listaPagina != null) {
    document.getElementById("subtotal").innerHTML = real(subtotal);
    document.getElementById("entrega").innerHTML = real(taxa);
    document.getElementById("total").innerHTML = real(subtotal + taxa);
  }
  if (listaPainel != null) {
    document.getElementById("subtotalPainel").innerHTML = real(subtotal);
    document.getElementById("entregaPainel").innerHTML = real(taxa);
    document.getElementById("totalPainel").innerHTML = real(subtotal + taxa);
    document.getElementById("finalizarPainel").disabled = carrinho.length == 0;
  }
}

function finalizarPedido(pagamento) {
  if (carrinho.length == 0) {
    abrirModal("Carrinho vazio", "Adicione algum lanche antes de finalizar.");
    return;
  }

  if (usuarioLogado == null) {
    abrirModalLogin("carrinho");
    return;
  }

  let total = 6;
  let resumo = "";
  for (let i = 0; i < carrinho.length; i++) {
    total = total + carrinho[i].preco * carrinho[i].qtd;
    resumo += carrinho[i].qtd + "x " + carrinho[i].nome;
    if (i < carrinho.length - 1) { resumo += ", "; }
  }

  const agora = new Date();
  const dataLocal = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
  const codigo = "SITE-" + agora.getTime() + "-" + Math.random().toString(36).slice(2, 8);

  pedidos.unshift({
    numero: 1000 + pedidos.length + 1,
    data: agora.toLocaleDateString("pt-BR"),
    dataJson: dataLocal,
    codigo: codigo,
    cliente: usuarioLogado.nome,
    telefone: usuarioLogado.telefone.replace(/\D/g, ""),
    endereco: usuarioLogado.endereco + ", " + usuarioLogado.numero,
    pagamento: pagamento,
    resumo: resumo,
    itens: carrinho,
    taxaEntrega: 6,
    total: total,
    status: "Em preparo"
  });

  carrinho = [];
  atualizarContador();
  salvar();
  avisar("Pedido realizado!", "Seu pedido já está sendo preparado.", "pedidos");
}

if (paginaAtual == "carrinho") { document.getElementById("finalizar").onclick = function () {
  finalizarPedido(document.getElementById("pagamento").value);
}; }

function baixarPedidos() {
  const exportados = [];

  for (let i = 0; i < pedidos.length; i++) {
    const pedido = pedidos[i];
    if (!pedido.codigo || !pedido.dataJson || !pedido.cliente || !pedido.telefone || !pedido.endereco) { continue; }
    let subtotal = 0;
    for (let k = 0; k < pedido.itens.length; k++) {
      subtotal += pedido.itens[k].preco * pedido.itens[k].qtd;
    }
    const taxaEntrega = Math.round((pedido.total - subtotal) * 100) / 100;

    for (let j = 0; j < pedido.itens.length; j++) {
      const item = pedido.itens[j];
      const taxaItem = j == 0 ? taxaEntrega : 0;
      exportados[exportados.length] = {
        Codigo: pedido.codigo + "-" + (j + 1),
        Data: pedido.dataJson,
        Cliente: pedido.cliente,
        Telefone: pedido.telefone,
        Endereco: pedido.endereco,
        Produto: item.nome,
        Quantidade: item.qtd,
        Preco: item.preco,
        TaxaEntrega: taxaItem,
        Pagamento: pedido.pagamento,
        Total: Math.round((item.preco * item.qtd + taxaItem) * 100) / 100
      };
    }
  }

  if (exportados.length == 0) {
    abrirModal("Nenhum pedido para exportar", "Finalize um novo pedido para gerar o arquivo JSON. Pedidos antigos não têm os dados necessários.");
    return;
  }

  const arquivo = new Blob([JSON.stringify(exportados, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(arquivo);
  link.download = "pedidos.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

if (paginaAtual == "pedidos" && usuarioLogado != null) {
  document.getElementById("exportarPedidos").onclick = baixarPedidos;
}

function desenharPedidos() {
  const texto = document.getElementById("buscaPedido").value.toLowerCase();
  let html = "";

  for (let i = 0; i < pedidos.length; i++) {
    const p = pedidos[i];
    const tudo = (p.numero + " " + p.resumo).toLowerCase();

    if (tudo.includes(texto)) {
      html += '<div class="pedido"><b>Pedido #' + p.numero + '</b> - ' + p.data + ' - ' + p.pagamento + '<br>';
      html += p.resumo + '<br><b>Total: ' + real(p.total) + '</b> ';
      html += '<span class="status">' + p.status + '</span><br>';
      html += '<button class="botao contorno" onclick="repetir(' + i + ')">Pedir novamente</button></div>';
    }
  }

  if (html == "") {
    html = '<div class="vazio"><p>Nenhum pedido encontrado.</p></div>';
  }
  document.getElementById("listaPedidos").innerHTML = html;
}

if (paginaAtual == "pedidos" && usuarioLogado != null) { document.getElementById("buscaPedido").oninput = desenharPedidos; }

function repetir(posicao) {
  const itens = pedidos[posicao].itens;
  for (let i = 0; i < itens.length; i++) {
    adicionar(itens[i].nome, itens[i].preco, itens[i].qtd);
  }
  mostrar("carrinho");
}

function esconderImagemQueFalhou(foto) {
  foto.onerror = function () { foto.style.display = "none"; };
  if (foto.complete && foto.naturalWidth == 0) { foto.style.display = "none"; }
}

const fotos = document.getElementsByClassName("img");
for (let k = 0; k < fotos.length; k++) {
  esconderImagemQueFalhou(fotos[k].getElementsByTagName("img")[0]);
}
if (paginaAtual == "inicio") { esconderImagemQueFalhou(document.getElementById("hero-img").getElementsByTagName("img")[0]); }
atualizarContador();
if (paginaAtual == "carrinho" || botoesAdd.length > 0) { desenharCarrinho(); }
if (paginaAtual == "pedidos" && usuarioLogado != null) { desenharPedidos(); }
if (paginaAtual == "perfil" && usuarioLogado != null) { preencherPerfil(); }
