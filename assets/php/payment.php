<?php
session_start();

// Assumindo que a lógica de desconto e parcelamento já está implementada.
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pagamento</title>
  <link rel="stylesheet" href="../css/checkout.css" />
</head>
<body>
  <div class="payment-container">
    <h2 class="form-title">Pagamento Cartão de Crédito</h2>
    <form action="payment.php" class="payment-form" method="post">
      <div class="form-group">
        <label for="name">Nome Completo</label>
        <input type="text" id="name" placeholder="Informe seu nome completo" required autocomplete="off">
      </div>
      <div class="form-group">
        <label for="card-number">Número Cartão</label>
        <input type="text" id="card-number" placeholder="1234 5678 9012 3456" required autocomplete="off">
      </div>
      <div class="form-group">
        <label for="expiry-month">Mês de Validade</label>
        <select id="expiry-month" required>
          <!-- Meses -->
        </select>
      </div>
      <div class="form-group">
        <label for="expiry-year">Ano de Validade</label>
        <select id="expiry-year" required>
          <!-- Anos -->
        </select>
      </div>
      <div class="form-group">
        <label for="cvv">CVV</label>
        <input type="text" id="cvv" placeholder="123" required autocomplete="off">
      </div>
      <div class="form-group">
        <label for="installments">Parcelas sem Juros</label>
        <select id="installments" required>
          <!-- Parcelas -->
        </select>
      </div>
      <button type="submit">Pagar</button>
    </form>
  </div>
</body>
</html>
