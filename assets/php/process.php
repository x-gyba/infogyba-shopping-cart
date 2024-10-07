<?php


session_start();
require_once('../php/conecta.php'); // Make sure this connects to your database
$conn = conecta();

// Verifique se a conexão foi bem sucedida
if ($conn) {
    echo "Conexão ao banco de dados foi bem-sucedida!";
} else {
    echo "Falha na conexão ao banco de dados.";
}

// /*  Verifique se os dados foram enviados via POST */
//  // Coletar dados do formulário
//  $nome = $_POST['nome'];
//  $sobrenome = $_POST['sobrenome'];
//  $email = $_POST['email'];
//  $endereco = $_POST['endereco'];
//  $bairro = $_POST['bairro'];
//  $cidade = $_POST['cidade'];
//  $cep = $_POST['cep'];
//  $cpf = $_POST['cpf'];
//  $telefone = $_POST['telefone'];
//  $data_nascimento = $_POST['data_nascimento'];

//  // Exibir os dados usando var_dump
//  var_dump($nome, $sobrenome, $email, $endereco, $bairro, $cidade, $cep, $cpf, $telefone, $data_nascimento);
