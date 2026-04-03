<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Both admin and staff can manage items
    }

    public function rules(): array
    {
        // Route parameter is 'item' for Laravel resource routes (not 'id')
        $itemId = $this->route('item');

        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => [
                'required',
                'string',
                'max:100',
                Rule::unique('items', 'code')->ignore($itemId)
            ],
            'quantity' => ['required', 'integer', 'min:0'],
            'serial_number' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'place_id' => ['required', 'exists:places,id'],
            'status' => ['required', 'in:in-store,borrowed,damaged,missing'],
        ];
    }
}
