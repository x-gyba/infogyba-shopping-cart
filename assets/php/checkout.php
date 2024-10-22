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
        // Verifica se a sessão deve ser limpa
        if (isset($_SESSION['clear_cart']) && $_SESSION['clear_cart'] === true) {
          unset($_SESSION['cart_total'], $_SESSION['cart_items'], $_SESSION['cart_images'], $_SESSION['quantities'], $_SESSION['discount_amount']);
          $_SESSION['clear_cart'] = false; // Reseta a variável para evitar múltiplas limpezas
        }

        // Inicializa as variáveis do carrinho
        $total = isset($_SESSION['cart_total']) ? $_SESSION['cart_total'] : 0;
        $items = isset($_SESSION['cart_items']) ? $_SESSION['cart_items'] : [];
        $imageSrcArray = isset($_SESSION['cart_images']) ? $_SESSION['cart_images'] : [];
        $quantities = isset($_SESSION['quantities']) ? $_SESSION['quantities'] : [];
        $discountAmount = isset($_SESSION['discount_amount']) ? $_SESSION['discount_amount'] : 0;
        $discountMessage = ""; // Mensagem de desconto

        // Debugging: Check session variables
        // echo "<pre>"; print_r($_SESSION); echo "</pre>"; // Uncomment for debugging

        // Verifica se o formulário de desconto foi enviado
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['discount_code'])) {
          $discountCode = $_POST['discount_code'];

          // Verifica se o código de desconto é válido
          if ($discountCode === 'DESCONTO10') {
            // Verifica se o desconto já foi aplicado
            if (!isset($_SESSION['discount_applied'])) { // Verifica se o desconto não foi aplicado
              $discountAmount = $total * 0.10; // 10% de desconto
              $_SESSION['discount_amount'] = $discountAmount; // Armazena o desconto na sessão
              $_SESSION['discount_applied'] = true; // Marca o desconto como aplicado
              $discountMessage = "<div class='discount-title'><strong>Você ganhou 10% de desconto!</strong></div>";
            } else {
              // Mensagem de desconto já aplicado
              $discountMessage = "<div class='discount-alert'><strong>Desconto já aplicado!</strong></div>";
            }
          } else {
            // Mensagem para código de desconto inválido
            $discountMessage = "<div class='discount-alert'><strong>Código de desconto inválido.</strong></div>";
          }
        }

        // Calcular total após desconto
        $totalAfterDiscount = $total - $discountAmount;

        if ($total <= 0) {
          echo "<div class='carrinho-vazio'>Carrinho vazio.</div>";
        } else {
          if (is_numeric($total)) {
            echo "<div class='cart-summary-container'>";

            // Sempre exibir o total original
            $totalFormatted = number_format((float)$total, 2, ',', '.');
            echo "<div class='total-title'><strong>Total:</strong> R$ " . $totalFormatted . "</div>";

            // Se houver desconto, exibir a mensagem e o total com desconto
            if ($discountAmount > 0) {
              $totalAfterDiscountFormatted = number_format(abs((float)$totalAfterDiscount), 2, ',', '.');
              echo "<div class='discount-info'>";
              echo "<div class='discount-amount'><strong>Desconto aplicado:</strong> R$ " . number_format($discountAmount, 2, ',', '.') . "</div>";
              echo "<div class='total-discount'><strong>Total com desconto:</strong> R$ " . $totalAfterDiscountFormatted . "</div>";
              echo "</div>";
            }

            // Exibir mensagem de desconto se houver
            if (!empty($discountMessage)) {
              echo $discountMessage;
            }

            // Exibir itens do carrinho
            echo "<div class='cart-items'>";
            foreach ($items as $index => $item) {
              $imageSrc = isset($imageSrcArray[$index]) ? $imageSrcArray[$index] : '';
              $quantity = isset($quantities[$index]) ? $quantities[$index] : 0;

              $quantityDisplay = ($quantity == 1) ? "x1" : "x" . htmlspecialchars($quantity);

              echo "<div style='display: flex; align-items: center; margin-bottom: 10px;'>";
              if ($imageSrc) {
                echo "<div style='flex: 0 0 auto; margin-right: 6px;'><img src='" . htmlspecialchars($imageSrc) . "' alt='Imagem do Carrinho' style='max-width: 75px; height: auto;' /></div>";
              }
              echo "<div class='qtd-item' style='flex: 1;'>" . nl2br(htmlspecialchars($item)) . " " . $quantityDisplay . "</div>";
              echo "</div>";
            }
            echo "</div>"; // Fecha a div .cart-items

            // Formulário de desconto
            echo '<div class="discount-form-container">';
            echo '<form method="POST" class="discount-form">';
            echo '<input type="text" name="discount_code" class="discount-input" placeholder="Código de desconto" required>';
            echo '<button class="discount-btn" type="submit">Aplicar</button>';
            echo '</form>';
            echo '</div>';

            echo "</div>"; // Fecha cart-summary-container
          } else {
            echo "<div><strong>Total inválido.</strong></div>";
          }
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
          </form>
        </div>

        <!-- Review container -->
        <div class="review-container">
          <!-- review info -->
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