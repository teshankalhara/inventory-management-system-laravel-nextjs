<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BorrowRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'item_id' => ['required', 'exists:items,id'],
            'borrower_name' => ['required', 'string', 'max:255'],
            'borrower_contact' => ['required', 'string', 'max:255'],
            'quantity' => ['required', 'integer', 'min:1'],
            'borrow_date' => ['required', 'date'],
            'expected_return_date' => ['required', 'date', 'after_or_equal:borrow_date'],
        ];
    }
}
