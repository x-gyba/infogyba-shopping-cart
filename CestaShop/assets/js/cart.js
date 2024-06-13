/* Carrinho de Compras Javascript */
/* Autor: Clayton Campos - Infogyba Soluções em Ti */

/* Esperamos que todos os elementos da página sejam carregados */
function ready() {
  /* adicionamos funcionalidade adicionar item ao carrinho */
  var adicionarCarrinhoBtn = document.getElementsByClassName("add-cart");
  for (var i = 0; i < adicionarCarrinhoBtn.length; i++) {
    var button = adicionarCarrinhoBtn[i];
    button.addEventListener("click", adicionarCarrinhoClicked);
  }

  /* adicionamos funcionalidade aos botões de remoção do carrinho */
  var removeItemBtn = document.getElementsByClassName("remover-btn");
  for (var i = 0; i < removeItemBtn.length; i++) {
    var button = removeItemBtn[i];
    button.addEventListener("click", EliminarItemCarrinho);
  }

  /* botão adicionar quantidade */
  var SomaQtdBtn = document.getElementsByClassName("SomaQtd");
  for (var i = 0; i < SomaQtdBtn.length; i++) {
    var button = SomaQtdBtn[i];
    button.addEventListener("click", somaQtd);
  }

  /* botão diminuir quantidade */
  var MenosQtdBtn = document.getElementsByClassName("MenosQtd");
  for (var i = 0; i < MenosQtdBtn.length; i++) {
    var button = MenosQtdBtn[i];
    button.addEventListener("click", MenosQtd);
  }

  /* botão pagar (checkout) */
  document.querySelector(".btn-checkout").addEventListener("click", checkout);

  /* remove o item selecionado do carrinho */
  function EliminarItemCarrinho(event) {
    var buttonClicked = event.target.closest(".carrinho-item");
    buttonClicked.remove();

    /* atualizamos o total do carrinho após item ser eliminado */
    atualizarTotalCarrinho();
    atualizaCarrinhoQtd();
    checkCarrinhoVazio();
  }

  /* Atualiza total do carrinho */
  function atualizarTotalCarrinho() {
    /* seleciona o conteudo do carrinho */
    var carrinhoContainer = document.getElementsByClassName("carrinho")[0];
    var carrinhoItems = carrinhoContainer.getElementsByClassName(
      "carrinho-item"
    );
    var total = 0;

    /* atualiza o total do carrinho */
    for (var i = 0; i < carrinhoItems.length; i++) {
      var item = carrinhoItems[i];
      var precoElemento = item.getElementsByClassName("carrinho-item-preco")[0];
      var qtdItem = item.getElementsByClassName("carrinho-item-qtd")[0];

      if (precoElemento && qtdItem) {
        /* mostra o símbolo da moeda no carrinho */
        var preco = parseFloat(
          precoElemento.innerHTML.replace("R$", "").replace(",", ".")
        );
        var quantity = parseInt(qtdItem.value);
        total += preco * quantity;
      }
    }

    total = Math.round(total * 100) / 100;
    document.getElementsByClassName("carrinho-preco-total")[0].innerHTML =
      "R$ " + total.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  }

  /* aumenta em 1 a quantidade do elemento selecionado */
  function somaQtd(event) {
    var buttonClicked = event.target.closest(".carrinho-item");
    var itemQtdInput = buttonClicked.querySelector(".carrinho-item-qtd");
    var qtdAtual = parseInt(itemQtdInput.value);
    qtdAtual++;
    itemQtdInput.value = qtdAtual;
    atualizarTotalCarrinho();
  }

  /* diminui em 1 a quantidade do elemento selecionado */
  function MenosQtd(event) {
    var buttonClicked = event.target.closest(".carrinho-item");
    var itemQtdInput = buttonClicked.querySelector(".carrinho-item-qtd");
    var qtdAtual = parseInt(itemQtdInput.value);
    qtdAtual--;
    /* controla que valor não seja menor que 1 */
    if (qtdAtual >= 1) {
      itemQtdInput.value = qtdAtual;
      atualizarTotalCarrinho();
    }
  }

  /* adiciona um item ao carrinho */
  function adicionarCarrinhoClicked(event) {
    var button = event.target;
    var item = button.parentElement;
    var titulo = item.getElementsByClassName("titulo-item")[0].innerHTML;
    var preco = item.getElementsByClassName("preco-item")[0].innerHTML;
    var imagemSrc = item.getElementsByClassName("img-item")[0].src;

    /* adiciona um item ao carrinho */
    adicionarItemsCarrinho(titulo, preco, imagemSrc);
  }

  function adicionarItemsCarrinho(titulo, preco, imagemSrc) {
    var item = document.createElement("div");
    item.classList.add("carrinho-item");
    var itemsCarrinho = document.getElementsByClassName("carrinho-items")[0];

    /* verifica se o item se encontra no carrinho */
    var nomeItemsCarrinho = itemsCarrinho.getElementsByClassName(
      "carrinho-item-titulo"
    );
    for (var i = 0; i < nomeItemsCarrinho.length; i++) {
      if (nomeItemsCarrinho[i].innerText === titulo) {
        alert("ESTE ITEM JÁ SE ENCONTRA NO CARRINHO.");
        return;
      }
    }

    var itemConteudo = `
      <img src="${imagemSrc}" alt="image" width="80px" />
      <span class="carrinho-item-titulo">${titulo}</span>
      <span class="carrinho-item-preco">${preco}</span>
      <div class="quantity">
        <button class="plus-btn SomaQtd" type="button" name="button" value="1">
          <i class="bx bx-plus-circle"></i>
        </button>
        <input type="text" class="carrinho-item-qtd" value="1">
        <button class="minus-btn MenosQtd" type="button" name="button" value="1">
          <i class="bx bx-minus-circle"></i>
        </button>
        <button class="remover-btn"><i class="bx bxs-trash"></i></button>
      </div>
    `;
    item.innerHTML = itemConteudo;
    itemsCarrinho.append(item);

    /* adicionar eventos para os botões do novo item */
    item
      .querySelector(".remover-btn")
      .addEventListener("click", EliminarItemCarrinho);
    item.querySelector(".SomaQtd").addEventListener("click", somaQtd);
    item.querySelector(".MenosQtd").addEventListener("click", MenosQtd);

    /* atualiza o total do carrinho */
    atualizarTotalCarrinho();
    atualizaCarrinhoQtd();
    checkCarrinhoVazio();
  }

  /* Verifica se o carrinho está vazio */
  function checkCarrinhoVazio() {
    var cartItems = document.querySelector(".carrinho-items").children.length;
    if (cartItems === 0) {
      document.querySelector(".carrinho").classList.add("empty");
      alert("SEU CARRINHO ESTÁ VAZIO.");
      document.querySelector(".carrinho-preco-total").innerHTML = "R$ 0,00"; // Reset total
    } else {
      document.querySelector(".carrinho").classList.remove("empty");
    }
  }

  /* Atualiza quantidade do carrinho */
  function atualizaCarrinhoQtd() {
    var cartItems = document.querySelectorAll(".carrinho-item").length;
    document.querySelector(
      "#cart-btn .carrinho-item-qtd"
    ).innerText = cartItems; // Update quantity in shopping bag icon
  }

  /* botão pagar (checkout) */
  function checkout() {
    var total = parseFloat(
      document
        .querySelector(".carrinho-preco-total")
        .innerText.replace("R$", "")
        .replace(",", ".")
    );
    if (total === 0) {
      alert("SEU CARRINHO ESTÁ VAZIO.");
      return; // Prevents checkout if cart is empty
    }

    alert(
      "OBRIGADO PELA SUA COMPRA, VOCÊ SERÁ DIRECIONADO A PÁGINA DE PAGAMENTO."
    );
    var cartItems = document.querySelector(".carrinho-items");
    cartItems.innerHTML = ""; // Clear cart items
    document.querySelector(".carrinho-preco-total").innerHTML = "R$ 0,00"; // Reset total
    atualizaCarrinhoQtd(); // Update quantity in shopping bag icon
  }
}

/* Espera o DOM estar totalmente carregado antes de executar o script */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}
