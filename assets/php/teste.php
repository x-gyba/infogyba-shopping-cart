<?php
require_once("conecta.php");  // Include connection file

try {
    // Connect to the database using PDO from the `conecta()` function
    $conn = conecta();  // Assuming `conecta()` returns a PDO connection

    // Definindo dados para teste
    $nome = "Jhon";  // Nome do usuário
    $sobrenome = "Wick";  // Sobrenome do usuário
    $email = "infogyba@ymail.com";  // Email do usuário
    $senha = "xp8x11";  // Senha do usuário

    // Criptografando a senha antes de armazenar
    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);

    // Verificando se o email já existe no banco de dados
    $stmt = $conn->prepare("SELECT COUNT(*) FROM usuarios WHERE email = :email");
    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
    $stmt->execute();

    // Se o email já existir
    if ($stmt->fetchColumn() > 0) {
        echo "<script>alert('Email já cadastrado.');</script>";
    } else {
        // Preparando a consulta para inserir os dados no banco
        $stmt = $conn->prepare("INSERT INTO usuarios (nome, sobrenome, email, senha) VALUES (:nome, :sobrenome, :email, :senha)");
        $stmt->bindParam(':nome', $nome, PDO::PARAM_STR);
        $stmt->bindParam(':sobrenome', $sobrenome, PDO::PARAM_STR);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':senha', $senhaHash, PDO::PARAM_STR);

        // Se os dados foram inseridos com sucesso
        if ($stmt->execute()) {  
            echo "<script>alert('Usuário cadastrado com sucesso.');</script>";
        } else {  // Se houve um erro ao inserir os dados
            echo "<script>alert('Erro ao cadastrar usuário.');</script>";
        }
    }
} catch (PDOException $e) {
    // Captura e exibe o erro caso ocorra
    echo "Error: " . $e->getMessage();
}

// Fechando a conexão
$conn = null;
?>
