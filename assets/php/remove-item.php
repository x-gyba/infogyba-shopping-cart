<?php
session_start();
header('Content-Type: application/json');

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['itemId']) || !is_numeric($input['itemId'])) {
        throw new Exception('ID do item inválido.');
    }

    $itemIdToRemove = (int)$input['itemId'];
    
    // Debug dos arrays antes da remoção
    error_log('Cart before: ' . print_r($_SESSION['cart_items'], true));
    error_log('Quantities before: ' . print_r($_SESSION['quantities'], true));
    
    // Verifica se o item existe antes de removê-lo
    if (!isset($_SESSION['cart_items'][$itemIdToRemove])) {
        throw new Exception('Item não encontrado no carrinho.');
    }

    // Remove o item mantendo os índices originais
    unset($_SESSION['cart_items'][$itemIdToRemove]);
    unset($_SESSION['quantities'][$itemIdToRemove]);
    if (isset($_SESSION['cart_images'][$itemIdToRemove])) {
        unset($_SESSION['cart_images'][$itemIdToRemove]);
    }

    // NÃO reindexar os arrays para manter os IDs originais
    
    // Recalcula o total
    $newTotal = 0;
    foreach ($_SESSION['cart_items'] as $index => $item) {
        // Extrai o preço da string do item usando regex
        if (preg_match('/R\$\s*(\d+(?:\.\d{3})*(?:,\d{2})?)/', $item, $matches)) {
            $priceStr = $matches[1];
            // Converte o preço para formato numérico
            $priceStr = str_replace('.', '', $priceStr); // Remove pontos de milhar
            $priceStr = str_replace(',', '.', $priceStr); // Substitui vírgula por ponto
            $price = (float)$priceStr;
            
            // Pega a quantidade
            $quantity = isset($_SESSION['quantities'][$index]) ? (int)$_SESSION['quantities'][$index] : 1;
            
            // Adiciona ao total
            $itemTotal = $price * $quantity;
            $newTotal += $itemTotal;
            
            error_log("Item $index: price = $price, quantity = $quantity, total = $itemTotal");
        }
    }

    // Atualiza o total na sessão
    $_SESSION['cart_total'] = $newTotal;
    
    // Debug dos arrays depois da remoção
    error_log('Cart after: ' . print_r($_SESSION['cart_items'], true));
    error_log('Quantities after: ' . print_r($_SESSION['quantities'], true));
    error_log('New total: ' . $newTotal);
    
    // Prepara a resposta
    $response = [
        'success' => true,
        'newTotal' => number_format($newTotal, 2, '.', ''),
        'newTotalFormatted' => number_format($newTotal, 2, ',', '.'),
        'isEmpty' => empty($_SESSION['cart_items']),
        'itemCount' => count($_SESSION['cart_items'])
    ];

    echo json_encode($response);

} catch (Exception $e) {
    error_log('Error in remove-item.php: ' . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>