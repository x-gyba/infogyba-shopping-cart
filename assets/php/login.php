<?php
// Conectar ao banco de dados
include('conecta.php');
$conn = conecta();

// Função para validar o email
function validaEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Verificar se o formulário foi enviado (registro ou login)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Registro
    if (isset($_POST['signup'])) {
        $nome = $_POST['fname'];
        $sobrenome = $_POST['lname'];
        $email = $_POST['email'];
        $senha = $_POST['senha'];
        $confirmaSenha = $_POST['confirma-senha'];

        // Verificar se o email é válido
        if (!validaEmail($email)) {
            echo "<script>alert('Por favor, insira um email válido!');</script>";
        } elseif ($senha !== $confirmaSenha) {
            echo "<script>alert('As senhas não coincidem!');</script>";
        } else {
            // Criptografar a senha
            $senhaCriptografada = password_hash($senha, PASSWORD_DEFAULT);

            try {
                // Verificar se o email já está cadastrado
                $sql = "SELECT * FROM login WHERE email = :email";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':email', $email, PDO::PARAM_STR);
                $stmt->execute();

                if ($stmt->rowCount() > 0) {
                    echo "<script>alert('Email já cadastrado!');</script>";
                } else {
                    // Inserir novo usuário
                    $nomeCompleto = $nome . ' ' . $sobrenome;
                    $sql = "INSERT INTO login (usuario, email, senha) VALUES (:nome, :email, :senha)";
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(':nome', $nomeCompleto, PDO::PARAM_STR);
                    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
                    $stmt->bindParam(':senha', $senhaCriptografada, PDO::PARAM_STR);

                    if ($stmt->execute()) {
                        echo "<script>alert('Cadastro realizado com sucesso!'); window.location.href='login.php';</script>";
                    } else {
                        echo "<script>alert('Erro ao cadastrar!');</script>";
                    }
                }
            } catch (PDOException $e) {
                echo "<script>alert('Erro no banco de dados: " . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8') . "');</script>";
            }
        }
    }

    // Login
    if (isset($_POST['signin'])) {
        $email = $_POST['email'];
        $senha = $_POST['senha'];

        // Verificar se os campos de email ou senha estão vazios
        if (empty($email) || empty($senha)) {
            echo "<script>alert('Por favor, preencha todos os campos de login!');</script>";
        } elseif (!validaEmail($email)) {
            echo "<script>alert('Por favor, insira um email válido!');</script>";
        } else {
            try {
                // Buscar usuário no banco de dados
                $sql = "SELECT * FROM login WHERE email = :email";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':email', $email, PDO::PARAM_STR);
                $stmt->execute();

                if ($stmt->rowCount() > 0) {
                    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

                    // Verificar se a senha está correta
                    if (password_verify($senha, $usuario['senha'])) {
                        // Iniciar a sessão e armazenar dados do usuário
                        if (session_status() == PHP_SESSION_NONE) {
                            session_start();
                        }
                        $_SESSION['user_id'] = $usuario['id'];
                        $_SESSION['user_name'] = $usuario['usuario'];

                        // Exibir conteúdo de payment.php diretamente
                        echo "<script>
                                document.getElementById('signin').style.display = 'none';
                                document.getElementById('payment').style.display = 'block';
                              </script>";
                    } else {
                        echo "<script>alert('Senha incorreta!');</script>";
                    }
                } else {
                    echo "<script>alert('Email não encontrado!');</script>";
                }
            } catch (PDOException $e) {
                echo "<script>alert('Erro no banco de dados: " . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8') . "');</script>";
            }
        }
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
    <!-- Formulário de Registro -->
    <div class="container" id="signup" style="display:none;">
        <h1 class="box-title">Registro</h1>
        <form method="POST" action="" id="signup-form">
            <div class="input-group">
                <i class='bx bxs-user'></i>
                <input type="text" name="fname" id="fname" placeholder="Insira seu nome." required>
                <label for="fname">Nome</label>   
            </div>
            <div class="input-group">
                <i class='bx bxs-user'></i>
                <input type="text" name="lname" id="lname" placeholder="Insira seu sobrenome." required>
                <label for="lname">Sobrenome</label>   
            </div>
            <div class="input-group">
                <i class='bx bx-envelope'></i>
                <input type="email" name="email" id="signup-email" placeholder="Insira seu email." required>
                <label for="signup-email">Email</label>   
            </div>
            <div class="input-group password-container">
                <i class='bx bxs-lock-alt'></i>
                <input type="password" name="senha" id="senha" placeholder="Insira sua senha." required>
                <label for="senha">Senha</label>
                <i class='bx bx-show' id="eyeicon-show-signup" onclick="togglePasswordVisibility('signup', 'senha')"></i>
                <i class='bx bx-hide' id="eyeicon-hide-signup" onclick="togglePasswordVisibility('signup', 'senha')" style="display: none;"></i>
            </div>
            <div class="input-group password-container">
                <i class='bx bxs-lock-alt'></i>
                <input type="password" name="confirma-senha" id="confirma-senha" placeholder="Confirme sua senha." required>
                <label for="confirma-senha">Confirmar Senha</label>
                <i class='bx bx-show' id="eyeicon-show-confirm" onclick="togglePasswordVisibility('signup', 'confirma-senha')"></i>
                <i class='bx bx-hide' id="eyeicon-hide-confirm" onclick="togglePasswordVisibility('signup', 'confirma-senha')" style="display: none;"></i>
            </div>
            <input type="submit" class="auth-btn" value="Cadastre-se" name="signup">        
        </form>    
        <div class="links">
            <p>Já tenho uma conta.</p>
            <button type="button" class="auth-buttons" id="sign-btn">Entrar</button>    
        </div>    
    </div>

    <!-- Formulário de Login -->
    <div class="container" id="signin">
        <h1 class="box-title">Login</h1>
        <form method="POST" action="" id="signin-form">
            <div class="input-group">
                <i class='bx bx-envelope'></i>
                <input type="email" name="email" id="signin-email" placeholder="Insira seu email." autocomplete="off">
                <label for="signin-email">Email</label>
            </div>
            <div class="input-group password-container">
                <i class='bx bxs-lock-alt'></i>
                <input type="password" name="senha" id="signin-senha" placeholder="Insira sua senha." autocomplete="off">
                <label for="signin-senha">Senha</label>
                <i class='bx bx-show' id="eyeicon-show-login" onclick="togglePasswordVisibility('login', 'signin-senha')"></i>
                <i class='bx bx-hide' id="eyeicon-hide-login" onclick="togglePasswordVisibility('login', 'signin-senha')" style="display: none;"></i>
            </div>
            <p class="recover"><a href="#">Esqueci minha senha.</a></p>
            <input type="submit" class="auth-btn" value="Entrar" name="signin">
            <div class="links">
                <p>Não tenho uma conta.</p>
                <button type="button" class="auth-buttons" id="signup-btn">Cadastre-se</button>    
            </div>    
        </form>  
    </div>

    <!-- Conteúdo de pagamento (Será exibido após login) -->
    <div class="container" id="payment" style="display:none;">
        <h2>Pagamento</h2>
        <p>Informações de pagamento aqui.</p>
        <!-- Seu conteúdo de pagamento aqui -->
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="../js/checkout.js"></script>
</body>
</html>
