<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\SystemSetting;

class SetupPayMe extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'setup:payme 
                            {--merchant-id= : PayMe Merchant ID}
                            {--test-key= : PayMe Test Key}
                            {--production-key= : PayMe Production Key}
                            {--test-mode=true : Test mode (true/false)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Setup PayMe configuration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Setting up PayMe configuration...');

        // Get values from options or ask user
        $merchantId = $this->option('merchant-id') ?: $this->ask('Enter PayMe Merchant ID');
        $testKey = $this->option('test-key') ?: $this->secret('Enter PayMe Test Key');
        $productionKey = $this->option('production-key') ?: $this->secret('Enter PayMe Production Key (optional)');
        $testMode = $this->option('test-mode') === 'true';

        if (!$merchantId || !$testKey) {
            $this->error('Merchant ID and Test Key are required!');
            return 1;
        }

        // Save settings
        SystemSetting::set('payme.merchant_id', $merchantId);
        SystemSetting::set('payme.test_key', $testKey);
        if ($productionKey) {
            SystemSetting::set('payme.production_key', $productionKey);
        }
        SystemSetting::set('payme.is_test_mode', $testMode);

        $this->info('PayMe configuration saved successfully!');
        $this->line('');
        $this->line('<fg=green>Configuration:</fg=green>');
        $this->line("Merchant ID: {$merchantId}");
        $this->line("Test Mode: " . ($testMode ? 'YES' : 'NO'));
        $this->line("Test Key: " . str_repeat('*', strlen($testKey)));
        if ($productionKey) {
            $this->line("Production Key: " . str_repeat('*', strlen($productionKey)));
        }

        $this->line('');
        $this->info('You can now create payment links and receive callbacks!');
        $this->line('PayMe Callback URL: ' . route('payme.callback'));

        return 0;
    }
}
