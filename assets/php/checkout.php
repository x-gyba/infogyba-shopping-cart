<link rel="stylesheet" href="../css/checkout.css" />
<link rel="stylesheet" href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" />

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
            <button type="submit" class="primary-button">Entrar</button>
            <button type="button" class="auth-toggle-btn" onclick="toggleForms()">Não tem uma conta? Registre-se</button>
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
            <button type="submit" class="primary-button">Registrar</button>
            <button type="button" class="auth-toggle-btn" onclick="toggleForms()">Já tem uma conta? Faça login</button>
        </form>
    </div>

    <div class="payment-container">
        <h2 class="form-title">Pagamento</h2>
        <div class="input-line">
            <label for="card">Número do Cartão</label>
            <input type="text" name="card" placeholder="Número do Cartão" required>
        </div>
        <div class="input-line">
            <label for="expiry">Validade</label>
            <input type="text" name="expiry" placeholder="MM/AA" required>
        </div>
        <div class="input-line">
            <label for="cvv">CVV</label>
            <input type="text" name="cvv" placeholder="CVV" required maxlength="3">
        </div>
    </div>

    <div class="review-container">
        <h2 class="form-title">Confirmação</h2>
        <p>Revise suas informações antes de finalizar:</p>
        <div id="review-info"></div>
    </div>


    <div class="step-buttons">
        <button id="prev" style="background:#5a4ec5">Anterior</button>
        <button id="next" style="background:#5a4ec5">Próximo</button>
    </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="../js/checkout.js"></script>