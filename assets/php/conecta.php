<?php
function conecta( ){
  if(!defined("HOST")){
     define('HOST','localhost');
  }
  if(!defined("BD")){
     define('BD','loja');
  }
  if(!defined("USER")){
     define('USER','root');
  }
  if(!defined("PASS")){
     define('PASS','xp8x11');
  }
try {
$conn = new PDO('mysql:host='.HOST.';dbname='.BD.'', ''.USER.'', ''.PASS.'');
$conn->exec("SET NAMES 'utf8'");
}
catch(PDOException $erro){
echo $erro->getMessage();
}
return $conn;
}