/* Verifique se as variáveis ​​já existem antes de declará-las */
if (typeof isDiscountApplied === "undefined") {
    var isDiscountApplied = false;
}

/* Use var em vez de const/let para elementos que podem ser declarados em outro lugar */
var authFormsContainer = document.querySelector(".auth-forms-container");
var signupForm = document.getElementById("signup");
var signinForm = document.getElementById("signin");
var signupBtn = document.getElementById("signup-btn");
var signBtn = document.getElementById("sign-btn");
var confirmationMessage = document.getElementById("confirmation-message");
var confirmYesButton = document.getElementById("confirm-yes");
var confirmNoButton = document.getElementById("confirm-no");
var discountForm = document.querySelector(".discount-form-container");
var validDiscountCodes = ["DESCONTO10"];
var messages = {
    discountApplied: "Você ganhou 10% de desconto!",
    discountAlreadyApplied: "Desconto já aplicado!",
    invalidDiscountCode: "Código de desconto inválido.",
};

/* Função para alternar entre formulários de inscrição e login */
function toggleForms() {
  if (signinForm.style.display === "none") {
    signinForm.style.display = "block";
    signupForm.style.display = "none";
  } else {
    signinForm.style.display = "none";
    signupForm.style.display = "block";
  }
}

/* Event listeners para alternar entre formulários */
signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

signBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

/* Inicializa a página com o formulário de login visível */
signinForm.style.display = "block";
signupForm.style.display = "none";

/* Função para alternar a visibilidade da senha */
function togglePasswordVisibility(formType, passwordFieldId) {
  const passwordField = document.getElementById(passwordFieldId);
  const toggleIconShow = document.getElementById("eyeicon-show-" + formType);
  const toggleIconHide = document.getElementById("eyeicon-hide-" + formType);

  if (passwordField.type === "password") {
    passwordField.type = "text"; // Show password
    toggleIconShow.style.display = "none";
    toggleIconHide.style.display = "inline";
  } else {
    passwordField.type = "password"; // Hide password
    toggleIconShow.style.display = "inline";
    toggleIconHide.style.display = "none";
  }
}

// Função para atualizar a barra de progresso e os ícones dos passos
function updateProgressBarAndIcons(step) {
  // Reset classes
  $(".circle").removeClass("active");
  $(".progress-bar-inner").removeClass("active"); // Remove a classe active inicialmente
  $(".progress-bar-inner").css("width", "0%"); // A largura da barra é 0% no começo

  // Atualiza a parte interna da barra de progresso e os ícones conforme o passo
  if (step === 1) {
    $("#step1-icon").addClass("active");
    $(".progress-bar-inner").css({
      width: "33%",
      "background-color": "var(--violet)", // Cor inicial da barra de progresso (violeta)
    });
  } else if (step === 2) {
    $("#step1-icon").addClass("active");
    $("#step2-icon").addClass("active");
    $(".progress-bar-inner").css({
      width: "50%", // A barra agora fica em 50% para o Passo 2
      "background-color": "var(--green)", // Cor verde no passo 2
    });
  } else if (step === 3) {
    $("#step1-icon").addClass("active");
    $("#step2-icon").addClass("active");
    $("#step3-icon").addClass("active");
    $(".progress-bar-inner").css({
      width: "50%", // A barra fica com 50% no Passo 3
      "background-color": "var(--violet)", // Cor violeta no passo 3
    });
  }
}

// Lógica de login
$("#signin-form").on("submit", function (e) {
  e.preventDefault();
  $.ajax({
    url: "", // Adicione a URL de envio do formulário
    type: "POST",
    data: {
      signin: true,
      email: $("#signin-email").val(),
      senha: $("#signin-senha").val(),
    },
    success: function (response) {
      if (response === "admin") {
        window.location.href = "dashboard.php"; // Redireciona para o painel de administração
      } else if (response === "success") {
        updateProgressBarAndIcons(2);
        $("#step1").fadeOut(() => {
          $("#step2").fadeIn();
        });
        currentStep = 2;
      } else {
        alert(response); // Exibe a resposta do servidor, se o login falhar
      }
    },
    error: function () {
      alert("Erro ao processar o login.");
    },
  });
});

// Avançar entre os passos
$("#next").on("click", function () {
  if (currentStep === 1) {
    $("#step1").fadeOut(function () {
      $("#step2").fadeIn();
    });
    updateProgressBarAndIcons(2); // Atualiza o progresso para Passo 2 (50%)
    currentStep = 2; // Atualiza o passo atual
  } else if (currentStep === 2) {
    $("#step2").fadeOut(function () {
      $("#step3").fadeIn();
    });
    updateProgressBarAndIcons(3); // Atualiza o progresso para Passo 3 (50%) com cor violeta
    currentStep = 3; // Atualiza o passo atual
  }
});

// Voltar entre os passos
$("#prev").on("click", function () {
  if (currentStep === 2) {
    $("#step2").fadeOut(function () {
      $("#step1").fadeIn();
    });
    updateProgressBarAndIcons(1); // Atualiza o progresso para Passo 1 (33%)
    currentStep = 1; // Atualiza o passo atual
  } else if (currentStep === 3) {
    $("#step3").fadeOut(function () {
      $("#step2").fadeIn();
    });
    updateProgressBarAndIcons(2); // Atualiza o progresso para Passo 2 (50%)
    currentStep = 2; // Atualiza o passo atual
  }
});

// Inicializa as etapas com o estilo correto (passo 1)
updateProgressBarAndIcons(1); // Inicializa o passo 1 com 33% e cor violeta

/* Função para aplicar desconto */
function applyDiscount(discountCode) {
  if (isDiscountApplied) {
    showMessage(messages.discountAlreadyApplied, "error");
    return;
  }

  const code =
    discountCode || document.querySelector(".discount-input")?.value.trim();
  const totalElement = document.querySelector(".total-title");

  if (!totalElement) {
    console.error("Total element not found");
    return;
  }
  const cartSummary = document.querySelector(".cart-summary");
  if (cartSummary.lenght > 4) {
    // Aplica a altura fixa e o overflow de acordo com a quantidade de itens no carrinho
    cartSummary.style.height = cartItens.length > 4 ? "auto" : "auto";
    cartSummary.style.overflow = cartItens.length <= 4 ? "hidden" : ""; // Aplica overflow apenas quando há 3 ou menos itens
  }
  const currentTotal = parseFloat(
    totalElement.textContent.replace(/[^\d,]/g, "").replace(",", ".")
  );
  if (validDiscountCodes.includes(code)) {
    const discountAmount = currentTotal * 0.1;
    const totalAfterDiscount = currentTotal - discountAmount;

    totalElement.innerHTML = `<strong>Total com desconto:&nbsp;</strong> R$ ${totalAfterDiscount
      .toFixed(2)
      .replace(".", ",")}`;

    insertDiscountInfo(createDiscountInfo(discountAmount));
    disableDiscountInputAndButton();

    isDiscountApplied = true;
    updateInstallments(totalAfterDiscount);
  } else {
    clearExistingDiscountInfo();
    showMessage(messages.invalidDiscountCode, "error");
    resetDiscountInput();
  }
}

/* Função para exibir mensagens ao usuário */
function showMessage(message, type) {
  clearExistingMessage();
  const messageElement = document.createElement("div");
  messageElement.className = `message ${
    type === "error" ? "discount-alert error-message" : "success-message"
  }`;
  messageElement.innerHTML = `<strong>${message}</strong>`;

  const formContainer = document.querySelector(".discount-form-container");
  if (formContainer) {
    formContainer.parentNode.insertBefore(messageElement, formContainer);
    setTimeout(() => {
      messageElement.remove();
    }, 3000);
  }
}

/* Função para limpar mensagens existentes */
function clearExistingMessage() {
  const existingMessage = document.querySelector(".message");
  if (existingMessage) {
    existingMessage.remove();
  }
}

/* Funções para gerenciar informações de desconto */
function createDiscountInfo(discountAmount) {
  const discountInfo = document.createElement("div");
  discountInfo.className = "discount-info discount-success";
  discountInfo.innerHTML = `
    <div class="discount-title success-message"><strong>${
      messages.discountApplied
    }</strong></div>
    <div class="discount-amount"><strong>Desconto aplicado:&nbsp;</strong> R$ ${discountAmount
      .toFixed(2)
      .replace(".", ",")}</div>`;
  return discountInfo;
}

function insertDiscountInfo(discountInfo) {
  const formContainer = document.querySelector(".discount-form-container");
  if (formContainer) {
    clearExistingDiscountInfo();
    formContainer.parentNode.insertBefore(discountInfo, formContainer);
  }
}

function clearExistingDiscountInfo() {
  const existingDiscountInfo = document.querySelector(".discount-info");
  if (existingDiscountInfo) {
    existingDiscountInfo.remove();
  }
}
/* Função para evitar cart-summary se deslocar */
function adjustCartSummaryHeight() {
  const cartSummary = document.querySelector(".cart-summary");
  const cartContent = cartSummary.querySelector(".cart-content"); // Presume um contêiner interno

  if (cartSummary && cartContent) {
    const contentHeight = cartContent.offsetHeight; // Obtém a altura real do conteúdo interno
    cartSummary.style.height = `${contentHeight}px`; // Define a altura baseada no conteúdo
  }
}

/* Função para desativar entrada e botão de desconto */
function disableDiscountInputAndButton() {
  const discountInput = document.querySelector(".discount-input");
  const discountBtn = document.querySelector(".discount-btn");
  const discountFormContainer = document.querySelector(
    ".discount-form-container"
  );
  const confirmationMessage = document.querySelector("#confirmation-message");

  // Desativa os campos de desconto
  if (discountInput) discountInput.disabled = true;
  if (discountBtn) discountBtn.disabled = true;

  // Oculta o formulário de desconto sem deslocar o layout
  if (discountFormContainer) {
    discountFormContainer.style.position = "absolute"; // Remove do fluxo normal do layout
    discountFormContainer.style.zIndex = "100"; // Sobrepõe outros elementos
    discountFormContainer.style.transform = "translateY(-100%)"; // Move para fora da visão
    discountFormContainer.style.transition =
      "transform 0.3s ease, opacity 0.3s ease"; // Animação suave
    discountFormContainer.style.opacity = "0"; // Oculta visualmente
  }

  // Ajusta o #confirmation-message e seus conteúdos para subir
  if (confirmationMessage) {
    confirmationMessage.style.position = "relative"; // Mantém no fluxo de layout
    confirmationMessage.style.transform = "translateY(-1rem)"; // Move para cima
    confirmationMessage.style.transition = "transform 0.3s ease"; // Animação suave

    // Ajusta estilos internos se necessário
    const paragraph = confirmationMessage.querySelector("p");
    const buttonContainer =
      confirmationMessage.querySelector(".button-container");

    if (paragraph) {
      paragraph.style.marginTop = "0"; // Remove margem adicional
      paragraph.style.transition = "transform 0.3s ease"; // Animação suave
    }

    if (buttonContainer) {
      buttonContainer.style.marginTop = "0"; // Remove margem adicional
      buttonContainer.style.transition = "transform 0.3s ease"; // Animação suave
    }
  }
}

/* Função para redefinir entrada de desconto */
function resetDiscountInput() {
  const discountInput = document.querySelector(".discount-input");
  if (discountInput) {
    discountInput.value = "";
    discountInput.classList.add("error");
    setTimeout(() => {
      discountInput.classList.remove("error");
    }, 3000);
  }
}

/* Função para atualizar parcelas (installments) com base no desconto. */
function updateInstallments(totalAfterDiscount) {
  const installmentsSelect = document.getElementById("installments");
  installmentsSelect.innerHTML = ""; // Limpa opções existentes

  const totalElement = document.querySelector(".total-title");
  const currentTotal = parseFloat(
    totalElement.textContent.replace(/[^\d,]/g, "").replace(",", ".")
  );
  const totalToConsider = isDiscountApplied ? totalAfterDiscount : currentTotal;

  const installmentValues = {
    1: totalToConsider.toFixed(2).replace(".", ","),
    2: (totalToConsider / 2).toFixed(2).replace(".", ","),
    3: (totalToConsider / 3).toFixed(2).replace(".", ","),
  };

  for (const [numInstallments, installmentValue] of Object.entries(
    installmentValues
  )) {
    const optionText =
      `${numInstallments} x R$ ${installmentValue}` +
      (isDiscountApplied ? " (com desconto)" : "");
    const option = document.createElement("option");
    option.value = numInstallments;
    option.textContent = optionText;
    installmentsSelect.appendChild(option);
  }
}

/* Função para rolagem automática de produtos. */
function autoScrollProducts() {
  const cartContainer = document.getElementById("cart-items");
  if (!cartContainer) return;
  const scrollSpeed = 30; // Pixels per scroll
  const scrollInterval = 3000; // Time between each scroll (3 seconds)
  let scrollPosition = 0;
  function scroll() {
    if (!cartContainer) return;
    if (
      scrollPosition >=
      cartContainer.scrollHeight - cartContainer.clientHeight
    ) {
      scrollPosition = 0;
    } else {
      scrollPosition += scrollSpeed;
    }
    cartContainer.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });
  }
  const scrollTimer = setInterval(scroll, scrollInterval);
  cartContainer.addEventListener("mouseenter", () => {
    clearInterval(scrollTimer);
  });

  cartContainer.addEventListener("mouseleave", () => {
    scrollPosition = cartContainer.scrollTop;
    setInterval(scroll, scrollInterval);
  });
}

/* Função para lidar com cliques no botão de confirmação */
function handleConfirmation() {
  confirmYesButton.addEventListener("click", function () {
    alert("Preencha os dados de Login para prosseguir com a compra.");
    confirmationMessage.style.display = "none";
    discountForm.style.display = "none";
  });

  confirmNoButton.addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "../../index.html";
  });
}

/* Chame a função handleConfirmation quando o script for carregado */
handleConfirmation();
