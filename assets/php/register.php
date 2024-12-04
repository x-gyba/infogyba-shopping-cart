<?php
// register.php

session_start();
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registro</title>
  <link rel="stylesheet" href="../css/checkout.css" />
</head>
<body>
  <form action="register.php" id="register-form" class="checkout-form" method="post">
    <h2 class="form-title">Registro</h2>
    <div class="input-line">
      <label for="nome">Nome Completo</label>
      <input type="text" name="nome" required autocomplete="off">
    </div>
    <div class="input-line">
      <label for="email">Email</label>
      <input type="email" name="email" required autocomplete="off">
    </div>
    <div class="input-line">
      <label for="register-password">Senha</label>
      <input type="password" id="register-password" required autocomplete="off" />
    </div>
    <div class="input-line">
      <label for="confirm-password">Confirme a senha</label>
      <input type="password" id="confirm-password" required autocomplete="off" />
    </div>
    <div class="input-line">
      <label for="cep">Cep</label>
      <input type="text" name="cep" id="cep" required autocomplete="off">
    </div>
    <div class="input-line">
      <label for="endereco">Endereço</label>
      <input type="text" name="endereco" required autocomplete="off">
    </div>
    <div class="checkbox-line">
      <input type="checkbox" id="same-address" name="same-address">
      <label for="same-address">Mesmo endereço para entrega</label>
    </div>
    <div class="input-line">
      <label for="bairro">Bairro</label>
      <input type="text" name="bairro" required autocomplete="off">
    </div>
    <div class="input-line">
      <label for="cidade">Cidade</label>
      <input type="text" name="cidade" required autocomplete="off">
    </div>
    <div class="input-line">
      <label for="estado">Estado</label>
      <input type="text" name="estado" required autocomplete="off">
    </div>
    <div class="input-line">
      <label for="cpf">CPF</label>
      <input type="text" name="cpf" id="cpf" required autocomplete="off">
    </div>
    <div class="input-line">
      <label for="telefone">Telefone</label>
      <input type="text" name="telefone" id="telefone" required autocomplete="off">
    </div>
    <div class="input-line">
      <label for="data_nascimento">Data de Nascimento</label>
      <input type="date" name="data_nascimento" required autocomplete="off">
    </div>
    <div class="button-container">
      <button type="submit" class="primary-button">Registrar</button>
      <button type="button" class="auth-toggle-btn" onclick="window.location.href='login.php'">Já tem uma conta? Faça login</button>
    </div>
  </form>
</body>
</html>
