// Declaração de variáveis globais com verificação de existência prévia
window.isPurchaseConfirmed = window.isPurchaseConfirmed || false;
window.confirmationInProgress = window.confirmationInProgress || false;
window.confirmYesButton = window.confirmYesButton || document.getElementById("confirm-yes");
window.confirmNoButton = window.confirmNoButton || document.getElementById("confirm-no");
window.isDiscountApplied = window.isDiscountApplied || false;
window.discountCode = "DESCONTO10";
window.discountPercentage = 0.1;

// Função para alternar a visibilidade da senha
function togglePasswordVisibility(type) {
    const passwordField = document.getElementById(`senha_${type}`);
    const eyeIconShow = document.getElementById(`eyeicon-show-senha_${type}`);
    const eyeIconHide = document.getElementById(`eyeicon-hide-senha_${type}`);

    const isPassword = passwordField.type === "password";
    passwordField.type = isPassword ? "text" : "password";
    eyeIconShow.style.display = isPassword ? "none" : "inline";
    eyeIconHide.style.display = isPassword ? "inline" : "none";
}

function toggleConfirmPasswordVisibility(type) {
    const confirmPasswordField = document.getElementById(`confirmar_senha_${type}`);
    const eyeIconShowConfirm = document.getElementById(`eyeicon-show-confirmar_senha_${type}`);
    const eyeIconHideConfirm = document.getElementById(`eyeicon-hide-confirmar_senha_${type}`);

    const isPassword = confirmPasswordField.type === "password";
    confirmPasswordField.type = isPassword ? "text" : "password";
    eyeIconShowConfirm.style.display = isPassword ? "none" : "inline";
    eyeIconHideConfirm.style.display = isPassword ? "inline" : "none";
}

// Adiciona a funcionalidade de mostrar/esconder senha
function initializePasswordToggle() {
    const passwordToggles = document.querySelectorAll(".password-toggle");
    passwordToggles.forEach((toggle) => {
        toggle.addEventListener("click", (e) => {
            const type = e.target.dataset.type;
            if (e.target.id.includes("confirmar")) {
                toggleConfirmPasswordVisibility(type);
            } else {
                togglePasswordVisibility(type);
            }
        });
    });
}

// Função para aplicar desconto
function applyDiscount(event) {
  event.preventDefault();

  if (window.isPurchaseConfirmed) {
      showErrorMessage("Desconto Bloqueado.");
      return;
  }

  if (window.isDiscountApplied) {
      return;
  }

  const discountInput = document.querySelector(".discount-input");

  if (discountInput.value === window.discountCode) {
      const totalElement = document.querySelector(".total-title");
      const totalText = totalElement.textContent;
      const totalMatch = totalText.match(/R\$ (\d+,\d{2})/);

      if (totalMatch) {
          let total = parseFloat(totalMatch[1].replace('.', '').replace(',', '.'));
          const discountedTotal = total * (1 - window.discountPercentage);
          totalElement.innerHTML = `<strong>Total com desconto:</strong> R$ ${discountedTotal.toFixed(2).replace('.', ',')}`;
          showSuccessMessage("Você ganhou 10% de desconto!");
          window.isDiscountApplied = true;
      } else {
          showErrorMessage("Erro ao calcular o total.");
      }
  } else {
      showErrorMessage("Desconto Inválido");
  }
}

// Função para exibir mensagens de sucesso
function showSuccessMessage(message) {
  const successMessageElement = document.getElementById("discount-success-message");
  successMessageElement.textContent = message;
  successMessageElement.style.display = "block";
  const errorMessageElement = document.getElementById("discount-error-message");
  if (errorMessageElement) {
      errorMessageElement.style.display = "none";
  }
}

// Função para exibir mensagens de erro
function showErrorMessage(message) {
  const errorMessageElement = document.getElementById("discount-error-message");
  errorMessageElement.textContent = message;
  errorMessageElement.style.display = "block";
  const successMessageElement = document.getElementById("discount-success-message");
  if (successMessageElement) {
      successMessageElement.style.display = "none";
  }
}

// Event listener para o botão de aplicar desconto
document.querySelector(".discount-form").addEventListener("submit", applyDiscount);

// Função para desabilitar os ícones de lixeira
function disableTrashIcons() {
    const trashIcons = document.querySelectorAll(".remove-btn");
    trashIcons.forEach((icon) => {
        icon.disabled = true;
        icon.style.opacity = "0.5";
        icon.style.cursor = "not-allowed";
    });
}

// Função chamada quando o botão "Sim" for pressionado
function handleConfirmYes(event) {
    event.preventDefault();

    if (!window.confirmationInProgress) {
        window.confirmationInProgress = true;
        alert("Seu pedido foi realizado com sucesso.");
        disableTrashIcons();
        window.isPurchaseConfirmed = true;

        // Logging para confirmação da compra
        console.log(`Compra confirmada por ${window.currentUser} em ${window.currentDateTime}`);

        setTimeout(() => {
            alert("Preencha os dados de login para prosseguir com a compra.");
            window.confirmationInProgress = false;
        }, 500);
    }
}

// Função chamada quando o botão "Não" for pressionado
function handleConfirmNo() {
    window.location.href = "../../index.html";
}

// Adiciona os event listeners aos botões
function initializeEventListeners() {
    if (window.confirmYesButton) {
        window.confirmYesButton.addEventListener("click", handleConfirmYes);
    }

    if (window.confirmNoButton) {
        window.confirmNoButton.addEventListener("click", handleConfirmNo);
    }
}

// Função para remover itens
function removeItem(itemId) {
    if (window.isPurchaseConfirmed) {
        alert("Não é possível remover itens após confirmar a compra.");
        return;
    }

    if (!confirm("Tem certeza que deseja remover este item?")) {
        return;
    }

    const itemElement = document.querySelector(`.cart-item[data-item-id="${itemId}"]`);
    if (itemElement) {
        itemElement.style.opacity = "0.5";
    }

    fetch("remove-item.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ itemId }),
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((err) => {
                    throw new Error(err.error || `HTTP error! status: ${response.status}`);
                });
            }
            return response.json();
        })
        .then((data) => {
            console.log("Resposta do servidor:", data);

            if (data.success) {
                handleSuccessfulRemoval(itemElement, data);
            } else {
                handleFailedRemoval(itemElement, data.error);
            }
        })
        .catch((error) => {
            console.error("Erro ao remover item:", error);
            handleFailedRemoval(itemElement, error.message);
        });
}

// Função auxiliar para lidar com remoção bem-sucedida
function handleSuccessfulRemoval(itemElement, data) {
    if (itemElement) {
        itemElement.remove();
    }

    updateCartCounter(data);

    if (data.isEmpty) {
        showEmptyCartMessage();
    } else {
        updateTotalPrice(data);
    }
}

// Função auxiliar para lidar com falha na remoção
function handleFailedRemoval(itemElement, errorMessage) {
    alert(`Erro ao remover item: ${errorMessage}`);
    if (itemElement) {
        itemElement.style.opacity = "1";
    }
}

// Função para atualizar o contador do carrinho
function updateCartCounter(data) {
    const cartCounter = document.querySelector(".cart-counter");
    if (cartCounter) {
        cartCounter.textContent = data.itemCount;
        cartCounter.style.display = data.itemCount > 0 ? "block" : "none";
    }
}

// Função para mostrar mensagem de carrinho vazio
function showEmptyCartMessage() {
  const elementsToHide = [
    "cart-items",
    "discount-form-container",
    "#confirmation-message",
    ".button-container",
    ".discount-form",
    ".discount-info",
    ".discount-success",
    ".discount-amount",
    ".discount-title",
  ];

    elementsToHide.forEach((elementId) => {
        const element = document.getElementById(elementId) || document.querySelector(elementId);
        if (element) {
            element.style.display = "none";
        }
    });

    const emptyCartContainer = createEmptyCartContainer();
    const totalElement = document.querySelector(".total-title");
    if (totalElement) {
        totalElement.innerHTML = "";
        totalElement.appendChild(emptyCartContainer);
    }
}

// Função para criar o container de carrinho vazio
function createEmptyCartContainer() {
    const container = document.createElement("div");
    container.className = "empty-cart-container";

    const message = document.createElement("p");
    message.className = "empty-cart-message";
    message.textContent = "Seu carrinho está vazio";

    const button = document.createElement("button");
    button.className = "continue-shopping-btn";
    button.textContent = "Continuar Comprando";
    button.onclick = () => (window.location.href = "../../index.html");

    container.appendChild(message);
    container.appendChild(button);

    return container;
}

// Função para atualizar o preço total
function updateTotalPrice(data) {
    const totalElement = document.querySelector(".total-title");
    if (totalElement) {
        totalElement.innerHTML = `<strong>Total:</strong> R$ ${data.newTotalFormatted}`;
    }
}

// Função para atualizar a barra de progresso e os ícones dos passos
function updateProgressBarAndIcons(step) {
    $(".circle").removeClass("active");
    $(".progress-bar-inner").removeClass("active").css("width", "0%");

    const progressConfig = {
        1: { width: "33%", color: "var(--violet)", icons: ["step1-icon"] },
        2: { width: "50%", color: "var(--green)", icons: ["step1-icon", "step2-icon"] },
        3: { width: "50%", color: "var(--violet)", icons: ["step1-icon", "step2-icon", "step3-icon"] },
    };

    const config = progressConfig[step];
    if (config) {
        config.icons.forEach((iconId) => $(`#${iconId}`).addClass("active"));
        $(".progress-bar-inner").css({
            width: config.width,
            "background-color": config.color,
        });
    }
}

// Inicialização
initializeEventListeners();
initializePasswordToggle();
updateProgressBarAndIcons(1);

console.log(`Página inicializada para ${window.currentUser} em ${window.currentDateTime}`);