/**
 * checkout.js - Sistema de checkout com desconto
 * Data: 2025-02-01 11:01:07
 * Usuário: x-gyba
 */

// Declaração de variáveis globais
window.isPurchaseConfirmed = window.isPurchaseConfirmed || false;
window.confirmationInProgress = window.confirmationInProgress || false;
window.isDiscountApplied = window.isDiscountApplied || false;
window.discountCode = "DESCONTO10";
window.discountPercentage = 0.1;
window.currentUser = "x-gyba";
window.currentDateTime = "2025-02-01 11:01:07";

// Funções de manipulação de formulário
function toggleForm(formType) {
    const signinForm = document.getElementById('signin');
    const signupForm = document.getElementById('signup');
    
    signinForm.style.display = formType === 'signin' ? 'block' : 'none';
    signupForm.style.display = formType === 'signup' ? 'block' : 'none';
}

function togglePessoa(tipo) {
    document.getElementById('pessoa-fisica').style.display = tipo === 'fisica' ? 'block' : 'none';
    document.getElementById('pessoa-juridica').style.display = tipo === 'juridica' ? 'block' : 'none';
}

function togglePasswordVisibility(formType) {
    const passwordInput = document.getElementById(`senha_${formType}`);
    const eyeIconShow = document.getElementById(`eyeicon-show-senha_${formType}`);
    const eyeIconHide = document.getElementById(`eyeicon-hide-senha_${formType}`);
    
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    eyeIconShow.style.display = isPassword ? 'none' : 'block';
    eyeIconHide.style.display = isPassword ? 'block' : 'none';
}

function toggleConfirmPasswordVisibility() {
    const confirmPasswordInput = document.getElementById('confirmar_senha_signup');
    const eyeIconShow = document.getElementById('eyeicon-show-confirmar_senha_signup');
    const eyeIconHide = document.getElementById('eyeicon-hide-confirmar_senha_signup');
    
    const isPassword = confirmPasswordInput.type === 'password';
    confirmPasswordInput.type = isPassword ? 'text' : 'password';
    eyeIconShow.style.display = isPassword ? 'none' : 'block';
    eyeIconHide.style.display = isPassword ? 'block' : 'none';
}

// Funções de formatação e cálculo
function convertToFloat(value) {
    if (typeof value === 'string') {
        return parseFloat(value.replace(/[^\d,.-]/g, '').replace('.', '').replace(',', '.'));
    }
    return parseFloat(value);
}

function formatMoney(value) {
    return value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Função para mostrar mensagens com animação
function showMessage(message, type) {
    const successMessage = document.getElementById('discount-success-message');
    const errorMessage = document.getElementById('discount-error-message');

    // Primeiro, esconde ambas as mensagens
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';

    // Depois, mostra a mensagem apropriada
    if (type === 'success') {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        // Reinicia a animação
        successMessage.style.animation = 'none';
        successMessage.offsetHeight; // Força um reflow
        successMessage.style.animation = 'shake 0.5s';
    } else {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        // Reinicia a animação
        errorMessage.style.animation = 'none';
        errorMessage.offsetHeight; // Força um reflow
        errorMessage.style.animation = 'shake 0.5s';
    }
}

// Função principal de desconto
function applyDiscount(event) {
    event.preventDefault();

    if (window.isPurchaseConfirmed) {
        showMessage("Desconto Bloqueado.", "error");
        return;
    }

    if (window.isDiscountApplied) {
        showMessage("Você ganhou 10% de desconto!.", "error");
        return;
    }

    const discountInput = document.querySelector(".discount-input");
    const totalElement = document.querySelector(".total-title");
    const code = discountInput.value.trim();

    if (code !== window.discountCode) {
        showMessage("Código de desconto inválido.", "error");
        return;
    }

    try {
        const totalText = totalElement.textContent;
        const currentTotal = convertToFloat(totalText);

        if (isNaN(currentTotal) || currentTotal <= 0) {
            throw new Error("Valor total inválido");
        }

        const discountAmount = Math.round(currentTotal * window.discountPercentage * 100) / 100;
        const totalAfterDiscount = Math.round((currentTotal - discountAmount) * 100) / 100;

        totalElement.innerHTML = `<strong>Total com desconto:</strong> R$ ${formatMoney(totalAfterDiscount)}`;
        
        window.isDiscountApplied = true;
        showMessage("Você ganhou 10% de desconto!", "success");

        console.log({
            originalValue: currentTotal,
            discountAmount: discountAmount,
            finalValue: totalAfterDiscount,
            formattedFinal: formatMoney(totalAfterDiscount)
        });

    } catch (error) {
        console.error("Erro ao calcular desconto:", error);
        showMessage("Erro ao calcular o total.", "error");
    }
}

// Event Listeners
function initializeEventListeners() {
    document.getElementById('signup-btn')?.addEventListener('click', () => toggleForm('signup'));
    document.getElementById('signin-btn')?.addEventListener('click', () => toggleForm('signin'));
    document.querySelector(".discount-form")?.addEventListener("submit", applyDiscount);

    window.confirmYesButton = document.getElementById("confirm-yes");
    window.confirmNoButton = document.getElementById("confirm-no");

    if (window.confirmYesButton) {
        window.confirmYesButton.addEventListener("click", handleConfirmYes);
    }

    if (window.confirmNoButton) {
        window.confirmNoButton.addEventListener("click", handleConfirmNo);
    }
}

// Funções de manipulação do carrinho
function handleConfirmYes(event) {
    event.preventDefault();

    if (!window.confirmationInProgress) {
        window.confirmationInProgress = true;
        alert("Seu pedido foi realizado com sucesso.");
        disableTrashIcons();
        window.isPurchaseConfirmed = true;

        console.log(`Compra confirmada por ${window.currentUser} em ${window.currentDateTime}`);

        setTimeout(() => {
            alert("Preencha os dados de login para prosseguir com a compra.");
            window.confirmationInProgress = false;
        }, 500);
    }
}

function handleConfirmNo() {
    window.location.href = "../../index.html";
}

// Função para desabilitar os ícones de lixeira
function disableTrashIcons() {
    const trashIcons = document.querySelectorAll(".remove-btn");
    trashIcons.forEach((icon) => {
        icon.disabled = true;
        icon.style.opacity = "0.5";
        icon.style.cursor = "not-allowed";
    });
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
updateProgressBarAndIcons(1);

console.log(`Página inicializada para ${window.currentUser} em ${window.currentDateTime}`);