<?php

namespace App\Services;

class PayMeService
{
    private string $merchantId;
    private string $secretKey;

    public function __construct()
    {
        $this->merchantId = config('services.payme.merchant_id', '') ?: '';
        $this->secretKey = config('services.payme.secret_key', '') ?: '';
    }

    public function generateTransactionData(array $orderData): array
    {
        return [
            'transaction_id' => 'tx_' . time() . '_' . rand(1000, 9999),
            'amount' => $orderData['amount'],
            'order_id' => $orderData['order_id'],
            'description' => $orderData['description'],
            'created_at' => now()->toISOString()
        ];
    }

    public function validateWebhookSignature(array $data, string $signature): bool
    {
        // Базовая валидация
        return !empty($signature);
    }

    public function hasValidConfiguration(): bool
    {
        return !empty($this->merchantId) && !empty($this->secretKey);
    }

    public function isConfigured(): bool
    {
        return $this->hasValidConfiguration();
    }
} 