const authFormsContainer = document.querySelector(".auth-forms-container");
const signupForm = document.getElementById("signup");
const signinForm = document.getElementById("signin");
const signupBtn = document.getElementById("signup-btn");
const signBtn = document.getElementById("sign-btn");

let isDiscountApplied = false;
const validDiscountCodes = ["DESCONTO10"];
const messages = {
  discountApplied: "Você ganhou 10% de desconto!",
  discountAlreadyApplied: "Desconto já aplicado!",
  invalidDiscountCode: "Código de desconto inválido.",
};

// Função para alternar entre os formulários de login e registro
function toggleForms() {
  if (signinForm.style.display === "none") {
    signinForm.style.display = "block";
    signupForm.style.display = "none";
  } else {
    signinForm.style.display = "none";
    signupForm.style.display = "block";
  }
}

// Event listeners para alternar entre login e registro
signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

signBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

// Inicializa a página com o formulário de login visível
signinForm.style.display = "block";
signupForm.style.display = "none";

// Função para alternar a visibilidade da senha
function togglePasswordVisibility(formType, passwordFieldId) {
  const passwordField = document.getElementById(passwordFieldId);
  const toggleIconShow = document.getElementById("eyeicon-show-" + formType);
  const toggleIconHide = document.getElementById("eyeicon-hide-" + formType);

  if (passwordField.type === "password") {
    passwordField.type = "text"; // Mostrar a senha
    toggleIconShow.style.display = "none";
    toggleIconHide.style.display = "inline";
  } else {
    passwordField.type = "password"; // Esconder a senha
    toggleIconShow.style.display = "inline";
    toggleIconHide.style.display = "none";
  }
}

// Função para aplicar o desconto
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

// Função para exibir a mensagem para o usuário
function showMessage(message, type) {
  clearExistingMessage();
  const messageElement = document.createElement("div");
  messageElement.className = `discount-message ${
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

// Função para remover a mensagem existente
function clearExistingMessage() {
  const existingMessage = document.querySelector(".discount-message");
  if (existingMessage) {
    existingMessage.remove();
  }
}

// Funções de manipulação do desconto
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

// Desabilita o campo de entrada de desconto e o botão
function disableDiscountInputAndButton() {
  const discountInput = document.querySelector(".discount-input");
  const discountBtn = document.querySelector(".discount-btn");
  if (discountInput) discountInput.disabled = true;
  if (discountBtn) discountBtn.disabled = true;
}

// Reseta o campo de entrada do desconto
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

// Função para atualizar as parcelas com base no desconto
function updateInstallments(totalAfterDiscount) {
  const installmentsSelect = document.getElementById("installments");
  installmentsSelect.innerHTML = ""; // Limpa as opções existentes

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
    const optionText = isDiscountApplied
      ? `${numInstallments} x R$ ${installmentValue} (com desconto)`
      : `${numInstallments} x R$ ${installmentValue}`;
    const option = document.createElement("option");
    option.value = numInstallments;
    option.textContent = optionText;
    installmentsSelect.appendChild(option);
  }
}

// Função para alternar a visibilidade da senha
$(document).ready(function () {
  var currentStep = 1;

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
    var email = $("#signin-email").val();
    var senha = $("#signin-senha").val();

    $.ajax({
      url: "", // Adicione a URL de envio do formulário aqui
      type: "POST",
      data: {
        signin: true,
        email: email,
        senha: senha,
      },
      success: function (response) {
        if (response === "success") {
          alert("Login realizado com sucesso!");

          // Após o login, a barra de progresso vai para Passo 2 (50%) com cor verde
          updateProgressBarAndIcons(2); // Passo 2 após login (50%)

          // A barra de progresso deve ser verde após o login
          $(".progress-bar-inner")
            .css({
              width: "50%", // A barra deve ficar com 50% após o login
              "background-color": "var(--green)", // Barra de progresso verde após o login
            })
            .addClass("active"); // Garante que a barra de progresso seja ativada corretamente

          $("#step1").fadeOut(function () {
            $("#step2").fadeIn(); // Exibe a etapa de pagamento
          });

          currentStep = 2; // Atualiza o passo atual para 2
        } else {
          alert(response); // Exibe o erro caso o login falhe
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
});
