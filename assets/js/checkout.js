//Seleciona todos os elementos necessários
const steps = document.querySelectorAll(".circle");
const indicator = document.querySelector(".indicator");
const authFormsContainer = document.querySelector(".auth-forms-container");
const paymentContainer = document.querySelector(".payment-container");
const reviewContainer = document.querySelector(".review-container");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const cardNumberDisplay = document.querySelector(".card-number");
const cardHolderDisplay = document.querySelector(".card-holder");
const cardExpireDisplay = document.querySelector(".card-expire");
const cardCvvDisplay = document.querySelector(".cvv");
const totalSteps = 3;

let currentStep = 0;
let isDiscountApplied = false;
const validDiscountCodes = ["DESCONTO10"];
const messages = {
  discountApplied: "Você ganhou 10% de desconto!",
  discountAlreadyApplied: "Desconto já aplicado!",
  invalidDiscountCode: "Código de desconto inválido.",
};

//Função para atualizar etapas e visibilidade do formulário
function updateSteps() {
  steps.forEach((step, idx) => {
    step.classList.toggle("active", idx <= currentStep);
  });
  indicator.style.width = `${(currentStep / (steps.length - 1)) * 100}%`;

  authFormsContainer.style.display = currentStep === 0 ? "block" : "none";
  paymentContainer.style.display = currentStep === 1 ? "block" : "none";
  reviewContainer.style.display = currentStep === 2 ? "block" : "none";

  prevBtn.style.display = currentStep === 0 ? "none" : "inline-block";
  nextBtn.textContent =
    currentStep === totalSteps - 1 ? "Finalizar" : "Próximo";

  nextBtn.removeEventListener("click", handleNextClick);
  nextBtn.addEventListener("click", handleNextClick);

  if (currentStep === 0) {
    initializeAuthForms();
  } else if (currentStep === 1) {
    updateCardInfo();
  }
}

// Lida com o próximo clique do botão
function handleNextClick() {
  if (currentStep === totalSteps - 1) {
    // Redireciona para payment.php ao clicar em Finalizar
    window.location.href = "../php/payment.php";
  } else {
    currentStep++;
    updateSteps();
  }
}

// Event Listeners
prevBtn.addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep--;
    updateSteps();
  }
});

// Inicializa o formulário
updateSteps();

//Função para inicializar o estado dos formulários de autenticação
function initializeAuthForms() {
  loginForm.style.display = "block";
  registerForm.style.display = "none";
}
//Atualiza as informações do cartão
function updateCardInfo() {
  const nameInput = document.getElementById("name")?.value || "Nome no cartão";
  const cardNumberInput =
    document.getElementById("card-number")?.value || "#### #### #### ####";
  const expiryMonthInput =
    document.getElementById("expiry-month")?.value || "MM";
  const expiryYearInput = document.getElementById("expiry-year")?.value || "AA";

  cardHolderDisplay.textContent = nameInput;
  cardNumberDisplay.textContent = formatCardNumber(cardNumberInput);
  cardExpireDisplay.textContent = `${expiryMonthInput}/${expiryYearInput}`;
}

//Formate o número do cartão
function formatCardNumber(number) {
  return number.replace(/(\d{4})(?=\d)/g, "$1 ");
}

// Animação de virada de cartão
function handleCardFlip() {
  const cardWrapper = document.querySelector(".card-wrapper");
  cardWrapper.classList.toggle("is-flipped");
}

//Função para aplicar desconto
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

// Cria elemento de informação de desconto
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

//Insere informações de desconto no DOM
function insertDiscountInfo(discountInfo) {
  const formContainer = document.querySelector(".discount-form-container");
  if (formContainer) {
    clearExistingDiscountInfo();
    formContainer.parentNode.insertBefore(discountInfo, formContainer);
  }
}

// Limpa informações de desconto existentes
function clearExistingDiscountInfo() {
  const existingDiscountInfo = document.querySelector(".discount-info");
  if (existingDiscountInfo) {
    existingDiscountInfo.remove();
  }
}

//Desativa entrada e botão de desconto
function disableDiscountInputAndButton() {
  const discountInput = document.querySelector(".discount-input");
  const discountBtn = document.querySelector(".discount-btn");
  if (discountInput) discountInput.disabled = true;
  if (discountBtn) discountBtn.disabled = true;
}

//Redefinir campo de entrada de desconto
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

//Mostra mensagem para o usuário
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

//Limpa mensagens existentes
function clearExistingMessage() {
  const existingMessage = document.querySelector(".discount-message");
  if (existingMessage) {
    existingMessage.remove();
  }
}

// Event Listeners
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
    console.log("Form submitted!");
  }
});

// Impede a atualização do envio do formulário
document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (currentStep < totalSteps - 1) {
      currentStep++;
      updateSteps();
    }
  });
});

document.getElementById("cvv")?.addEventListener("input", (e) => {
  cardCvvDisplay.textContent = e.target.value || "***";
});

document.getElementById("name")?.addEventListener("input", updateCardInfo);
document
  .getElementById("card-number")
  ?.addEventListener("input", updateCardInfo);
document
  .getElementById("expiry-month")
  ?.addEventListener("change", updateCardInfo);
document
  .getElementById("expiry-year")
  ?.addEventListener("change", updateCardInfo);
document.getElementById("cvv")?.addEventListener("focus", handleCardFlip);
document.getElementById("cvv")?.addEventListener("blur", handleCardFlip);

// Formulário alterna event listeners
document.getElementById("show-register")?.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

document.getElementById("show-login")?.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

//Botão de desconto event listener
document.getElementById("apply-discount")?.addEventListener("click", (e) => {
  e.preventDefault();
  const discountCode = document.getElementById("discount-code")?.value;
  if (discountCode) {
    applyDiscount(discountCode);
  }
});

//Botão para virar o cartão event listener
document.getElementById("flip-button")?.addEventListener("click", () => {
  document.getElementById("card").classList.toggle("flipped");
});

// Inicializa o formulário
updateSteps();

//Função para atualizar installments display
function updateInstallments(totalAfterDiscount) {
  const installmentsSelect = document.getElementById("installments");
  installmentsSelect.innerHTML = ""; // Clear existing options

  const totalElement = document.querySelector(".total-title");
  const currentTotal = parseFloat(
    totalElement.textContent.replace(/[^\d,]/g, "").replace(",", ".")
  );
  const totalToConsider = isDiscountApplied ? totalAfterDiscount : currentTotal;

  const installmentValues = {
    1: totalToConsider.toFixed(2).replace(".", ","),
    2: (totalToConsider / 2).toFixed(2).replace(".", ","),
    3: (totalToConsider / 3).toFixed(2).replace(".", ","),
    // Add more installments as needed
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

//Função para alternar entre formulário de login e cadastro
function toggleForms() {
  const isLoginVisible = loginForm.style.display === "block";
  loginForm.style.display = isLoginVisible ? "none" : "block";
  registerForm.style.display = isLoginVisible ? "block" : "none";
}
