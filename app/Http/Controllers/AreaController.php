<?php

namespace App\Http\Controllers;

use App\Models\Area;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AreaController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Areas/Index', [
            'areas' => Area::withCount('customers')->latest()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Area::create($request->validate(['name' => ['required', 'string', 'max:100'], 'description' => ['nullable', 'string']]));
        return back()->with('success', 'Area ditambahkan.');
    }

    public function update(Request $request, Area $area): RedirectResponse
    {
        $area->update($request->validate(['name' => ['required', 'string', 'max:100'], 'description' => ['nullable', 'string']]));
        return back()->with('success', 'Area diperbarui.');
    }

    public function destroy(Area $area): RedirectResponse
    {
        abort_if($area->customers()->exists(), 422, 'Area masih memiliki pelanggan.');
        $area->delete();
        return back()->with('success', 'Area dihapus.');
    }
}
