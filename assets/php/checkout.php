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

            <div class="cart-summary">
                <h2>Resumo do Carrinho</h2>
                <?php
                $total = isset($_SESSION['cart_total']) ? $_SESSION['cart_total'] : 0;
                $items = isset($_SESSION['cart_items']) ? $_SESSION['cart_items'] : [];
                $imageSrcArray = isset($_SESSION['cart_images']) ? $_SESSION['cart_images'] : [];
                $quantities = isset($_SESSION['quantities']) ? $_SESSION['quantities'] : [];

                if (empty($items) || $total === 0) {
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
                    echo '<button id="finalize-button" type="button" style="display:none;">Finalizar Compra</button>';
                    echo '</div>';
                }
                ?>
            </div>
            <div class="form-container">
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
                            <input type="text" name="nome" placeholder="" required>
                        </div>
                        <div class="input-line">
                            <label for="email">Email</label>
                            <input type="email" name="email" placeholder="" required>
                        </div>
                        <div class="input-line">
                            <label for="login-password">Senha</label>
                            <input type="password" id="login-password" required placeholder="" />
                        </div>
                        <div class="input-line">
                            <label for="confirm-password">Confirme a senha</label>
                            <input type="password" id="confirm-password" required placeholder="" />
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
                        <div class="button-container">
                            <button type="submit" class="primary-button">Registrar</button>
                            <button type="button" class="auth-toggle-btn" onclick="toggleForms()">Já tem uma conta? Faça login</button>
                        </div>
                    </form>
                </div>
                <div class="payment-container">
                    <h2 class="form-title">Pagamento Cartão de Crédito</h2>
                    <div class="image">
                        <i class='bx bxl-visa'></i>
                        <i class='bx bxl-mastercard'></i>
                    </div>
                    <div class="card-container">
                        <div class="front-card">
                            <div class="card-number-box">################</div>
                            <div class="flex-box">
                                <div class="box">
                                    <span>titular do cartão</span>
                                    <div class="card-holder-name">nome completo</div>
                                </div>
                                <div class="box">
                                    <span>validade</span>
                                    <div class="expiration">
                                        <span class="exp-month">mm</span>
                                        <span class="exp-year">yy</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form class="payment-form">
                        <div class="input-box">
                            <span>Número do Cartão</span>
                            <input type="text" maxlength="16" class="card-number-input">
                        </div>
                        <div class="input-box">
                            <span>titular do cartão</span>
                            <input type="text" maxlength="16" class="card-holder-input">
                        </div>
                        <div class="flex-box">
                            <div class="input-box">
                                <span>Validade mm</span>
                                <select name="" id="" clas="month-input">
                                    <option value="Mes" selected disabled>Mês</option>
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
                            <div class="input-box">
                                <span>Expiração yy</span>
                                <select name="" id="" clas="year-input">
                                    <option value="Ano" selected disabled>Ano</option>
                                    <option value="2021">2021</option>
                                    <option value="2022">2022</option>
                                    <option value="2023">2023</option>
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                    <option value="2027">2027</option>
                                    <option value="2028">2028</option>
                                    <option value="2029">2029</option>
                                    <option value="2030">2030</option>
                                </select>
                            </div>
                            <div class="input-box">
                                <span>CVV</span>
                                <input type="text" maxlength="4" class="cvv-input">
                            </div>
                        </div>
                        <input type="submit" value="Enviar" class="submit-btn">
                    </form>
                </div>

                <div class="review-container">
                    <h2 class="form-title">Confirmação</h2>
                    <p>Revise suas informações antes de finalizar:</p>
                    <div id="review-info"></div>
                </div>

                <div class="step-buttons">
                    <button id="prev" style="width:80px;background:#5a4ec5">Anterior</button>
                    <button id="next" style="width:80px;background:#5a4ec5">Próximo</button>
                </div>
            </div>
        </div>


        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
        <script src="../js/checkout.js"></script>
</body>

</html>