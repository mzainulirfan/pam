<?php

namespace App\Console\Commands;

use App\Models\Bill;
use Illuminate\Console\Command;

class UpdateOverdueBills extends Command
{
    protected $signature = 'bills:update-overdue';

    protected $description = 'Update unpaid bills past due date to overdue.';

    public function handle(): int
    {
        $count = Bill::whereIn('status', ['unpaid', 'partial'])
            ->whereDate('due_date', '<', today())
            ->update(['status' => 'overdue']);

        $this->info("Updated {$count} overdue bills.");

        return self::SUCCESS;
    }
}
