<?php
// Iniciar a sessão
if (session_status() == PHP_SESSION_NONE) {
  session_start();
}

// Funções de validação e cálculo
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

// Processar desconto
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
        echo "Erro no banco de dados: " . $e->getMessage();
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
         echo "<div class='cart-items' id='cart-items'>";
        foreach ($items as $index => $item) {
        $imageSrc = $imageSrcArray[$index] ?? '';
        $quantity = $quantities[$index] ?? 0;
        $quantityDisplay = ($quantity == 1) ? "x1" : "x" . htmlspecialchars($quantity);
        echo "<div style='display: flex; align-items: center; margin-bottom: 8px;' id='cart-item-$index'>";
        if ($imageSrc) {
        echo "<div style='flex: 0 0 auto; margin-right: 5px;'>";
        echo "<img src='" . htmlspecialchars($imageSrc) . "' alt='Imagem do Carrinho' style='max-width: 70px; height: auto;' />";
        echo "</div>";
    }
    echo "<div class='qtd-item' style='flex: 1;'>" . nl2br(htmlspecialchars($item)) . " " . $quantityDisplay . "</div>";
    // Adiciona o botão de lixeira
    echo "<button type='button' class='remove-btn' onclick='removeItem($index)'><i class='bx bxs-trash'></i></button>";
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
// Adicionando a mensagem "Confirma a compra?" após o input
echo '<div id="confirmation-message">';
echo '<p>Confirma a compra?</p>';
echo '<div class="button-container">';
echo '<button type="button" id="confirm-yes">Sim</button>';
echo '<button type="button" id="confirm-no">Não</button>';
echo '</div>';
echo '</div>';
 }
 ?>
 </div>

  <!-- Steps section -->
<div class="container-steps">
  <div class="progress-container">
    <!-- Barra de progresso -->
    <div class="progress-bar">
      <div class="progress-bar-inner"></div> <!-- A parte interna da barra de progresso -->
    </div>
    
    <!-- Círculos dos passos -->
    <div class="circle active" id="step1-icon">
      <i class='bx bx-male-female'></i>
      <div class="step-name">Login</div>
    </div>
    <div class="circle" id="step2-icon">
      <i class='bx bx-dollar'></i>
      <div class="step-name">Pagamento</div>
    </div>
    <div class="circle" id="step3-icon">
      <i class='bx bxs-cart-alt'></i>
      <div class="step-name">Revisão</div>
    </div>
  </div>  
</div>

<!-- Step 1: Login Form -->
<div id="step1">
  <?php include 'login.php'; ?> <!-- Formulário de login incluído aqui -->
</div>

<!-- Step 2: Pagamento Form -->
<div id="step2" style="display:none;">
  <?php include 'payment.php'; ?> <!-- Formulário de pagamento incluído aqui -->
</div>

<!-- Step 3: Revisão -->
<div id="step3" style="display:none;">
  <?php include 'review.php'; ?> <!-- Formulário de revisão incluído aqui -->  
</div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.inputmask/5.0.7/jquery.inputmask.min.js"></script>
  <script src="../js/checkout.js"></script>
</body>

</html>