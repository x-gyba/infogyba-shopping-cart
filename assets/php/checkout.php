<?php
session_start();

$total = isset($_SESSION['cart_total']) ? $_SESSION['cart_total'] : 0;

$items = isset($_SESSION['cart_items']) ? $_SESSION['cart_items'] : [];
$imageSrcArray = isset($_SESSION['cart_images']) ? $_SESSION['cart_images'] : [];
$quantities = isset($_SESSION['quantities']) ? $_SESSION['quantities'] : [];

// Display cart summary before clearing session
if ($total === 0) {
    echo "Carrinho vazio.";
} else {
    echo "<html><body>";
    echo "<h1>Resumo do Carrinho</h1>";

    // Display total formatted
    if (is_numeric($total)) {
        $totalFormatted = number_format((float)$total, 2, ',', '.');
        echo "<div><strong>Total:</strong> R$ " . $totalFormatted . "</div>";
    } else {
        echo "<div><strong>Total inválido.</strong></div>";
    }

    // Display items
    foreach ($items as $index => $item) {
        $imageSrc = isset($imageSrcArray[$index]) ? $imageSrcArray[$index] : '';
        $quantity = isset($quantities[$index]) ? $quantities[$index] : 0;

        // Build quantity display
        if ($quantity == 1) {
            $quantityDisplay = "x1";
        } else {
            $quantityDisplay = "x" . htmlspecialchars($quantity);
        }

        echo "<div style='display: flex; align-items: center; margin-bottom: 10px;'>";

        if ($imageSrc) {
            echo "<div style='flex: 0 0 auto; margin-right: 10px;'><img src='" . htmlspecialchars($imageSrc) . "' alt='Imagem do Carrinho' style='max-width: 100px; height: auto;' /></div>";
        }

        echo "<div style='flex: 1;'>" . nl2br(htmlspecialchars($item)) . " " . $quantityDisplay . "</div>";

        echo "</div>";
    }

    echo "</body></html>";
}

// Clear session variables after display
unset($_SESSION['cart_total'], $_SESSION['cart_items'], $_SESSION['cart_images'], $_SESSION['quantities']);
