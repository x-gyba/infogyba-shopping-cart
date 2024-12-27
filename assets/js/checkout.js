// Seletor para os elementos das etapas
const steps = document.querySelectorAll(".circle");
const totalSteps = 3; // Número total de etapas
let currentStep = 0; // Etapa inicial (o primeiro círculo deve ser violeta inicialmente)

// Função para atualizar as etapas e a visibilidade dos formulários
function updateSteps() {
  steps.forEach((step, idx) => {
    // Adiciona a classe 'active' nos círculos com base na etapa atual
    // Apenas os círculos até a etapa atual devem ter a classe 'active'
    step.classList.toggle("active", idx <= currentStep);
  });

  // Atualizar a barra de progresso (indicador)
  const indicator = document.querySelector(".indicator");
  indicator.style.width = `${(currentStep / (totalSteps - 1)) * 100}%`; // Atualizando a largura do indicador

  // Barra de progresso ativa (muda de cor para verde)
  const progressBar = document.querySelector(".progress-bar");
  progressBar.classList.toggle("active", currentStep > 0); // A barra se torna verde a partir da segunda etapa

  // Atualizar o conteúdo das etapas
  const stepContents = document.querySelectorAll(".step-content");
  stepContents.forEach((content, idx) => {
    content.classList.toggle("active", idx === currentStep);
  });

  // Desabilitar o botão "Anterior" se estamos na primeira etapa
  document.getElementById("prev").disabled = currentStep === 0;

  // Alterar o texto do botão "Próximo" ou "Finalizar" dependendo da etapa
  const nextButton = document.getElementById("next");
  nextButton.textContent =
    currentStep === totalSteps - 1 ? "Finalizar" : "Próximo";
}

// Navegação para a próxima etapa
document.getElementById("next").addEventListener("click", () => {
  if (currentStep < totalSteps - 1) {
    currentStep++;
    updateSteps();
  } else {
    alert("Pedido finalizado com sucesso!");
    // Redirecionar ou processar o pedido
    window.location.href = "pagseguro.php";
  }
});

// Navegação para a etapa anterior
document.getElementById("prev").addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep--;
    updateSteps();
  }
});

// Inicializar as etapas
updateSteps();
