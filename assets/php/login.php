<?php
// Conectar ao banco de dados
include('conecta.php');
$conn = conecta();

// Função para validar o email
function validaEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Função para escapar dados de entrada contra XSS
function sanitizeInput($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// Função para exibir alertas em JavaScript
function exibirAlerta($mensagem) {
    echo "<script>document.addEventListener('DOMContentLoaded', function() { alert('{$mensagem}'); });</script>";
}

// Processar registro
function processaRegistro($conn) {
    $nome = sanitizeInput($_POST['fname']);
    $sobrenome = sanitizeInput($_POST['lname']);
    $email = sanitizeInput($_POST['email']);
    $senha = $_POST['senha'];
    $confirmaSenha = $_POST['confirma-senha'];

    if (!validaEmail($email)) {
        exibirAlerta('Por favor, insira um email válido!');
    } elseif ($senha !== $confirmaSenha) {
        exibirAlerta('As senhas não coincidem!');
    } else {
        $senhaCriptografada = password_hash($senha, PASSWORD_DEFAULT);

        try {
            $sql = "SELECT * FROM login WHERE email = :email";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                exibirAlerta('Email já cadastrado!');
            } else {
                $nomeCompleto = $nome . ' ' . $sobrenome;
                $sql = "INSERT INTO login (usuario, email, senha) VALUES (:nome, :email, :senha)";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':nome', $nomeCompleto, PDO::PARAM_STR);
                $stmt->bindParam(':email', $email, PDO::PARAM_STR);
                $stmt->bindParam(':senha', $senhaCriptografada, PDO::PARAM_STR);

                if ($stmt->execute()) {
                    echo "<script>
                        document.addEventListener('DOMContentLoaded', function() {
                            alert('Cadastro realizado com sucesso!');
                            window.location.href='login.php';
                        });
                    </script>";
                } else {
                    exibirAlerta('Erro ao cadastrar!');
                }
            }
        } catch (PDOException $e) {
            exibirAlerta('Erro no banco de dados: ' . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8'));
        }
    }
}

// Processar login
function processaLogin($conn) {
    $email = sanitizeInput($_POST['email']);
    $senha = $_POST['senha'];

    if (empty($email) || empty($senha)) {
        exibirAlerta('Por favor, preencha todos os campos de login!');
    } elseif (!validaEmail($email)) {
        exibirAlerta('Por favor, insira um email válido!');
    } else {
        try {
            $sql = "SELECT * FROM login WHERE email = :email";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

                if (password_verify($senha, $usuario['senha'])) {
                    if (session_status() == PHP_SESSION_NONE) {
                        session_start();
                    }
                    $_SESSION['user_id'] = $usuario['id'];
                    $_SESSION['user_name'] = $usuario['usuario'];
                    if ($usuario['email'] === 'admin@infogyba.com.br' || $usuario['id'] == 1) {
                        echo "<script>
                            document.addEventListener('DOMContentLoaded', function() {
                                alert('Login bem-sucedido, bem-vindo de volta, administrador!');
                                window.location.replace('dashboard.php');
                            });
                        </script>";
                    } else {
                        echo "<script>
                            document.addEventListener('DOMContentLoaded', function() {
                                alert('Login bem-sucedido!');
                                window.location.replace('dashboard.php');
                            });
                        </script>";
                    }
                } else {
                    exibirAlerta('Senha incorreta!');
                }
            } else {
                exibirAlerta('Email não encontrado!');
            }
        } catch (PDOException $e) {
            exibirAlerta('Erro no banco de dados: ' . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8'));
        }
    }
}

// Verificar se o formulário foi enviado (registro ou login)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['signup'])) {
        processaRegistro($conn);
    } elseif (isset($_POST['signin'])) {
        processaLogin($conn);
    }
}
?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login / Registro</title>
    <link rel="stylesheet" href="../css/checkout.css" />
    <link rel="stylesheet" href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" />
</head>

<body>
    <!-- Formulário de Login -->
    <div class="container" id="signin">
        <h1 class="box-title">Login</h1>
        <form method="POST" action="" id="signin-form">
            <div class="input-group">
                <i class='bx bx-envelope'></i>
                <input type="email" id="signin-email" name="email" placeholder="Digite seu email" required>
                <label for="signin-email">Email</label>
                <span class="error-message" id="signin-email-error"></span>
            </div>
            <div class="input-group password-container">
                <i class='bx bx-lock'></i>
                <input type="password" id="senha_signin" name="senha" placeholder="Digite sua senha" required>
                <label for="senha_signin">Senha</label>
                <span class="error-message" id="senha_signin-error"></span>
                <i class='bx bx-show eye-icon' id="eyeicon-show-senha_signin" onclick="togglePasswordVisibility('signin')"></i>
                <i class='bx bx-hide eye-icon' id="eyeicon-hide-senha_signin" onclick="togglePasswordVisibility('signin')" style="display: none;"></i>
            </div>
            <input type="submit" class="auth-btn" value="Entrar" name="signin">
        </form>
        <div class="links">
            <p>Não tem uma conta?</p>
            <button type="button" class="auth-buttons" id="signup-btn">Registrar</button>
        </div>
    </div>

    <!-- Formulário de Registro -->
    <div class="container" id="signup" style="display: none;">
        <h1 class="box-title">Registro</h1>
        <form method="POST" action="" id="signup-form">
            <!-- Tipo de Pessoa (Pessoa Física ou Jurídica) -->
            <div class="radio-container">
                <div class="input-group">
                    <h3 class="title">Tipo de Pessoa:</h3>
                    <div class="radio-form">
                        <div class="radio-group">
                            <div class="radio-item">
                                <label for="pessoa_fisica">Pessoa Física</label>
                                <input type="radio" id="pessoa_fisica" name="tipo_pessoa" value="fisica" checked onchange="togglePessoa('fisica')">
                            </div>
                            <div class="radio-item">
                                <label for="pessoa_juridica">Pessoa Jurídica</label>
                                <input type="radio" id="pessoa_juridica" name="tipo_pessoa" value="juridica" onchange="togglePessoa('juridica')">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Campos comuns para Pessoa Física e Jurídica -->
            <div class="input-group">
                <i class='bx bx-envelope'></i>
                <input type="email" id="email_common" name="email" placeholder="Digite seu email" required>
                <label for="email_common">Email</label>
                <span class="error-message" id="email_common-error"></span>
            </div>

            <!-- Campos específicos de Pessoa Física -->
            <div id="pessoa-fisica" class="common-fields">
                <div class="input-group">
                    <i class='bx bx-user'></i>
                    <input type="text" id="nome_completo" name="nome_completo" placeholder="Digite seu nome completo" required>
                    <label for="nome_completo">Nome Completo</label>
                    <span class="error-message" id="nome_completo-error"></span>
                </div>
                <div class="input-group">
                    <i class='bx bx-notepad'></i>
                    <input type="text" id="cpf" name="cpf" placeholder="Digite seu CPF" required>
                    <label for="cpf">CPF</label>
                    <span class="error-message" id="cpf-error"></span>
                </div>
                <div class="input-group">
                    <i class='bx bx-mobile-vibration'></i>
                    <input type="text" id="celular" name="celular" placeholder="Digite seu celular" required>
                    <label for="celular">Celular</label>
                    <span class="error-message" id="celular-error"></span>
                </div>
            </div>

            <!-- Campos específicos de Pessoa Jurídica -->
            <div id="pessoa-juridica" class="hidden-section" style="display: none;">
                <div class="input-group">
                    <i class='bx bx-notepad'></i>
                    <input type="text" id="cnpj" name="cnpj" placeholder="Digite o CNPJ" data-required="true">
                    <label for="cnpj">CNPJ</label>
                    <span class="error-message" id="cnpj-error"></span>
                </div>
                
                <div class="input-group">
                    <i class='bx bx-notepad'></i>
                    <input type="text" id="inscricao_estadual" name="inscricao_estadual" placeholder="Digite a Inscrição Estadual" data-required="true">
                    <label for="inscricao_estadual">Inscrição Estadual</label>
                    <span class="error-message" id="inscricao_estadual-error"></span>
                </div>
                
                <div class="input-group">
                    <i class='bx bx-notepad'></i>
                    <input type="text" id="razao_social" name="razao_social" placeholder="Digite a Razão Social" data-required="true">
                    <label for="razao_social">Razão Social</label>
                    <span class="error-message" id="razao_social-error"></span>
                </div>
                
                <div class="input-group">
                    <i class='bx bx-user'></i>
                    <input type="text" id="nome_responsavel" name="nome_responsavel" placeholder="Digite o nome do responsável" data-required="true">
                    <label for="nome_responsavel">Nome Completo (Responsável)</label>
                    <span class="error-message" id="nome_responsavel-error"></span>
                </div>
                
                <div class="input-group">
                    <i class='bx bx-mobile-vibration'></i>
                    <input type="text" id="celular_responsavel" name="celular_responsavel" placeholder="Digite o celular do responsável" data-required="true">
                    <label for="celular_responsavel">Celular (Responsável)</label>
                    <span class="error-message" id="celular_responsavel-error"></span>
                </div>
            </div>

            <!-- Senha -->
            <div class="input-group password-container">
                <i class='bx bx-lock'></i>
                <input type="password" id="senha_signup" name="senha" placeholder="Digite sua senha" required>
                <label for="senha_signup">Senha</label>
                <span class="error-message" id="senha_signup-error"></span>
                <i class='bx bx-show eye-icon' id="eyeicon-show-senha_signup" onclick="togglePasswordVisibility('signup')"></i>
                <i class='bx bx-hide eye-icon' id="eyeicon-hide-senha_signup" onclick="togglePasswordVisibility('signup')" style="display: none;"></i>
            </div>

            <!-- Confirmar Senha -->
            <div class="input-group password-container">
                <i class='bx bx-lock-alt'></i>
                <input type="password" id="confirmar_senha_signup" name="confirmar_senha" placeholder="Confirme sua senha" required>
                <label for="confirmar_senha_signup">Confirmar Senha</label>
                <span class="error-message" id="confirmar_senha_signup-error"></span>
                <i class='bx bx-show eye-icon' id="eyeicon-show-confirmar_senha_signup" onclick="toggleConfirmPasswordVisibility()"></i>
                <i class='bx bx-hide eye-icon' id="eyeicon-hide-confirmar_senha_signup" onclick="toggleConfirmPasswordVisibility()" style="display: none;"></i>
            </div>

            <input type="submit" class="auth-btn" value="Cadastre-se" name="signup">
        </form>
        <div class="links">
            <p>Já tem uma conta?</p>
            <button type="button" class="auth-buttons" id="signin-btn">Entrar</button>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="../js/checkout.js"></script>
</body>

</html>