// Seletor para os elementos das etapas
const steps = document.querySelectorAll(".circle");
const indicator = document.querySelector(".indicator");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const signinForm = document.getElementById("signin");
const signupForm = document.getElementById("signup");
const totalSteps = 3; // Atualizado para 3 etapas: Login, Pagamento, Revisão

let currentStep = 0;
let isDiscountApplied = false;
const validDiscountCodes = ["DESCONTO10"];
const messages = {
  discountApplied: "Você ganhou 10% de desconto!",
  discountAlreadyApplied: "Desconto já aplicado!",
  invalidDiscountCode: "Código de desconto inválido.",
};

// Função para atualizar as etapas e a visibilidade dos formulários
function updateSteps() {
  // Atualiza o estado das etapas
  steps.forEach((step, idx) => {
    step.classList.toggle("active", idx <= currentStep); // Marca as etapas anteriores como ativas
  });

  // Atualiza a largura da barra de progresso
  indicator.style.width = `${(currentStep / (totalSteps - 1)) * 100}%`;

  // Atualiza a visibilidade das etapas
  document.querySelectorAll(".step-content").forEach((content, idx) => {
    content.style.display = idx === currentStep ? "block" : "none";
  });

  // Ajusta a visibilidade dos botões de navegação
  prevBtn.style.display = currentStep === 0 ? "none" : "inline-block";
  nextBtn.textContent =
    currentStep === totalSteps - 1 ? "Finalizar" : "Próximo";
}

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
document.getElementById("signup-btn").addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

document.getElementById("sign-btn").addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

// Inicializa a página com o formulário de login visível
signinForm.style.display = "block";
signupForm.style.display = "none";

// Event listeners para os botões de navegação entre as etapas
prevBtn.addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep--;
    updateSteps();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentStep < totalSteps - 1) {
    currentStep++;
    updateSteps();
  } else if (currentStep === totalSteps - 1) {
    alert("Pedido finalizado com sucesso!");
  }
});

// Previne o envio do formulário e avança para a próxima etapa
document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (currentStep < totalSteps - 1) {
      currentStep++;
      updateSteps();
    }
  });
});

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
  const installmentValues = {
    1: (totalAfterDiscount / 1).toFixed(2).replace(".", ","),
    2: (totalAfterDiscount / 2).toFixed(2).replace(".", ","),
    3: (totalAfterDiscount / 3).toFixed(2).replace(".", ","),
    4: (totalAfterDiscount / 4).toFixed(2).replace(".", ","),
    5: (totalAfterDiscount / 5).toFixed(2).replace(".", ","),
    6: (totalAfterDiscount / 6).toFixed(2).replace(".", ","),
  };

  Object.keys(installmentValues).forEach((installment) => {
    const option = document.createElement("option");
    option.value = installmentValues[installment];
    option.textContent = `${installment}x de R$ ${installmentValues[installment]}`;
    installmentsSelect.appendChild(option);
  });
}

function togglePasswordVisibility(formType, passwordFieldId) {
  var passwordField = document.getElementById(passwordFieldId);
  var eyeIconShow = document.getElementById("eyeicon-show-" + formType);
  var eyeIconHide = document.getElementById("eyeicon-hide-" + formType);

  // Verifica se a senha está visível ou oculta
  if (passwordField.type === "password") {
    // Se a senha estiver oculta, exibe ela
    passwordField.type = "text";
    eyeIconShow.style.display = "none"; // Oculta o ícone de mostrar
    eyeIconHide.style.display = "block"; // Exibe o ícone de esconder
  } else {
    // Se a senha estiver visível, oculta ela
    passwordField.type = "password";
    eyeIconShow.style.display = "block"; // Exibe o ícone de mostrar
    eyeIconHide.style.display = "none"; // Oculta o ícone de esconder
  }
}
