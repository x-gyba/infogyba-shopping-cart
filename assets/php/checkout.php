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

                $total = isset($_SESSION['cart_total']) ? $_SESSION['cart_total'] : 0;

                $items = isset($_SESSION['cart_items']) ? $_SESSION['cart_items'] : [];
                $imageSrcArray = isset($_SESSION['cart_images']) ? $_SESSION['cart_images'] : [];
                $quantities = isset($_SESSION['quantities']) ? $_SESSION['quantities'] : [];

                if ($total === 0) {
                    echo "<div class='carrinho-vazio'>Carrinho vazio.</div>";
                } else {
                    if (is_numeric($total)) {
                        $totalFormatted = number_format((float)$total, 2, ',', '.');
                        echo "<div class='total-title'><strong>Total:</strong> R$ " . $totalFormatted . "</div>";
                    } else {
                        echo "<div><strong>Total inválido.</strong></div>";
                    }

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
                    echo '<div style="font-weight:600;text-align: center; margin-top: 30px;">';
                    echo '<button id="finalize-button" type="button" style="display:none;">Finalizar Compra</button>';
                    echo '</div>';
                }
                unset($_SESSION['cart_total'], $_SESSION['cart_items'], $_SESSION['cart_images'], $_SESSION['quantities']);
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
                        <input type="text" name="nome" placeholder="Nome" required>
                    </div>
                    <div class="input-line">
                        <label for="email">Email</label>
                        <input type="email" name="email" placeholder="Email" required>
                    </div>
                    <div class="input-line">
                        <label for="endereco">Endereço</label>
                        <input type="text" name="endereco" placeholder="Endereço" required>
                    </div>
                    <div class="input-line">
                        <label for="cep">Cep</label>
                        <input type="text" name="cep" placeholder="Cep" required>
                    </div>
                    <div class="input-line">
                        <label for="bairro">Bairro</label>
                        <input type="text" name="bairro" placeholder="Bairro" required>
                    </div>
                    <div class="input-line">
                        <label for="cidade">Cidade</label>
                        <input type="text" name="cidade" placeholder="Cidade" required>
                    </div>
                    <div class="input-line">
                        <label for="estado">Estado</label>
                        <input type="text" name="estado" placeholder="Estado" required>
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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="../js/checkout.js"></script>