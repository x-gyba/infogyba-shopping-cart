<?php
if (isset($_POST['signup'])) {
    // Processamento do formulário de cadastro
    $fname = $_POST['fname'];
    $lname = $_POST['lname'];
    $email = $_POST['email'];
    $senha = $_POST['senha'];

    // Aqui você pode adicionar validações e inserções no banco de dados

    echo "Cadastro realizado com sucesso!";
}

if (isset($_POST['signin'])) {
    // Processamento do formulário de login
    $email = $_POST['email'];
    $senha = $_POST['senha'];

    // Aqui você pode adicionar a verificação de login com o banco de dados

    echo "Login realizado com sucesso!";
}
?>