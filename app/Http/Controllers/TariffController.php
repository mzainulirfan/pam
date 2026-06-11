<?php

namespace App\Http\Controllers;

use App\Models\Tariff;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TariffController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Tariffs/Index', ['tariffs' => Tariff::latest()->get()]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        DB::transaction(function () use ($data) {
            if ($data['is_active']) {
                Tariff::query()->update(['is_active' => false]);
            }
            Tariff::create($data);
        });
        return back()->with('success', 'Tarif ditambahkan.');
    }

    public function update(Request $request, Tariff $tariff): RedirectResponse
    {
        $data = $this->validated($request);
        DB::transaction(function () use ($tariff, $data) {
            if ($data['is_active']) {
                Tariff::whereKeyNot($tariff->id)->update(['is_active' => false]);
            }
            $tariff->update($data);
        });
        return back()->with('success', 'Tarif diperbarui.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'price_per_m3' => ['required', 'integer', 'min:0'],
            'fixed_charge' => ['required', 'integer', 'min:0'],
            'late_fee' => ['nullable', 'integer', 'min:0'],
            'admin_fee' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]) + ['late_fee' => 0, 'admin_fee' => 0, 'is_active' => false];
    }
}
