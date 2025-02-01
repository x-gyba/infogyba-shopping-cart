<?php
// Iniciar a sessão
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Funções auxiliares
function validateDiscountCode($code) {
    return $code === 'DESCONTO10';
}

function formatMoney($value) {
    return number_format($value, 2, ',', '.');
}

function convertToFloat($value) {
    if (is_string($value)) {
        return (float) str_replace(['.', ','], ['', '.'], $value);
    }
    return (float) $value;
}

function calculateInstallments($total, $maxInstallments = 6) {
    $installments = [];
    for ($i = 1; $i <= $maxInstallments; $i++) {
        $installmentValue = $total / $i;
        $installments[$i] = number_format($installmentValue, 2, ',', '.');
    }
    return $installments;
}

// Inicialização de variáveis
$total = isset($_SESSION['cart_total']) ? convertToFloat($_SESSION['cart_total']) : 0;
$discount = 0;
$isDiscountApplied = false;

// Processar desconto
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['discount_code'])) {
    if (validateDiscountCode($_POST['discount_code'])) {
        $discount = round($total * 0.1, 2); // Arredonda para 2 casas decimais
        $_SESSION['discount'] = $discount;
        $isDiscountApplied = true;
    }
} elseif (isset($_SESSION['discount'])) {
    $discount = (float) $_SESSION['discount'];
    $isDiscountApplied = true;
}

$finalTotal = round($total - $discount, 2); // Arredonda para 2 casas decimais
$installmentValues = calculateInstallments($finalTotal);
$finalTotalFormatted = formatMoney($finalTotal);

// Verificar se o usuário está logado antes de exibir o login
$isLoggedIn = isset($_SESSION['user_id']) && $_SESSION['user_id'] > 0;

// Processa o login via AJAX
if (isset($_POST['signin'])) {
    include('conecta.php');
    $conn = conecta();

    $email = $_POST['email'];
    $senha = $_POST['senha'];

    if (empty($email) || empty($senha)) {
        echo "Por favor, preencha todos os campos de login!";
        exit;
    }

    try {
        $sql = "SELECT * FROM login WHERE email = :email";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

            if (password_verify($senha, $usuario['senha'])) {
                $_SESSION['user_logged_in'] = true;
                $_SESSION['user_id'] = $usuario['id'];
                $_SESSION['user_name'] = $usuario['usuario'];

                if ($usuario['email'] === 'admin@infogyba.com.br' || $usuario['id'] == 1) {
                    echo "admin";
                } else {
                    echo "success";
                }
                exit;
            } else {
                echo "Senha incorreta!";
                exit;
            }
        } else {
            echo "Email não encontrado!";
            exit;
        }
    } catch (PDOException $e) {
        echo "Erro no banco de dados: " . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8');
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkout</title>
    <link rel="stylesheet" href="/css/checkout.css" />
    <link rel="stylesheet" href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" />
</head>
<body>
<div class="main-container">
    <div class="checkout-container">
        <div class="cart-summary">
            <?php
            $cartItems = $_SESSION['cart_items'] ?? [];
            $cartImages = $_SESSION['cart_images'] ?? [];
            $quantities = $_SESSION['quantities'] ?? [];

            if ($total > 0) : ?>
                <h2 class="form-title">Resumo do Carrinho</h2>
                <div class="cart-summary-container">
                    <div class="total-title"><strong>Total:&nbsp;</strong> R$ <?= number_format($total, 2, ',', '.') ?></div>
                    <div class="cart-items" id="cart-items">
                        <?php foreach ($cartItems as $index => $item) :
                            $imageSrc = $cartImages[$index] ?? '';
                            $quantity = $quantities[$index] ?? 0;
                            $quantityDisplay = ($quantity == 1) ? "x1" : "x" . htmlspecialchars($quantity);
                        ?>
                            <div class="cart-item" data-item-id="<?= $index ?>" style="display: flex; align-items: center; margin-bottom: 8px;">
                                <?php if ($imageSrc) : ?>
                                    <div style="flex: 0 0 auto; margin-right: 5px;">
                                        <img src="<?= htmlspecialchars($imageSrc) ?>" alt="Imagem do Carrinho" style="max-width: 70px; height: auto;" />
                                    </div>
                                <?php endif; ?>
                                <div class="qtd-item" style="flex: 1;"><?= nl2br(htmlspecialchars($item)) ?> <?= $quantityDisplay ?></div>
                                <button type="button" class="remove-btn" onclick="removeItem(<?= $index ?>)" aria-label="Remover item">
                                    <i class="bx bxs-trash"></i>
                                </button>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <div class="discount-form-container">
                        <form class="discount-form" method="POST" action="">
                            <input type="text" name="discount_code" class="discount-input" placeholder="Código de desconto" required autocomplete="off">
                            <button class="discount-btn" type="submit">Aplicar</button>
                        </form>
                    </div>
                    <div class="discount-message-container">
                        <div id="discount-success-message" class="discount-message" style="display: none;"></div>
                        <div id="discount-error-message" class="discount-message" style="display: none;"></div>
                    </div>
                    <div id="confirmation-message">
                        <p>Confirma a compra?</p>
                        <div class="button-container">
                            <form method="POST" action="">
                                <button type="submit" name="confirmar_compra" value="sim" id="confirm-yes">Sim</button>
                                <button type="button" id="confirm-no" onclick="window.location.href='#'">Não</button>
                            </form>
                        </div>
                    </div>
                </div>
            <?php else: ?>
                <div>
                    <h3>Você será redirecionado para a página inicial em breve...</h3>
                    <script>
                        // Redireciona para index.html após 2 segundos
                        setTimeout(function() {
                            window.location.href = '../../index.html'; // Ajuste o caminho se necessário
                        }, 2000); // 2000 milissegundos = 2 segundos
                    </script>
                </div>
            <?php endif; ?>
        </div>

        <div class="container-steps">
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-bar-inner"></div>
                </div>
                <div class="circle active" id="step1-icon">
                    <i class='bx bx-male-female'></i>
                    <div class="step-name">Login</div>
                </div>
                <div class="circle" id="step2-icon">
                    <i class='bx bx-home'></i>
                    <div class="step-name">Entrega</div>
                </div>
                <div class="circle" id="step3-icon">
                    <i class='bx bx-dollar'></i>
                    <div class="step-name">Pagamento</div>
                </div>
            </div>
        </div>

        <div id="step1">
            <?php include 'login.php'; ?>
        </div>

        <div id="step2" style="display:none;">
            <?php include 'payment.php'; ?>
        </div>

        <div id="step3" style="display:none;">
            <?php include 'review.php'; ?>
        </div>

    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.inputmask/5.0.7/jquery.inputmask.min.js"></script>
<script src="../js/checkout.js"></script>
</body>
</html>