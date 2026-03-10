<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;


//public routr
Route::post('/login', [AuthController::class, 'login']);

//protctd routr

