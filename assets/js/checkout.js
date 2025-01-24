// Verifique se as variáveis ​​já existem antes de declará-las
if (typeof isDiscountApplied === "undefined") {
  var isDiscountApplied = false;
}

// Seleção dos elementos necessários
var confirmYesButton = document.getElementById("confirm-yes");
var confirmNoButton = document.getElementById("confirm-no");
var discountForm = document.querySelector(".discount-form-container");
var validDiscountCodes = ["DESCONTO10"];
var messages = {
  discountApplied: "Você ganhou 10% de desconto!",
  discountAlreadyApplied: "Desconto já aplicado!",
  invalidDiscountCode: "Código de desconto inválido.",
};
const discountInfo = document.querySelector(".discount-info");

// Função para alternar entre formulários de inscrição e login
function toggleForms(showSignup) {
  const signinForm = document.getElementById("signin");
  const signupForm = document.getElementById("signup");

  if (showSignup) {
    signinForm.style.display = "none";
    signupForm.style.display = "block";
  } else {
    signinForm.style.display = "block";
    signupForm.style.display = "none";
  }
}

// Event listeners para alternar entre os formulários
document.getElementById("signup-btn").addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms(true); // Exibe o formulário de registro
});

document.getElementById("sign-btn").addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms(false); // Exibe o formulário de login
});

// Inicializa a página com o formulário de login visível
toggleForms(false);

// Função para alternar a visibilidade da senha
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

// Função para aplicar desconto
function applyDiscount() {
  if (isDiscountApplied) {
    showMessage(messages.discountAlreadyApplied, "error");
    return;
  }

  // Verifica se as lixeiras estão desabilitadas
  const trashIcons = document.querySelectorAll(".remove-btn");
  const isTrashIconsDisabled = Array.from(trashIcons).every(
    (icon) => icon.disabled
  );
  if (isTrashIconsDisabled) {
    showMessage("Desconto Bloqueado", "error");
    return;
  }

  const discountInput = document.querySelector(".discount-input");
  const totalElement = document.querySelector(".total-title");
  const code = discountInput.value.trim();

  if (code === "DESCONTO10") {
    const currentTotal = parseFloat(
      totalElement.textContent.replace(/[^\d,]/g, "").replace(",", ".")
    );
    const discountAmount = currentTotal * 0.1;
    const totalAfterDiscount = currentTotal - discountAmount;

    totalElement.innerHTML = `<strong>Total com desconto:&nbsp;</strong> R$ ${totalAfterDiscount
      .toFixed(2)
      .replace(".", ",")}`;

    isDiscountApplied = true;
    disableTrashIcons();
    showMessage(messages.discountApplied, "success");
  } else {
    showMessage(messages.invalidDiscountCode, "error");
  }
}

// Função para exibir mensagens
function showMessage(message, type) {
  // Remover qualquer mensagem existente
  const existingMessage = document.querySelector(".message");
  if (existingMessage) {
    existingMessage.remove();
  }

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

// Função para desabilitar os ícones de lixeira
function disableTrashIcons() {
  const trashIcons = document.querySelectorAll(".remove-btn");
  trashIcons.forEach((icon) => {
    icon.disabled = true; // Desabilita o botão
    icon.style.opacity = "0.5"; // Reduz a opacidade para indicar desabilitação
    icon.style.cursor = "not-allowed"; // Impede o cursor de ser interativo
  });
}

// Função chamada quando o botão "Sim" for pressionado
function handleConfirmYes() {
  disableTrashIcons(); // Garantir que os ícones da lixeira sejam desativados
  if (discountInfo) {
    discountInfo.style.display = "block"; // Definimos para bloquear a remoção de itens
  }
  alert("Preencha os dados de login para prosseguir com a compra.");
}

// Função chamada quando o botão "Não" for pressionado
function handleConfirmNo() {
  window.location.href = "../../index.html"; // Exemplo de redirecionamento
}

// Adiciona os event listeners aos botões
if (confirmYesButton) {
  confirmYesButton.addEventListener("click", handleConfirmYes);
}

if (confirmNoButton) {
  confirmNoButton.addEventListener("click", handleConfirmNo);
}

// Adiciona o event listener ao botão de aplicar desconto
const discountBtn = document.querySelector(".discount-btn");
if (discountBtn) {
  discountBtn.addEventListener("click", applyDiscount);
}

// Variável global para indicar se a compra foi confirmada
let isPurchaseConfirmed = false;

// Função para confirmar a compra (chame esta função quando a compra for confirmada)
function confirmPurchase() {
  isPurchaseConfirmed = true;
  alert("Compra confirmada!");
}

// Função para remover itens
function removeItem(itemId) {
  // Verifica se a confirmação foi feita
  if (
    isPurchaseConfirmed ||
    (discountInfo && discountInfo.style.display !== "none")
  ) {
    alert(
      "Não é possível remover itens após aplicar o desconto ou confirmar a compra."
    );
    return;
  }

  if (!confirm("Tem certeza que deseja remover este item?")) {
    return;
  }

  const itemElement = document.querySelector(
    `.cart-item[data-item-id="${itemId}"]`
  );
  if (itemElement) {
    itemElement.style.opacity = "0.5";
  }

  fetch("remove-item.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ itemId }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(
            err.error || `HTTP error! status: ${response.status}`
          );
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log("Resposta do servidor:", data);

      if (data.success) {
        if (itemElement) {
          itemElement.remove();
        }

        const cartCounter = document.querySelector(".cart-counter");
        if (cartCounter) {
          cartCounter.textContent = data.itemCount;
          cartCounter.style.display = data.itemCount > 0 ? "block" : "none";
        }

        if (data.isEmpty) {
          const elementsToHide = [
            "cart-items",
            "discount-form-container",
            "#confirmation-message",
            ".button-container",
            ".discount-form",
            ".discount-info",
            ".discount-success",
            ".discount-amount",
            ".discount-title",
          ];
          elementsToHide.forEach((elementId) => {
            const element =
              document.getElementById(elementId) ||
              document.querySelector(elementId);
            if (element) {
              element.style.display = "none";
            }
          });

          const emptyCartContainer = document.createElement("div");
          emptyCartContainer.className = "empty-cart-container";

          const emptyMessage = document.createElement("p");
          emptyMessage.className = "empty-cart-message";
          emptyMessage.textContent = "Seu carrinho está vazio";

          const continueButton = document.createElement("button");
          continueButton.className = "continue-shopping-btn";
          continueButton.textContent = "Retornar para Loja";
          continueButton.onclick = () =>
            (window.location.href = "../../index.html");

          emptyCartContainer.appendChild(emptyMessage);
          emptyCartContainer.appendChild(continueButton);

          const totalElement = document.querySelector(".total-title");
          if (totalElement) {
            totalElement.innerHTML = "";
            totalElement.appendChild(emptyCartContainer);
          }
        } else {
          const totalElement = document.querySelector(".total-title");
          if (totalElement) {
            totalElement.innerHTML = `<strong>Total:</strong> R$ ${data.newTotalFormatted}`;
          }
        }
      } else {
        alert(`Erro ao remover item: ${data.error}`);
        if (itemElement) {
          itemElement.style.opacity = "1";
        }
      }
    })
    .catch((error) => {
      console.error("Erro ao remover item:", error);
      alert(`Erro ao remover item: ${error.message}`);
      if (itemElement) {
        itemElement.style.opacity = "1";
      }
    });
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

// Função para alertar sobre a perda de dados ao atualizar ou sair da página
window.addEventListener("beforeunload", function (e) {
  const confirmationMessage = "Seus dados serão perdidos.";
  e.preventDefault(); // Previne a ação padrão
  e.returnValue = confirmationMessage; // Define a mensagem de confirmação
});

// Função para redirecionar para index.html após o alerta
window.addEventListener("unload", function () {
  window.location.href = "../../index.html";
});
