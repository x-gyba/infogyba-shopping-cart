<?php
// Iniciar a sessão
if (session_status() == PHP_SESSION_NONE) {
  session_start();
}

// Validation functions (only defined once)
function validateDiscountCode($code)
{
  return $code === 'DESCONTO10';
}

function calculateInstallments($total, $maxInstallments = 6)
{
  $installments = [];
  for ($i = 1; $i <= $maxInstallments; $i++) {
    $installmentValue = $total / $i;
    $installments[$i] = number_format($installmentValue, 2, ',', '.');
  }
  return $installments;
}

// Process discount
$total = $_SESSION['cart_total'] ?? 0;
$discount = 0;
$isDiscountApplied = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['discount_code'])) {
  if (validateDiscountCode($_POST['discount_code'])) {
    $discount = $total * 0.1;
    $_SESSION['discount'] = $discount;
    $isDiscountApplied = true;
  }
} elseif (isset($_SESSION['discount'])) {
  $discount = $_SESSION['discount'];
  $isDiscountApplied = true;
}

$finalTotal = $total - $discount;
$installmentValues = calculateInstallments($finalTotal);

// Verificar se o usuário está logado antes de exibir o login
$isLoggedIn = isset($_SESSION['user_id']) && $_SESSION['user_id'] > 0;
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

      <!-- Cart summary section -->
      <div class="cart-summary">
        <h2 class="form-title">Resumo do Carrinho</h2>
        <?php
        // Inicializa as variáveis
        $total = $_SESSION['cart_total'] ?? 0;
        $items = $_SESSION['cart_items'] ?? [];
        $imageSrcArray = $_SESSION['cart_images'] ?? [];
        $quantities = $_SESSION['quantities'] ?? [];

        // Exibe o resumo do carrinho
        if ($total <= 0) {
          echo "<div class='carrinho-vazio'>Carrinho vazio.</div>";
        } else {
          echo "<div class='cart-summary-container'>";

          // Exibe o total original sem processar descontos
          $totalFormatted = number_format($total, 2, ',', '.');
          echo "<div class='total-title'><strong>Total:</strong> R$ " . $totalFormatted . "</div>";

          // Exibe os itens do carrinho
          echo "<div class='cart-items'>";
          foreach ($items as $index => $item) {
            $imageSrc = $imageSrcArray[$index] ?? '';
            $quantity = $quantities[$index] ?? 0;
            $quantityDisplay = ($quantity == 1) ? "x1" : "x" . htmlspecialchars($quantity);

            echo "<div style='display: flex; align-items: center; margin-bottom: 10px;'>";
            if ($imageSrc) {
              echo "<div style='flex: 0 0 auto; margin-right: 6px;'>";
              echo "<img src='" . htmlspecialchars($imageSrc) . "' alt='Imagem do Carrinho' style='max-width: 75px; height: auto;' />";
              echo "</div>";
            }
            echo "<div class='qtd-item' style='flex: 1;'>" . nl2br(htmlspecialchars($item)) . " " . $quantityDisplay . "</div>";
            echo "</div>";
          }
          echo "</div>";

          // Formulário de desconto
          echo '<div class="discount-form-container">';
          echo '<form class="discount-form" onsubmit="return false;">';
          echo '<input type="text" name="discount_code" class="discount-input" placeholder="Código de desconto" required autocomplete="off">';
          echo '<button class="discount-btn" onclick="applyDiscount()">Aplicar</button>';
          echo '</form>';
          echo '</div>';
          echo ' <div class="discount-message"></div>';
          echo "</div>";
        }
        ?>
      </div>

      <!-- Steps section -->
      <div class="container-steps">
        <div class="step">
          <div class="step-item">
            <span class="circle active" id="step1-icon"><i class='bx bx-male-female'></i></span>
            <h2 class="step-title">Login</h2>
          </div>
          <div class="step-item">
            <span class="circle" id="step2-icon"><i class='bx bx-dollar'></i></span>
            <h2 class="step-title">Pagamento</h2>
          </div>
          <div class="step-item">
            <span class="circle" id="step3-icon"><i class='bx bxs-cart-alt'></i></span>
            <h2 class="step-title">Revisão</h2>
          </div>
          <div class="progress-bar">
            <span class="indicator" id="progress-indicator"></span>
          </div>
        </div>
      </div>

      <!-- Step 1: Login Form -->
      <div id="step1" class="step-content">
        <?php include 'login.php'; ?> <!-- Formulário de login incluído aqui -->
      </div>

      <!-- Navigation buttons -->
      <div class="step-buttons">
        <button id="prev" style="width:80px;background:#5a4ec5" onclick="prevStep()">Anterior</button>
        <button id="next" style="width:80px;background:#5a4ec5" onclick="nextStep()">Próximo</button>
      </div>

    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.inputmask/5.0.7/jquery.inputmask.min.js"></script>
  <script src="../js/checkout.js"></script>
</body>

</html>





