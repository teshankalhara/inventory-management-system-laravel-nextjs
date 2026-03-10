<?php

namespace App\Http\Controllers;

use App\Http\Requests\ItemRequest;
use App\Models\Items;
use App\Services\ItemService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ItemsController extends Controller
{
    public function __construct(private readonly ItemService $service)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $items = $this->service->paginate(
            perPage: 15,
            search: $request->query('search')
        );

        return response()->json($items);
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
    public function store(ItemRequest $request): JsonResponse
    {
        $item = $this->service->create(
            data: $request->except('image'),
            image: $request->file('image')
        );

        return response()->json($item, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        return response()->json($this->service->findOrFail($id));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Items $items)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ItemRequest $request, int $id): JsonResponse
    {
        $item = $this->service->update(
            id: $id,
            data: $request->except('image'),
            image: $request->file('image')
        );

        return response()->json($item);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);
        return response()->json(['message' => 'Item deleted.']);
    }
}
