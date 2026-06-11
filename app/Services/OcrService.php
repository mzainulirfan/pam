<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;

class OcrService
{
    public function read(UploadedFile $file): array
    {
        $nameDigits = preg_replace('/\D+/', '', pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
        $value = $nameDigits !== '' ? (int) $nameDigits : null;

        return [
            'text' => $value ? (string) $value : 'OCR belum dikonfigurasi. Isi manual atau beri nama file berisi angka meter.',
            'value' => $value,
            'confidence' => $value ? 75 : 0,
        ];
    }
}
