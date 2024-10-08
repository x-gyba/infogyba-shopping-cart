<link rel="stylesheet" href="../css/checkout.css" />
<link rel="stylesheet" href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" />

<div class="container-steps">
    <div class="step">
        <div class="step-item">
            <span class="circle active"><i class='bx bx-male-female'></i></span>
            <h2 class="step-title">Informações Pessoais</h2>
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
    <div class="summary-checkout-wrapper">
        <div class="checkout-summary-container">
            <div class="cart-summary">
                <?php
                session_start();

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

                // Verifica se o formulário de desconto foi enviado
                if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['discount_code'])) {
                    $discountCode = $_POST['discount_code'];

                    // Verifica se o código de desconto é válido e se o desconto já foi aplicado
                    if ($discountCode === 'DESCONTO10') {
                        if ($discountAmount === 0) {
                            $discountAmount = $total * 0.10; // 10% de desconto
                            $_SESSION['discount_amount'] = $discountAmount; // Armazena o desconto na sessão
                            $discountMessage = "<div class='discount-title'><strong>Você ganhou 10% de desconto!</strong></div>";
                        } else {
                            // Mensagem de desconto já aplicado
                            $discountMessage = "<div class='discount-alert'><strong>Desconto já aplicado!</strong></div>";
                        }
                    }
                }

                // Calcular total após desconto
                $totalAfterDiscount = $total - $discountAmount;

                if ($total === 0) {
                    echo "<div class='carrinho-vazio'>Carrinho vazio.</div>";
                } else {
                    if (is_numeric($total)) {
                        $totalFormatted = number_format((float)$total, 2, ',', '.');
                        $totalAfterDiscountFormatted = number_format(abs((float)$totalAfterDiscount), 2, ',', '.');

                        // Exibir total normal
                        echo "<div class='total-title'><strong>Total:</strong> R$ " . $totalFormatted . "</div>";

                        // Exibir mensagem de desconto se houver
                        if (!empty($discountMessage)) {
                            echo $discountMessage;
                        }

                        // Verificar se o desconto foi aplicado e exibir o total com desconto
                        if ($discountAmount > 0) {
                            echo "<div class='total-discount'><strong>Total com desconto:</strong> R$ " . $totalAfterDiscountFormatted . "</div>";
                        }

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

                        echo '<div class="discount-form-container">';
                        echo '<form method="POST" class="discount-form">';
                        echo '<input type="text" name="discount_code" class="discount-input" placeholder="Código de desconto" required>';
                        echo '<button class="discount-btn" type="submit">Aplicar</button>';
                        echo '</form>';
                        echo '</div>';

                        echo '<div style="font-weight:600;text-align: center; margin-top: 30px;">';
                        echo '<button id="finalize-button" type="button" style="display:none;">Finalizar Compra</button>';
                        echo '</div>';
                    } else {
                        echo "<div><strong>Total inválido.</strong></div>";
                    }
                }
                ?>
            </div>
        </div>
        <div class="checkout-container">
            <div class="form-container">
                <!-- Personal Information Form -->
                <form id="checkout-form" action="process.php" method="POST">
                    <h2 class="form-title">Informações Pessoais</h2>
                    <div class="input-line">
                        <label for="nome">Nome Completo</label>
                        <input type="text" name="nome" placeholder="" required>
                    </div>
                    <div class="input-line">
                        <label for="email">Email</label>
                        <input type="email" name="email" placeholder="" required>
                    </div>
                    <div class="input-line">
                        <label for="endereco">Endereço</label>
                        <input type="text" name="endereco" placeholder="" required>
                    </div>
                    <div class="input-line">
                        <label for="cep">Cep</label>
                        <input type="text" name="cep" placeholder="" required>
                    </div>
                    <div class="input-line">
                        <label for="bairro">Bairro</label>
                        <input type="text" name="bairro" placeholder="" required>
                    </div>
                    <div class="input-line">
                        <label for="cidade">Cidade</label>
                        <input type="text" name="cidade" placeholder="" required>
                    </div>
                    <div class="input-line">
                        <label for="estado">Estado</label>
                        <input type="text" name="estado" placeholder="" required>
                    </div>
                    <div class="input-line">
                        <label for="cpf">CPF</label>
                        <input type="text" name="cpf" placeholder="CPF" required>
                    </div>
                    <div class="input-line">
                        <label for="telefone">Telefone</label>
                        <input type="text" name="telefone" placeholder="Telefone" required>
                    </div>
                    <div class="input-line">
                        <label for="data_nascimento">Data de Nascimento</label>
                        <input type="date" name="data_nascimento" required>
                    </div>
                </form>

                <!-- Payment Section -->
                <div class="payment-container" style="display:none;">
                    <h2 class="form-title">Pagamento</h2>
                    <div class="input-line">
                        <label for="card">Número do Cartão</label>
                        <input type="text" name="card" placeholder="Número do Cartão" required>
                    </div>
                    <div class="input-line">
                        <label for="expiry">Validade</label>
                        <input type="text" name="expiry" placeholder="MM/AA" required>
                    </div>
                </div>

                <!-- Review Section -->
                <div class="review-container" style="display:none;">
                    <h2 class="form-title">Confirmação</h2>
                    <p>Revise suas informações antes de finalizar:</p>
                    <div id="review-info"></div>
                </div>
            </div>
            <div class="step-buttons">
                <button id="prev" style="background:#5a4ec5">Anterior</button>
                <button id="next" style="background:#b8a1e9">Proximo</button>
            </div>
        </div>
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="../js/checkout.js"></script>