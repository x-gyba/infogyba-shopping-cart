$(document).ready(function () {
  let currentStep = 0;
  const steps = $(
    ".form-container > form, .payment-container, .review-container"
  );

  // Show the first step
  steps.hide().first().show();

  $("#next").on("click", function () {
    if (currentStep < steps.length - 1) {
      steps.eq(currentStep).hide();
      currentStep++;
      steps.eq(currentStep).show();
      updateStepIndicator();
      $("#prev").show();
      if (currentStep === steps.length - 1) {
        $("#next").hide(); // Hide next on the last step
      }
    }
  });

  $("#prev").on("click", function () {
    if (currentStep > 0) {
      steps.eq(currentStep).hide();
      currentStep--;
      steps.eq(currentStep).show();
      updateStepIndicator();
      $("#next").show();
      if (currentStep === 0) {
        $("#prev").hide(); // Hide prev on the first step
      }
    }
  });

  function updateStepIndicator() {
    $(".circle")
      .removeClass("active")
      .slice(0, currentStep + 1)
      .addClass("active");
    $(".indicator").css(
      "width",
      (currentStep / (steps.length - 1)) * 100 + "%"
    );
  }
});

//limpa o carrinho ao clicar em voltar
window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
      // O usuário voltou para a página
      fetch("set_clear_cart.php", { method: "POST" });
  }
});




