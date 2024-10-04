<link rel="stylesheet" href="../css/checkout.css" />
<link rel="stylesheet" href="/css/boxicons.min.css">

<div class="progress-checkout-container">
    <div class="progress-step-container">
        <div class="step-check"><span>1</span></div>
        <span class="step-title">Informações Pessoais</span>
    </div>
    <div class="progress-step-container">
        <div class="step-check"><span>2</span></div>
        <span class="step-title">Pagamento</span>
    </div>
    <div class="progress-step-container">
        <div class="step-check"><span>3</span></div>
        <span class="step-title">Revisão</span>
    </div>
</div>

<div class="checkout-container">
    <div class="form-checkout">
        <div class="step-content"> <!-- Wrap each step -->
            <h2 class="form-title">Informações Pessoais</h2>
            <form id="checkout-form" action="process.php" method="POST">
                <div class="input-line">
                    <label for="nome">Nome</label>
                    <input type="text" name="nome" placeholder="Nome" required>
                </div>
                <div class="input-line">
                    <label for="sobrenome">Sobrenome</label>
                    <input type="text" name="sobrenome" placeholder="Sobrenome" required>
                </div>
                <div class="input-line">
                    <label for="email">Email</label>
                    <input type="text" name="email" placeholder="Email" required>
                </div>
                <div class="input-line">
                    <label for="endereco">Endereço</label>
                    <input type="text" name="endereco" placeholder="Endereço" required>
                </div>
                <div class="input-line">
                    <label for="cidade">Cidade</label>
                    <input type="text" name="cidade" placeholder="Cidade" required>
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
                <button type="button" onclick="nextStep()">Próximo</button>
            </form>
        </div>

        <div class="step-content" style="display:none;"> <!-- Payment step -->
            <h2 class="form-title">Pagamento</h2>
            <div class="input-line">
                <label for="card">Número do Cartão</label>
                <input type="text" name="card" placeholder="Número do Cartão" required>
            </div>
            <div class="input-line">
                <label for="expiry">Validade</label>
                <input type="text" name="expiry" placeholder="MM/AA" required>
            </div>
            <button type="button" onclick="prevStep()">Anterior</button>
            <button type="button" onclick="nextStep()">Próximo</button>
        </div>

        <div class="step-content" style="display:none;"> <!-- Review step -->
            <h2 class="form-title">Revisão</h2>
            <p>Revise suas informações antes de finalizar:</p>
            <div id="review-info"></div>
            <button type="button" onclick="prevStep()">Anterior</button>
            <button type="submit"><i class="bx bx-cart-alt"></i>Finalizar</button>
        </div>
    </div>
    <div class="cart-summary">
        <h1 class="summary-title">Resumo do Carrinho:</h1>
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
                    echo "<div style='flex: 0 0 auto; margin-right: 8px;'><img src='" . htmlspecialchars($imageSrc) . "' alt='Imagem do Carrinho' style='max-width: 75px; height: auto;' /></div>";
                }
                echo "<div class='qtd-item' style='flex: 1;'>" . nl2br(htmlspecialchars($item)) . " " . $quantityDisplay . "</div>";
                echo "</div>";
            }
            echo '<div style="font-weight:600;text-align: center; margin-top: 30px;">';
            echo '<button id="finalize-button" type="button">Finalizar Compra</button>';
            echo '</div>';
        }
        unset($_SESSION['cart_total'], $_SESSION['cart_items'], $_SESSION['cart_images'], $_SESSION['quantities']);
        ?>
    </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="../js/checkout.js"></script>

