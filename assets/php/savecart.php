<?php
session_start();
// Receber dados JSON do POST
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if ($data) {
    $_SESSION['cart_total'] = $data['total'];
    $_SESSION['cart_items'] = $data['items'];
    $_SESSION['cart_images'] = $data['images']; // Armazenar a URL da imagem na sessão
    $_SESSION['quantities'] = $data['quantities'];

    // Enviar uma resposta ao código JavaScript
    echo json_encode(['status' => 'success']);
} else {
    // Enviar uma resposta de erro
    echo json_encode(['status' => 'error', 'message' => 'Failed to save data']);
}
