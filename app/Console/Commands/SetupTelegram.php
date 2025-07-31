<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\SystemSetting;
use App\Services\TelegramService;

class SetupTelegram extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'setup:telegram 
                            {--bot-token= : Telegram Bot Token}
                            {--admin-chat-ids= : Admin Chat IDs (comma separated)}
                            {--test : Test connection after setup}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Setup Telegram Bot configuration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Setting up Telegram Bot configuration...');

        // Get values from options or ask user
        $botToken = $this->option('bot-token') ?: $this->secret('Enter Telegram Bot Token');
        $adminChatIds = $this->option('admin-chat-ids') ?: $this->ask('Enter Admin Chat IDs (comma separated, optional)');

        if (!$botToken) {
            $this->error('Bot Token is required!');
            return 1;
        }

        // Parse admin chat IDs
        $adminChatIdsArray = [];
        if ($adminChatIds) {
            $adminChatIdsArray = array_map('trim', explode(',', $adminChatIds));
        }

        // Save settings
        SystemSetting::set('telegram.bot_token', $botToken);
        SystemSetting::set('telegram.admin_chat_ids', $adminChatIdsArray);

        $this->info('Telegram configuration saved successfully!');
        $this->line('');

        // Test connection if requested
        if ($this->option('test') || $this->confirm('Test connection to Telegram Bot?')) {
            $this->testConnection();
        }

        $this->line('');
        $this->line('<fg=green>Configuration:</fg=green>');
        $this->line("Bot Token: " . str_repeat('*', strlen($botToken)));
        $this->line("Admin Chat IDs: " . json_encode($adminChatIdsArray));

        $this->line('');
        $this->info('Telegram Bot is now configured!');
        $this->line('To add group notifications, use the admin panel or update system settings.');

        return 0;
    }

    /**
     * Test Telegram connection
     */
    private function testConnection(): void
    {
        $this->line('Testing Telegram Bot connection...');
        
        $telegramService = new TelegramService();
        $result = $telegramService->testConnection();

        if ($result['success']) {
            $this->info('✅ Connection successful!');
            $botInfo = $result['bot_info'];
            $this->line("Bot Name: {$botInfo['first_name']}");
            $this->line("Username: @{$botInfo['username']}");
            $this->line("Bot ID: {$botInfo['id']}");
            
            // Send test message to admin chats
            $adminChatIds = SystemSetting::get('telegram.admin_chat_ids', []);
            if (!empty($adminChatIds)) {
                $this->line('');
                $testMessage = "🤖 Тестовое сообщение!\n\nТелеграм бот успешно настроен для Sellercom Event Tickets.\n⏰ " . now()->format('d.m.Y H:i:s');
                
                foreach ($adminChatIds as $chatId) {
                    $sent = $telegramService->sendMessage($chatId, $testMessage);
                    if ($sent) {
                        $this->line("✅ Test message sent to chat ID: {$chatId}");
                    } else {
                        $this->error("❌ Failed to send message to chat ID: {$chatId}");
                    }
                }
            }
        } else {
            $this->error('❌ Connection failed: ' . $result['message']);
        }
    }
}
