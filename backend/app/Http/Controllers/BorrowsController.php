<?php

namespace App\Http\Controllers;

use App\Http\Requests\BorrowRequest;
use App\Models\Borrows;
use App\Services\BorrowService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BorrowsController extends Controller
{
    public function __construct(private readonly BorrowService $service)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json($this->service->paginate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BorrowRequest $request): JsonResponse
    {
        $borrow = $this->service->borrow($request->validated());
        return response()->json($borrow, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Borrows $borrows)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Borrows $borrows)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Borrows $borrows)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Borrows $borrows)
    {
        //
    }

    public function returnItem(int $borrowId): JsonResponse
    {
        $borrow = $this->service->returnItem($borrowId);
        return response()->json($borrow);
    }
}
