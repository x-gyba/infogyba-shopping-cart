// Verifique se as variáveis já existem antes de declará-las
if (typeof isDiscountApplied === "undefined") {
  var isDiscountApplied = false;
}

// Seleção dos elementos necessários
const confirmYesButton = document.getElementById("confirm-yes");
const confirmNoButton = document.getElementById("confirm-no");
const discountForm = document.querySelector(".discount-form-container");
const validDiscountCodes = ["DESCONTO10"];
const messages = {
  discountApplied: "Você ganhou 10% de desconto!",
  discountAlreadyApplied: "Desconto já aplicado!",
  invalidDiscountCode: "Código de desconto inválido.",
};
const discountInfo = document.querySelector(".discount-info");

// Função para alternar entre formulários de inscrição e login
function toggleForms(showSignup) {
  const signinForm = document.getElementById("signin");
  const signupForm = document.getElementById("signup");

  signinForm.style.display = showSignup ? "none" : "block";
  signupForm.style.display = showSignup ? "block" : "none";
}

// Função para alternar a visibilidade da senha
function togglePasswordVisibility(type) {
  const passwordField = document.getElementById(`senha_${type}`);
  const eyeIconShow = document.getElementById(`eyeicon-show-senha_${type}`);
  const eyeIconHide = document.getElementById(`eyeicon-hide-senha_${type}`);

  if (passwordField.type === "password") {
    passwordField.type = "text";
    eyeIconShow.style.display = "none";
    eyeIconHide.style.display = "inline";
  } else {
    passwordField.type = "password";
    eyeIconShow.style.display = "inline";
    eyeIconHide.style.display = "none";
  }
}

function toggleConfirmPasswordVisibility(type) {
  const confirmPasswordField = document.getElementById(`confirmar_senha_${type}`);
  const eyeIconShowConfirm = document.getElementById(`eyeicon-show-confirmar_senha_${type}`);
  const eyeIconHideConfirm = document.getElementById(`eyeicon-hide-confirmar_senha_${type}`);

  if (confirmPasswordField.type === "password") {
    confirmPasswordField.type = "text";
    eyeIconShowConfirm.style.display = "none";
    eyeIconHideConfirm.style.display = "inline";
  } else {
    confirmPasswordField.type = "password";
    eyeIconShowConfirm.style.display = "inline";
    eyeIconHideConfirm.style.display = "none";
  }
}

// Alternar campos conforme o tipo de pessoa
function togglePessoa(tipo) {
  const pessoaFisica = document.getElementById("pessoa-fisica");
  const pessoaJuridica = document.getElementById("pessoa-juridica");

  pessoaFisica.style.display = tipo === 'fisica' ? "block" : "none";
  pessoaJuridica.style.display = tipo === 'juridica' ? "block" : "none";
}

// Alternar entre login e registro
document.getElementById("signup-btn").addEventListener("click", function(e) {
  e.preventDefault();
  toggleForms(true);
});

document.getElementById("sign-btn").addEventListener("click", function(e) {
  e.preventDefault();
  toggleForms(false);
});

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
  togglePessoa('fisica'); // Mostrar Pessoa Física por padrão
  toggleForms(false); // Mostrar o formulário de login por padrão
});

// Função para aplicar desconto
function applyDiscount() {
  if (isDiscountApplied) {
    showMessage(messages.discountAlreadyApplied, "error");
    return;
  }

  // Verifica se as lixeiras estão desabilitadas
  const isTrashIconsDisabled = Array.from(document.querySelectorAll(".remove-btn")).every(icon => icon.disabled);
  if (isTrashIconsDisabled) {
    showMessage("Desconto Bloqueado", "error");
    return;
  }

  const discountInput = document.querySelector(".discount-input");
  const totalElement = document.querySelector(".total-title");
  const code = discountInput.value.trim();

  if (code === "DESCONTO10") {
    const currentTotal = parseFloat(totalElement.textContent.replace(/[^\d,]/g, "").replace(",", "."));
    const discountAmount = currentTotal * 0.1;
    const totalAfterDiscount = currentTotal - discountAmount;

    totalElement.innerHTML = `<strong>Total com desconto:&nbsp;</strong> R$ ${totalAfterDiscount.toFixed(2).replace(".", ",")}`;

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
  messageElement.className = `message ${type === "error" ? "discount-alert error-message" : "success-message"}`;
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
  document.querySelectorAll(".remove-btn").forEach(icon => {
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
  if (isPurchaseConfirmed || (discountInfo && discountInfo.style.display !== "none")) {
    alert("Não é possível remover itens após aplicar o desconto ou confirmar a compra.");
    return;
  }

  if (!confirm("Tem certeza que deseja remover este item?")) {
    return;
  }

  const itemElement = document.querySelector(`.cart-item[data-item-id="${itemId}"]`);
  if (itemElement) {
    itemElement.style.opacity = "0.5";
  }

  fetch("remove-item.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ itemId }),
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {
          throw new Error(err.error || `HTTP error! status: ${response.status}`);
        });
      }
      return response.json();
    })
    .then(data => {
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
          elementsToHide.forEach(elementId => {
            const element = document.getElementById(elementId) || document.querySelector(elementId);
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
          continueButton.onclick = () => (window.location.href = "../../index.html");

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
    .catch(error => {
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
  $(".progress-bar-inner").removeClass("active");
  $(".progress-bar-inner").css("width", "0%");

  // Atualiza a parte interna da barra de progresso e os ícones conforme o passo
  if (step === 1) {
    $("#step1-icon").addClass("active");
    $(".progress-bar-inner").css({
      width: "33%",
      "background-color": "var(--violet)",
    });
  } else if (step === 2) {
    $("#step1-icon").addClass("active");
    $("#step2-icon").addClass("active");
    $(".progress-bar-inner").css({
      width: "50%",
      "background-color": "var(--green)",
    });
  } else if (step === 3) {
    $("#step1-icon").addClass("active");
    $("#step2-icon").addClass("active");
    $("#step3-icon").addClass("active");
    $(".progress-bar-inner").css({
      width: "50%",
      "background-color": "var(--violet)",
    });
  }
}

// Lógica de login
$("#signin-form").on("submit", function(e) {
  e.preventDefault();
  $.ajax({
    url: "", // Adicione a URL de envio do formulário
    type: "POST",
    data: {
      signin: true,
      email: $("#signin-email").val(),
      senha: $("#signin-senha").val(),
    },
    success: function(response) {
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
    error: function() {
      alert("Erro ao processar o login.");
    },
  });
});

// Avançar entre os passos
$("#next").on("click", function() {
  if (currentStep === 1) {
    $("#step1").fadeOut(function() {
      $("#step2").fadeIn();
    });
    updateProgressBarAndIcons(2);
    currentStep = 2;
  } else if (currentStep === 2) {
    $("#step2").fadeOut(function() {
      $("#step3").fadeIn();
    });
    updateProgressBarAndIcons(3);
    currentStep = 3;
  }
});

// Voltar entre os passos
$("#prev").on("click", function() {
  if (currentStep === 2) {
    $("#step2").fadeOut(function() {
      $("#step1").fadeIn();
    });
    updateProgressBarAndIcons(1);
    currentStep = 1;
  } else if (currentStep === 3) {
    $("#step3").fadeOut(function() {
      $("#step2").fadeIn();
    });
    updateProgressBarAndIcons(2);
    currentStep = 2;
  }
});

// Inicializa as etapas com o estilo correto (passo 1)
updateProgressBarAndIcons(1);

// Função para alertar sobre a perda de dados ao atualizar ou sair da página
window.addEventListener("beforeunload", function(e) {
  const confirmationMessage = "Seus dados serão perdidos.";
  e.preventDefault(); // Previne a ação padrão
  e.returnValue = confirmationMessage; // Define a mensagem de confirmação
});

// Função para redirecionar para index.html após o alerta
window.addEventListener("unload", function() {
  window.location.href = "../../index.html";
});