<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;


//public routr
Route::post('/login', [AuthController::class, 'login']);

//protctd routr
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);


});
