<?php

namespace App\Http\Controllers;

use App\Services\OcrService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OcrController extends Controller
{
    public function __invoke(Request $request, OcrService $ocr): JsonResponse
    {
        $request->validate(['photo' => ['required', 'image', 'max:5120']]);

        return response()->json($ocr->read($request->file('photo')));
    }
}
