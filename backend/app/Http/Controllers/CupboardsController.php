<?php

namespace App\Http\Controllers;

use App\Http\Requests\CupboardRequest;
use App\Models\Cupboards;
use App\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CupboardsController extends Controller
{
    public function __construct(private readonly ActivityLogService $logger)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(
            Cupboards::withCount('places')->orderBy('name')->get()
        );
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
    public function store(CupboardRequest $request): JsonResponse
    {
        $cupboard = Cupboards::create($request->validated());

        $this->logger->log('cupboard.created', 'Cupboard', $cupboard->id, null, $cupboard->toArray());

        return response()->json($cupboard, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Cupboards $cupboards)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Cupboards $cupboards)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CupboardRequest $request, int $id): JsonResponse
    {
        $cupboard = Cupboards::findOrFail($id);
        $old = $cupboard->toArray();

        $cupboard->update($request->validated());

        $this->logger->log('cupboard.updated', 'Cupboard', $id, $old, $cupboard->toArray());

        return response()->json($cupboard);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $cupboard = Cupboards::findOrFail($id);

        $this->logger->log('cupboard.deleted', 'Cupboard', $id, $cupboard->toArray());

        $cupboard->delete();

        return response()->json(['message' => 'Cupboard deleted.']);
    }
}
