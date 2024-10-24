<?php
session_start();
?>

<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Checkout</title>
  <link rel="stylesheet" href="../css/checkout.css" />
  <link rel="stylesheet" href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" />
</head>

<body>
  <div class="main-container">
    <div class="checkout-container">

      <!-- Steps section -->
      <div class="container-steps">
        <div class="step">
          <div class="step-item">
            <span class="circle active"><i class='bx bx-male-female'></i></span>
            <h2 class="step-title">Login</h2>
          </div>
          <div class="step-item">
            <span class="circle"><i class='bx bx-dollar'></i></span>
            <h2 class="step-title">Pagamento</h2>
          </div>
          <div class="step-item">
            <span class="circle"><i class='bx bxs-cart-alt'></i></span>
            <h2 class="step-title">Revisão</h2>
          </div>
          <div class="progress-bar">
            <span class="indicator"></span>
          </div>
        </div>
      </div>

      <!-- Cart summary section -->
      <div class="cart-summary">
        <h2>Resumo do Carrinho</h2>
        <?php
        // Modify the PHP section in checkout.php to remove discount processing
        // Initialize variables
        $total = $_SESSION['cart_total'] ?? 0;
        $items = $_SESSION['cart_items'] ?? [];
        $imageSrcArray = $_SESSION['cart_images'] ?? [];
        $quantities = $_SESSION['quantities'] ?? [];

        // Display cart summary
        if ($total <= 0) {
          echo "<div class='carrinho-vazio'>Carrinho vazio.</div>";
        } else {
          echo "<div class='cart-summary-container'>";

          // Display original total without any discount processing
          $totalFormatted = number_format($total, 2, ',', '.');
          echo "<div class='total-title'><strong>Total:</strong> R$ " . $totalFormatted . "</div>";

          // Display cart items
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

          // Discount form
          echo '<div class="discount-form-container">';
          echo '<form class="discount-form" onsubmit="return false;">';
          echo '<input type="text" name="discount_code" class="discount-input" placeholder="Código de desconto" required>';
          echo '<button class="discount-btn" onclick="applyDiscount()">Aplicar</button>';
          echo '</form>';
          echo '</div>';

          echo "</div>";
        }
        ?>
      </div>

      <!-- Form container -->
      <div class="form-container">

        <!-- Authentication forms -->
        <div class="auth-forms-container">
          <form id="login-form" class="checkout-form">
            <h2 class="form-title">Login</h2>
            <div class="input-line">
              <label for="login-email">Email</label>
              <input type="email" id="login-email" required placeholder="Digite seu email" />
            </div>
            <div class="input-line">
              <label for="login-password">Senha</label>
              <input type="password" id="login-password" required placeholder="Digite sua senha" />
            </div>
            <div class="button-container">
              <button type="submit" class="primary-button">Entrar</button>
              <button type="button" class="auth-toggle-btn" onclick="toggleForms()">Não tem uma conta? Registre-se</button>
            </div>
          </form>

          <form id="register-form" class="checkout-form">
            <h2 class="form-title">Registro</h2>
            <div class="input-line">
              <label for="nome">Nome Completo</label>
              <input type="text" name="nome" required>
            </div>
            <div class="input-line">
              <label for="email">Email</label>
              <input type="email" name="email" required>
            </div>
            <div class="input-line">
              <label for="register-password">Senha</label>
              <input type="password" id="register-password" required placeholder="" />
            </div>
            <div class="input-line">
              <label for="confirm-password">Confirme a senha</label>
              <input type="password" id="confirm-password" required placeholder="" />
            </div>
            <div class="input-line">
              <label for="endereco">Endereço</label>
              <input type="text" name="endereco" required>
            </div>
            <div class="input-line">
              <label for="cep">Cep</label>
              <input type="text" name="cep" required>
            </div>
            <div class="input-line">
              <label for="bairro ">Bairro</label>
              <input type="text" name="bairro" required>
            </div>
            <div class="input-line">
              <label for="cidade">Cidade</label>
              <input type="text" name="cidade" required>
            </div>
            <div class="input-line">
              <label for="estado">Estado</label>
              <input type="text" name="estado" required>
            </div>
            <div class="input-line">
              <label for="cpf">CPF</label>
              <input type="text" name="cpf" required>
            </div>
            <div class="input-line">
              <label for="telefone">Telefone</label>
              <input type="text" name="telefone" required>
            </div>
            <div class="input-line">
              <label for="data_nascimento">Data de Nascimento</label>
              <input type="date" name="data_nascimento" required>
            </div>
            <div class="button-container">
              <button type="submit" class="primary-button">Registrar</button>
              <button type="button" class="auth-toggle-btn" onclick="toggleForms()">Já tem uma conta? Faça login</button>
            </div>
          </form>
        </div>

        <!-- Payment form -->
        <div class="payment-container">
          <h2 class="form-title">Pagamento Cartão de Crédito</h2>
          <div class="card-preview">
            <div class="card-wrapper">
              <div class="card-front">
                <div class="card-logo">
                  <img src="../images/chip.png" alt="chip">
                </div>
                <div class="card-number">**** **** **** 1234</div>
                <div class="card-details">
                  <span class="card-holder">NOME DO TITULAR</span>
                  <span class="card-expire">MM/AA</span>
                </div>
              </div>
              <div class="card-back">
                <div class="black-strip"></div>
                <div class="card-stripe"></div>
                <div class="cvv">123</div>
              </div>
            </div>
          </div>

          <form action="" class="payment-form">
            <div class="form-group">
              <label for="name">Nome Completo</label>
              <input type="text" id="name" placeholder="Informe seu nome completo" required autocomplete="off">
            </div>
            <div class="form-group">
              <label for="card-number">Número Cartão</label>
              <span class="info">Informe os 16 dígitos do cartão</span>
              <input type="text" id="card-number" placeholder="1234 5678 9012 3456" required autocomplete="off">
            </div>
            <div class="form-group">
              <label for="expiry-month">Mês de Validade</label>
              <select id="expiry-month" required>
                <option value="" disabled selected>MM</option>
                <option value="01">01</option>
                <option value="02">02</option>
                <option value="03">03</option>
                <option value="04">04</option>
                <option value="05">05</option>
                <option value="06">06</option>
                <option value="07">07</option>
                <option value="08">08</option>
                <option value="09">09</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>
            </div>

            <div class="form-group">
              <label for="expiry-year">Ano de Validade</label>
              <select id="expiry-year" required>
                <option value="" disabled selected>YY</option>
                <option value="24">2024</option>
                <option value="25">2025</option>
                <option value="26">2026</option>
                <option value="27">2027</option>
                <option value="28">2028</option>
                <!-- Adicione mais anos conforme necessário -->
              </select>
            </div>
            <div class="form-group">
              <label for="cvv"><span class="info">3 dígitos na parte traseira do cartão</span></label>
              <input type="text" id="cvv" placeholder="123" required autocomplete="off">
            </div>

            <!-- Campos adicionais -->
            <div class="form-group">
              <label for="cpf">CPF</label>
              <input type="text" id="cpf" placeholder="000.000.000-00" required autocomplete="off">
            </div>
            <div class="form-group">
              <label for="email">E-mail</label>
              <input type="email" id="email" placeholder="seuemail@exemplo.com" required autocomplete="off">
            </div>
            <div class="form-group">
              <label for="installments">Parcelas sem Juros</label>
              <select id="installments" required>
                <option value="" disabled selected>Selecione o número de parcelas</option>
                <option value="1">1x sem juros</option>
                <option value="2">2x sem juros</option>
                <option value="3">3x sem juros</option>
                <option value="4">4x sem juros</option>
                <option value="5">5x sem juros</option>
                <option value="6">6x sem juros</option>
              </select>
            </div>
          </form>
        </div>

        <!-- Review container -->
        <div class="review-container" id="review-container" style="display:none;">
          <h3>Revisar Pedido</h3>

        </div>

        <!-- Navigation buttons -->
        <div class="step-buttons">
          <button id="prev" style="width:80px;background:#5a4ec5">Anterior</button>
          <button id="next" style="width:80px;background:#5a4ec5">Próximo</button>
        </div>

      </div>

    </div>
  </div>


  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <script src="../js/checkout.js"></script>
</body>

</html>