let currentStep = 0;
const steps = document.querySelectorAll('.form-checkout > div'); // Select all steps
const stepIndicators = document.querySelectorAll('.step-check'); // Select all indicators

function showStep(step) {
    steps.forEach((stepDiv, index) => {
        stepDiv.style.display = index === step ? 'block' : 'none';
    });

    // Update step indicators
    stepIndicators.forEach((indicator, index) => {
        indicator.classList.toggle('step-check--checked', index < step + 1);
    });
}

function nextStep() {
    if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
    }
}

function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
    }
}

// Show the first step initially
showStep(currentStep);

