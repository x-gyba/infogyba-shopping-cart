// Select all required elements
const steps = document.querySelectorAll(".circle");
const indicator = document.querySelector(".indicator");
const authFormsContainer = document.querySelector(".auth-forms-container");
const paymentContainer = document.querySelector(".payment-container");
const reviewContainer = document.querySelector(".review-container");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const signupForm = document.getElementById("signup");
const signinForm = document.getElementById("signin");
const signupBtn = document.getElementById("signup-btn");
const signBtn = document.getElementById("sign-btn");
const totalSteps = 3;

let currentStep = 0;
let isDiscountApplied = false;
const validDiscountCodes = ["DESCONTO10"];
const messages = {
  discountApplied: "Você ganhou 10% de desconto!",
  discountAlreadyApplied: "Desconto já aplicado!",
  invalidDiscountCode: "Código de desconto inválido.",
};

// Função para atualizar os passos e a visibilidade do formulário
function updateSteps() {
  steps.forEach((step, idx) => {
    step.classList.toggle("active", idx <= currentStep);
  });
  indicator.style.width = `${(currentStep / (steps.length - 1)) * 100}%`;

  // Exibir/ocultar os formulários
  authFormsContainer.style.display = currentStep === 0 ? "block" : "none";
  paymentContainer.style.display = currentStep === 1 ? "block" : "none";
  reviewContainer.style.display = currentStep === 2 ? "block" : "none";

  prevBtn.style.display = currentStep === 0 ? "none" : "inline-block";
  nextBtn.textContent = currentStep === totalSteps - 1 ? "Finalizar" : "Próximo";
}

// Função para alternar entre os formulários de Login e Registro
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

// Event listeners para os botões de navegação entre etapas
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
    console.log("Formulário finalizado!");
    // Adicione a lógica de envio do formulário aqui
  }
});

// Prevent form submission refresh
document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (currentStep < totalSteps - 1) {
      currentStep++;
      updateSteps();
    }
  });
});

// Apply discount
function applyDiscount(discountCode) {
  if (isDiscountApplied) {
    showMessage(messages.discountAlreadyApplied, "error");
    return;
  }

  const code = discountCode || document.querySelector(".discount-input")?.value.trim();
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

// Create and insert discount information element
function createDiscountInfo(discountAmount) {
  const discountInfo = document.createElement("div");
  discountInfo.className = "discount-info discount-success";
  discountInfo.innerHTML = `
    <div class="discount-title success-message"><strong>${messages.discountApplied}</strong></div>
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

// Disable discount input and button
function disableDiscountInputAndButton() {
  const discountInput = document.querySelector(".discount-input");
  const discountBtn = document.querySelector(".discount-btn");
  if (discountInput) discountInput.disabled = true;
  if (discountBtn) discountBtn.disabled = true;
}

// Reset discount input field
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

// Show message to the user
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

function clearExistingMessage() {
  const existingMessage = document.querySelector(".discount-message");
  if (existingMessage) {
    existingMessage.remove();
  }
}

// Initialize the form
updateSteps();

// Function to update installments display
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

// Alternar entre o formulário de login e registro (com jQuery)
$(document).ready(function () {
  // Mostrar o formulário de login e ocultar o de registro
  $("#signup-btn").click(function () {
    $("#signin").show();
    $("#signup").hide();
  });

  // Mostrar o formulário de registro e ocultar o de login
  $("#sign-btn").click(function () {
    $("#signup").show();
    $("#signin").hide();
  });

  // Inicialmente, exibe o formulário de login
  $("#signin").show();
  $("#signup").hide();
});
