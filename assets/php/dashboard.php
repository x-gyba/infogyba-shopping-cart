<?php
// Gerar a senha criptografada
$senha = 'Elshadday2030!';
$senhaCriptografada = password_hash($senha, PASSWORD_DEFAULT);

// Exibir a senha criptografada
echo $senhaCriptografada;
?>