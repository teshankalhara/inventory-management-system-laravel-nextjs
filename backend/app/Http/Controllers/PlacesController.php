<?php

namespace App\Http\Controllers;

use App\Http\Requests\PlaceRequest;
use App\Models\Places;
use App\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlacesController extends Controller
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
            Places::with('cupboard')->withCount('items')->orderBy('name')->get()
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
    public function store(PlaceRequest $request): JsonResponse
    {
        $place = Places::create($request->validated());
        $place->load('cupboard');

        $this->logger->log('place.created', 'Place', $place->id, null, $place->toArray());

        return response()->json($place, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Places $places)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Places $places)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PlaceRequest $request, int $id): JsonResponse
    {
        $place = Places::findOrFail($id);
        $old = $place->toArray();
        $place->update($request->validated());
        $this->logger->log('place.updated', 'Place', $id, $old, $place->toArray());

        return response()->json($place->load('cupboard'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $place = Places::findOrFail($id);
        $this->logger->log('place.deleted', 'Place', $id, $place->toArray());
        $place->delete();

        return response()->json(['message' => 'Place deleted.']);
    }
}
