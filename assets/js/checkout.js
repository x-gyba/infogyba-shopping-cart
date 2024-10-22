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

// Initialize form states
let currentStep = 0;
let isDiscountApplied = false; // Track discount status
const validDiscountCodes = ["SAVE20", "DISCOUNT10"]; // Example valid discount codes

// Function to update steps and form visibility
function updateSteps() {
  // Update step indicators
  steps.forEach((step, idx) => {
    if (idx <= currentStep) {
      step.classList.add("active");
    } else {
      step.classList.remove("active");
    }
  });

  // Update progress bar
  indicator.style.width = `${(currentStep / (steps.length - 1)) * 100}%`;

  // Hide all containers first
  authFormsContainer.style.display = "none";
  paymentContainer.style.display = "none";
  reviewContainer.style.display = "none";

  // Show the current container based on step
  switch (currentStep) {
    case 0:
      authFormsContainer.style.display = "block";
      initializeAuthForms(); // Initialize auth forms state
      break;
    case 1:
      paymentContainer.style.display = "block";
      updateCardInfo();
      break;
    case 2:
      reviewContainer.style.display = "block";
      // Here you might display the discount summary if applied
      displayDiscountSummary();
      break;
  }

  // Update button states
  prevBtn.style.display = currentStep === 0 ? "none" : "inline-block";
  nextBtn.style.display = "inline-block";
  nextBtn.textContent =
    currentStep === totalSteps - 1 ? "Finalizar" : "Próximo";
}

// Initialize auth forms state
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
    // Update any necessary total calculations here
  } else {
    console.log("Invalid discount code.");
  }
}

// Function to display discount summary (if needed)
function displayDiscountSummary() {
  if (isDiscountApplied) {
    // Add logic to show discount information in the review section
    console.log("Discount is applied on the total.");
  } else {
    console.log("No discount applied.");
  }
}

// Navigation event listeners
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
    // Add your submission logic here
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

// Function to update the card information in real-time
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

// Helper function to format the card number with spaces
function formatCardNumber(number) {
  return number.replace(/(\d{4})(?=\d)/g, "$1 ");
}

// Card flip animation
function handleCardFlip() {
  const cardWrapper = document.querySelector(".card-wrapper");
  cardWrapper.classList.toggle("is-flipped");
}

// Event listeners
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

document.getElementById("show-register")?.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

document.getElementById("show-login")?.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

// Example of applying a discount (you can trigger this with a button)
document.getElementById("apply-discount")?.addEventListener("click", (e) => {
  e.preventDefault();
  const discountCode = document.getElementById("discount-code").value; // Assuming you have an input for the discount code
  applyDiscount(discountCode);
});

// Initialize form state
updateSteps();
