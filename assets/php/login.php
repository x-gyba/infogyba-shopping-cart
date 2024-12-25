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
  <!-- Formulário de Registro -->
<div class="container" id="signup" style="display:none;">
    <h1 class="box-title">Registro</h1>
    <form method="POST" action="../php/register.php" id="signup-form">
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
        <div class="input-group">
            <i class='bx bxs-lock-alt'></i>
            <input type="password" name="senha" id="senha" placeholder="Insira sua senha." required>
            <label for="senha">Senha</label>   
        </div>
        <input type="submit" class="auth-btn" value="Cadastre-se" name="signup">        
    </form>    
    <div class="links">
        <p>Já tenho uma conta.</p>
        <button class="auth-buttons" id="sign-btn">Entrar</button>    
    </div>    
</div>

<!-- Formulário de Login -->
<div class="container" id="signin">
    <h1 class="box-title">Login</h1>
    <form method="POST" action="../php/register.php" id="signin-form">
        <div class="input-group">
            <i class='bx bx-envelope'></i>
            <input type="email" name="email" id="signin-email" placeholder="Insira seu email." required>
            <label for="signin-email">Email</label>
        </div>
        <div class="input-group">
            <i class='bx bxs-lock-alt'></i>
            <input type="password" name="senha" id="password" placeholder="Insira sua senha." required>
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
    <script src="../js/checkout.js"></script>
</body>

</html>
