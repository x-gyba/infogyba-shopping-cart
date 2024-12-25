<?php
function conecta() {
  if (!defined("HOST")) {
     define('HOST', 'localhost');
  }
  if (!defined("BD")) {
     define('BD', 'login');
  }
  if (!defined("USER")) {
     define('USER', 'root');
  }
  if (!defined("PASS")) {
     define('PASS', 'xp8x11');
  }

  try {
    // Create the PDO connection
    $conn = new PDO('mysql:host=' . HOST . ';dbname=' . BD, USER, PASS);
    
    // Set the character encoding to utf-8
    $conn->exec("SET NAMES 'utf8'");
    
    // Return the connection object
    return $conn;

  } catch (PDOException $erro) {
    // If the connection fails, display the error message
    echo "<script>alert('Erro de conexão: " . $erro->getMessage() . "');</script>";
    return null;  // Return null if the connection fails
  }
}

// Check if the connection is successful and display a message
$conn = conecta();
if ($conn) {
    echo "<script>alert('Conectado ao banco de dados com sucesso!');</script>";
} else {
    echo "<script>alert('Falha na conexão com o banco de dados!');</script>";
}
?>
