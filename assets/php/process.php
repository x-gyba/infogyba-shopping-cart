<?php
// process.php
header('Content-Type: application/json');

// Recebe a requisição em JSON
$data = json_decode(file_get_contents('php://input'), true);

// Verifica se os dados foram recebidos corretamente
if ($data) {
    $user = $data['user'];
    $purchaseConfirmed = $data['purchaseConfirmed'];
    $timestamp = $data['timestamp'];

    // Simula algum processamento no servidor, como salvar dados ou processar a compra

    // Envia uma resposta de sucesso
    echo json_encode(['success' => true, 'message' => 'Dados recebidos com sucesso']);
} else {
    // Se não receber dados válidos
    echo json_encode(['success' => false, 'message' => 'Erro ao processar dados']);
}
?>
