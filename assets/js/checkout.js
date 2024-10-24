// Select all required elements
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
let isDiscountApplied = false; // Track discount status
const validDiscountCodes = ["SAVE20", "DISCOUNT10"]; // Example valid discount codes

// Function to update steps and form visibility
function updateSteps() {
  steps.forEach((step, idx) => {
    if (idx <= currentStep) {
      step.classList.add("active");
    } else {
      step.classList.remove("active");
    }
  });

  indicator.style.width = `${(currentStep / (steps.length - 1)) * 100}%`;

  authFormsContainer.style.display = "none";
  paymentContainer.style.display = "none";
  reviewContainer.style.display = "none";

  switch (currentStep) {
    case 0:
      authFormsContainer.style.display = "block";
      initializeAuthForms();
      break;
    case 1:
      paymentContainer.style.display = "block";
      updateCardInfo();
      break;
    case 2:
      reviewContainer.style.display = "block";
      displayDiscountSummary(); // Displays discount info if applicable
      break;
  }

  prevBtn.style.display = currentStep === 0 ? "none" : "inline-block";
  nextBtn.textContent =
    currentStep === totalSteps - 1 ? "Finalizar" : "Próximo";
}

// Function to initialize auth forms state
function initializeAuthForms() {
  loginForm.style.display = "block";
  registerForm.style.display = "none";
}

// Function to toggle between login and register forms
function toggleForms() {
  loginForm.style.display =
    loginForm.style.display === "none" ? "block" : "none";
  registerForm.style.display =
    registerForm.style.display === "none" ? "block" : "none";
}

// Function to apply discount
function applyDiscount(discountCode) {
  if (validDiscountCodes.includes(discountCode)) {
    isDiscountApplied = true;
    console.log("Discount applied!");
    // Add logic to update total price
  } else {
    console.log("Invalid discount code.");
  }
}

// Function to display discount summary
function displayDiscountSummary() {
  if (isDiscountApplied) {
    console.log("Discount applied on the total.");
  } else {
    console.log("No discount applied.");
  }
}

// Navigation buttons
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
    // Add submission logic here
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

// Update card information
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

// Format card number
function formatCardNumber(number) {
  return number.replace(/(\d{4})(?=\d)/g, "$1 ");
}

// Card flip animation
function handleCardFlip() {
  const cardWrapper = document.querySelector(".card-wrapper");
  cardWrapper.classList.toggle("is-flipped");
}

// Event listeners for real-time card info update
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

// Toggle between forms
document.getElementById("show-register")?.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

document.getElementById("show-login")?.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

// Apply discount logic
document.getElementById("apply-discount")?.addEventListener("click", (e) => {
  e.preventDefault();
  const discountCode = document.getElementById("discount-code").value;
  applyDiscount(discountCode);
});

// Initialize the form
updateSteps();

/* Discount */
let discountApplied = false;

function applyDiscount(discountCode) {
  // Prevent form submission behavior
  event.preventDefault();

  if (discountApplied) {
    showMessage("Desconto já aplicado!", "error");
    return false;
  }

  // Use the input value if no code is passed
  const code =
    discountCode || document.querySelector(".discount-input")?.value.trim();
  const totalElement = document.querySelector(".total-title");

  if (!totalElement) {
    console.error("Total element not found");
    return false;
  }

  const currentTotal = parseFloat(
    totalElement.textContent.replace(/[^\d,]/g, "").replace(",", ".")
  );

  if (code === "DESCONTO10") {
    const discountAmount = currentTotal * 0.1;
    const totalAfterDiscount = currentTotal - discountAmount;

    // Remove any existing discount info
    const existingDiscountInfo = document.querySelector(".discount-info");
    if (existingDiscountInfo) {
      existingDiscountInfo.remove();
    }

    // Create discount info container
    const discountInfo = document.createElement("div");
    discountInfo.className = "discount-info discount-success";

    // Add discount success message
    const discountTitle = document.createElement("div");
    discountTitle.className = "discount-title success-message";
    discountTitle.innerHTML = "<strong>Você ganhou 10% de desconto!</strong>";

    // Add discount amount
    const discountAmountElement = document.createElement("div");
    discountAmountElement.className = "discount-amount";
    discountAmountElement.innerHTML = `<strong>Desconto aplicado:</strong> R$ ${discountAmount
      .toFixed(2)
      .replace(".", ",")}`;

    // Add new total
    const newTotalElement = document.createElement("div");
    newTotalElement.className = "total-discount";
    newTotalElement.innerHTML = `<strong>Total com desconto:</strong> R$ ${totalAfterDiscount
      .toFixed(2)
      .replace(".", ",")}`;

    // Add all elements to discount info container
    discountInfo.appendChild(discountTitle);
    discountInfo.appendChild(discountAmountElement);
    discountInfo.appendChild(newTotalElement);

    // Insert discount info before the form
    const formContainer = document.querySelector(".discount-form-container");
    if (formContainer) {
      formContainer.parentNode.insertBefore(discountInfo, formContainer);

      // Disable input and button
      const discountInput = document.querySelector(".discount-input");
      const discountBtn = document.querySelector(".discount-btn");
      if (discountInput) discountInput.disabled = true;
      if (discountBtn) discountBtn.disabled = true;
    }

    discountApplied = true;
    isDiscountApplied = true; // Update the global discount state
    return true;
  } else {
    // Remove any existing discount info
    const existingDiscountInfo = document.querySelector(".discount-info");
    if (existingDiscountInfo) {
      existingDiscountInfo.remove();
    }

    showMessage("Código de desconto inválido.", "error");

    // Reset the form if needed
    const discountInput = document.querySelector(".discount-input");
    if (discountInput) {
      discountInput.value = "";
      discountInput.classList.add("error");
      setTimeout(() => {
        discountInput.classList.remove("error");
      }, 3000);
    }
    return false;
  }
}

function showMessage(message, type) {
  // Remove any existing message
  const existingMessage = document.querySelector(".discount-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create new message
  const messageElement = document.createElement("div");
  messageElement.className = `discount-message ${
    type === "error" ? "discount-alert error-message" : "success-message"
  }`;
  messageElement.innerHTML = `<strong>${message}</strong>`;

  // Insert message before the form
  const formContainer = document.querySelector(".discount-form-container");
  if (formContainer) {
    formContainer.parentNode.insertBefore(messageElement, formContainer);

    // Remove message after 3 seconds
    setTimeout(() => {
      messageElement.remove();
    }, 3000);
  }
}

// Update the event listener for the discount button
document.getElementById("apply-discount")?.addEventListener("click", (e) => {
  e.preventDefault();
  const discountCode = document.getElementById("discount-code")?.value;
  if (discountCode) {
    applyDiscount(discountCode);
  }
});

/*review */
