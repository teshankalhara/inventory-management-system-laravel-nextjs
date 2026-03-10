<?php

use App\Http\Controllers\ActivityLogsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CupboardsController;
use App\Http\Controllers\PlacesController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


//public routr
Route::post('/login', [AuthController::class, 'login']);

//protctd routr
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class)->except(['show']);
        Route::apiResource('cupboards', CupboardsController::class);
        Route::apiResource('places', PlacesController::class);
        Route::get('/activity-logs', [ActivityLogsController::class, 'index']);
    });
});
