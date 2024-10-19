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
const totalSteps = 3;

// Initialize form states
loginForm.style.display = "block"; // Show login form initially
registerForm.style.display = "none"; // Hide register form initially

let currentStep = 0;


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
      break;
    case 1:
      paymentContainer.style.display = "block";
      break;
    case 2:
      reviewContainer.style.display = "block";
      break;
  }

  // Update button states
  prevBtn.style.display = currentStep === 0 ? "none" : "block";
  nextBtn.textContent =
    currentStep === steps.length - 1 ? "Finalizar" : "Próximo";
}

// Function to toggle between login and register forms
function toggleForms() {
  if (loginForm.style.display === "none") {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
  } else {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
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
  if (currentStep < steps.length - 1) {
    currentStep++;
    updateSteps();
  } else if (currentStep === steps.length - 1) {
    // Handle form submission when on the last step
    console.log("Form submitted!");
    // Add your submission logic here
  }
});

// Prevent form submission refresh
document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      currentStep++;
      updateSteps();
    }
  });
});

// Initialize the form state
updateSteps();

// Validate passwords 
function validatePasswords() {
    const password = document.getElementById('login-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('As senhas não correspondem. Tente novamente.');
    } else {
        alert('Senhas correspondem!'); 
    }
}
