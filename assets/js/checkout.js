let currentStep = 0;
const steps = [
  $("#checkout-form"),
  $(".payment-container"),
  $(".review-container"),
];

function updateStep() {
  // Ocultar todas as seções
  steps.forEach((step, index) => {
    step.hide();
    // Atualizar a cor dos círculos
    const circle = $(".step-item").eq(index).find(".circle");
    if (index <= currentStep) {
      step.show();
      circle.addClass("active"); // Adicionar a classe ativa
    } else {
      circle.removeClass("active"); // Remover a classe ativa
    }
  });

  // Atualizar visibilidade dos botões
  $("#prev").toggle(currentStep > 0);
  $("#next").text(currentStep === steps.length - 1 ? "Finalizar" : "Próximo");

  // Atualizar a largura da barra de progresso
  const progressBar = $(".indicator");
  const progressWidth = (currentStep / (steps.length - 1)) * 100; // Calcula a largura proporcional
  progressBar.css("width", `${progressWidth}%`); // Define a largura da barra

  // Atualizar a cor da barra de progresso
  if (currentStep > 0) {
    progressBar.addClass("active");
  } else {
    progressBar.removeClass("active");
  }
}

$("#next").click(function () {
  if (currentStep < steps.length - 1) {
    currentStep++;
    updateStep();
  } else {
    alert("Obrigado pela sua Compra!");
  }
});

$("#prev").click(function () {
  if (currentStep > 0) {
    currentStep--;
    updateStep();
  }
});

updateStep();
