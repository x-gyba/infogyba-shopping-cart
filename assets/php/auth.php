<?php
// Verificar se o formulário foi enviado
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitização das entradas
    $fname = isset($_POST['fname']) ? htmlspecialchars(trim($_POST['fname'])) : '';
    $lname = isset($_POST['lname']) ? htmlspecialchars(trim($_POST['lname'])) : '';
    $email = isset($_POST['email']) ? htmlspecialchars(trim($_POST['email'])) : '';
    $password = isset($_POST['password']) ? htmlspecialchars(trim($_POST['password'])) : '';

    // Validar e processar o registro (Cadastro)
    if (isset($_POST['signup'])) {
        // Verifique se os campos estão preenchidos corretamente
        if (empty($fname) || empty($lname) || empty($email) || empty($password)) {
            echo "Por favor, preencha todos os campos.";
        } else {
            // Conectar ao banco e inserir os dados (exemplo)
            include('conecta.php');
            $conn = conecta();

            try {
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT); // Hash da senha
                $sql = "INSERT INTO users (fname, lname, email, password) VALUES (:fname, :lname, :email, :password)";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':fname', $fname);
                $stmt->bindParam(':lname', $lname);
                $stmt->bindParam(':email', $email);
                $stmt->bindParam(':password', $hashedPassword);
                $stmt->execute();

                echo "Cadastro realizado com sucesso!";
            } catch (PDOException $e) {
                echo "Erro ao cadastrar: " . htmlspecialchars($e->getMessage()); // Proteção contra XSS
            }
        }
    }

    // Validar e processar o login
    if (isset($_POST['signin'])) {
        // Verifique se o email e a senha foram preenchidos
        if (empty($email) || empty($password)) {
            echo "Por favor, preencha o e-mail e a senha.";
        } else {
            // Conectar ao banco e verificar as credenciais
            include('conecta.php');
            $conn = conecta();

            try {
                $sql = "SELECT * FROM users WHERE email = :email";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':email', $email);
                $stmt->execute();

                if ($stmt->rowCount() > 0) {
                    $user = $stmt->fetch(PDO::FETCH_ASSOC);

                    // Verificar a senha
                    if (password_verify($password, $user['password'])) {
                        // Login bem-sucedido
                        session_start();
                        $_SESSION['user_id'] = $user['id'];
                        $_SESSION['user_name'] = $user['fname'];
                        echo "Login bem-sucedido!";
                    } else {
                        echo "Senha incorreta!";
                    }
                } else {
                    echo "Email não encontrado!";
                }
            } catch (PDOException $e) {
                echo "Erro ao verificar login: " . htmlspecialchars($e->getMessage()); // Proteção contra XSS
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
    <title>Login</title>
    <link rel="stylesheet" href="../css/checkout.css" />
    <link rel="stylesheet" href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" />
</head>

<body>
    <div class="container" id="signup" style="display:none;">
        <h1 class="box-title">Registro</h1>
        <form method="post" action="">
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
                <i class='bx bx-envelope' ></i>
                <input type="email" name="email" id="email" placeholder="Insira seu email." required>
                <label for="fname">Email</label>   
            </div>
            <div class="input-group">
                <i class='bx bxs-lock-alt' ></i>
                <input type="password" name="password" id="password" placeholder="Insira sua senha." required>
                <label for="password">Senha</label>   
            </div>
            <input type="submit" class="auth-btn" value="Cadastre-se" name="signup">        
        </form>    
        <div class="links">
            <p>Já tenho uma conta.</p>
            <button class="auth-buttons" id="sign-btn">Entrar</button>    
        </div>    
    </div>

    <div class="container" id="signin">
        <h1 class="box-title">Login</h1>
        <form method="post" action="">
            <div class="input-group">
                <i class='bx bx-envelope' ></i>
                <input type="email" name="email" id="email" placeholder="Insira seu email." required> 
                <label for="fname">Email</label>     
            </div>
            <div class="input-group">
                <i class='bx bxs-lock-alt' ></i>
                <input type="password" name="password" id="password" placeholder="Insira sua senha." required>
                <label for="password">Senha</label>       
            </div>
            <p class="recover"><a href="#">Esqueci minha senha.</a></p>
            <input type="submit" class="auth-btn" value="Entrar" name="signin"> 
            <div class="links">
                <p>Não tenho uma conta.</p>
                <button class="auth-buttons" id="signup-btn">Cadastre-se</button>    
            </div>    
        </form>    
    </div>     

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
</body>

</html>
