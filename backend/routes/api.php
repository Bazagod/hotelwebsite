<?php

use App\Modules\Accounting\Controllers\AccountingController;
use App\Modules\Auth\Controllers\AuthController;
use App\Modules\Auth\Controllers\DashboardController;
use App\Modules\Conference\Controllers\ConferenceController;
use App\Modules\Inventory\Controllers\InventoryController;
use App\Modules\Reservation\Controllers\ReservationController;
use App\Modules\Restaurant\Controllers\RestaurantController;
use App\Modules\Room\Controllers\RoomController;
use App\Modules\Room\Controllers\RoomTypeController;
use App\Modules\Staff\Controllers\StaffController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API V1 Routes — /api/v1/
|--------------------------------------------------------------------------
*/

// Public
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/public/booking', [ReservationController::class, 'publicBooking']);
Route::get('/public/room-types', [RoomTypeController::class, 'publicList']);

// Authenticated
Route::middleware(['auth:sanctum', 'tenant'])->group(function () {

    // Auth & profile
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::put('/password', [AuthController::class, 'changePassword']);
    });

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Rooms
    Route::apiResource('rooms', RoomController::class);
    Route::get('/rooms-availability', [RoomController::class, 'availability']);

    // Room types
    Route::apiResource('room-types', RoomTypeController::class)->except(['destroy']);

    // Reservations
    Route::apiResource('reservations', ReservationController::class)->except(['update', 'destroy']);
    Route::post('/reservations/{id}/confirm', [ReservationController::class, 'confirm']);
    Route::post('/reservations/{id}/check-in', [ReservationController::class, 'checkIn']);
    Route::post('/reservations/{id}/check-out', [ReservationController::class, 'checkOut']);
    Route::post('/reservations/{id}/cancel', [ReservationController::class, 'cancel']);
    Route::get('/front-desk/arrivals', [ReservationController::class, 'arrivals']);
    Route::get('/front-desk/departures', [ReservationController::class, 'departures']);

    // Staff
    Route::apiResource('staff', StaffController::class);
    Route::get('/departments', [StaffController::class, 'departments']);
    Route::post('/departments', [StaffController::class, 'storeDepartment']);

    // Restaurant
    Route::prefix('restaurant')->group(function () {
        Route::get('/categories', [RestaurantController::class, 'menuCategories']);
        Route::post('/categories', [RestaurantController::class, 'storeCategory']);
        Route::get('/menu', [RestaurantController::class, 'menuItems']);
        Route::post('/menu', [RestaurantController::class, 'storeMenuItem']);
        Route::get('/orders', [RestaurantController::class, 'orders']);
        Route::post('/orders', [RestaurantController::class, 'storeOrder']);
        Route::put('/orders/{id}/status', [RestaurantController::class, 'updateOrderStatus']);
    });

    // Inventory
    Route::prefix('inventory')->group(function () {
        Route::get('/categories', [InventoryController::class, 'categories']);
        Route::post('/categories', [InventoryController::class, 'storeCategory']);
        Route::get('/items', [InventoryController::class, 'items']);
        Route::post('/items', [InventoryController::class, 'storeItem']);
        Route::post('/items/{id}/adjust', [InventoryController::class, 'adjustStock']);
        Route::get('/transactions', [InventoryController::class, 'transactions']);
    });

    // Accounting
    Route::prefix('accounting')->group(function () {
        Route::get('/summary', [AccountingController::class, 'summary']);
        Route::get('/invoices', [AccountingController::class, 'invoices']);
        Route::post('/invoices', [AccountingController::class, 'storeInvoice']);
        Route::get('/payments', [AccountingController::class, 'payments']);
        Route::post('/payments', [AccountingController::class, 'storePayment']);
        Route::get('/expenses', [AccountingController::class, 'expenses']);
        Route::post('/expenses', [AccountingController::class, 'storeExpense']);
    });

    // Conference
    Route::prefix('conference')->group(function () {
        Route::get('/rooms', [ConferenceController::class, 'rooms']);
        Route::post('/rooms', [ConferenceController::class, 'storeRoom']);
        Route::put('/rooms/{id}', [ConferenceController::class, 'updateRoom']);
        Route::get('/bookings', [ConferenceController::class, 'bookings']);
        Route::post('/bookings', [ConferenceController::class, 'storeBooking']);
        Route::put('/bookings/{id}/status', [ConferenceController::class, 'updateBookingStatus']);
    });
});
