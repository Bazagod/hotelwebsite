<?php

namespace Tests\Feature;

use App\Models\User;
use App\Modules\Reservation\Models\Guest;
use App\Modules\Reservation\Models\Reservation;
use App\Modules\Room\Models\Room;
use App\Modules\Room\Models\RoomType;
use App\Modules\Tenant\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ReservationLifecycleTest extends TestCase
{
    use RefreshDatabase;

    private Tenant $tenant;
    private User $admin;
    private RoomType $roomType;
    private Room $room;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tenant = Tenant::create([
            'name' => 'Test Hotel',
            'slug' => 'test-hotel',
            'email' => 'test@hotel.com',
            'currency' => 'USD',
            'timezone' => 'UTC',
            'subscription_plan' => 'premium',
            'is_active' => true,
        ]);

        foreach (['view-dashboard', 'manage-reservations', 'view-reservations', 'manage-rooms', 'view-rooms'] as $p) {
            Permission::firstOrCreate(['name' => $p, 'guard_name' => 'web']);
        }
        $role = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $role->syncPermissions(Permission::all());

        $this->admin = User::create([
            'tenant_id' => $this->tenant->id,
            'first_name' => 'Test',
            'last_name' => 'Admin',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'is_active' => true,
            'is_super_admin' => true,
        ]);
        $this->admin->assignRole('admin');

        $this->roomType = RoomType::create([
            'tenant_id' => $this->tenant->id,
            'name' => 'Standard Room',
            'slug' => 'standard-room',
            'base_price' => 100,
            'max_occupancy' => 2,
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $this->room = Room::create([
            'tenant_id' => $this->tenant->id,
            'room_type_id' => $this->roomType->id,
            'number' => '101',
            'floor' => 1,
            'status' => 'available',
            'is_active' => true,
        ]);
    }

    private function apiAs(User $user): self
    {
        return $this->actingAs($user, 'sanctum');
    }

    public function test_create_reservation_returns_confirmation_number(): void
    {
        $response = $this->apiAs($this->admin)->postJson('/api/v1/reservations', [
            'guest_first_name' => 'John',
            'guest_last_name' => 'Doe',
            'guest_email' => 'john@example.com',
            'room_type_id' => $this->roomType->id,
            'check_in_date' => now()->addDays(1)->toDateString(),
            'check_out_date' => now()->addDays(3)->toDateString(),
            'adults' => 2,
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'data' => ['id', 'confirmation_number', 'status', 'total_amount'],
        ]);
        $this->assertEquals('pending', $response->json('data.status'));
        $this->assertNotEmpty($response->json('data.confirmation_number'));
    }

    public function test_full_lifecycle_pending_to_checkout(): void
    {
        $createResponse = $this->apiAs($this->admin)->postJson('/api/v1/reservations', [
            'guest_first_name' => 'Jane',
            'guest_last_name' => 'Smith',
            'guest_email' => 'jane@example.com',
            'room_type_id' => $this->roomType->id,
            'check_in_date' => now()->toDateString(),
            'check_out_date' => now()->addDays(2)->toDateString(),
            'adults' => 1,
        ]);
        $createResponse->assertStatus(201);
        $reservationId = $createResponse->json('data.id');

        $confirmResponse = $this->apiAs($this->admin)->postJson("/api/v1/reservations/{$reservationId}/confirm");
        $confirmResponse->assertOk();
        $this->assertEquals('confirmed', $confirmResponse->json('data.status'));

        $checkInResponse = $this->apiAs($this->admin)->postJson("/api/v1/reservations/{$reservationId}/check-in", [
            'room_id' => $this->room->id,
        ]);
        $checkInResponse->assertOk();
        $this->assertEquals('checked_in', $checkInResponse->json('data.status'));

        $this->room->refresh();
        $this->assertEquals('occupied', $this->room->status);

        $checkOutResponse = $this->apiAs($this->admin)->postJson("/api/v1/reservations/{$reservationId}/check-out");
        $checkOutResponse->assertOk();
        $this->assertEquals('checked_out', $checkOutResponse->json('data.status'));

        $this->room->refresh();
        $this->assertEquals('available', $this->room->status);
    }

    public function test_cancel_reservation(): void
    {
        $res = $this->apiAs($this->admin)->postJson('/api/v1/reservations', [
            'guest_first_name' => 'Cancel',
            'guest_last_name' => 'Test',
            'guest_email' => 'cancel@test.com',
            'room_type_id' => $this->roomType->id,
            'check_in_date' => now()->addDays(5)->toDateString(),
            'check_out_date' => now()->addDays(7)->toDateString(),
            'adults' => 1,
        ]);

        $id = $res->json('data.id');
        $cancelResponse = $this->apiAs($this->admin)->postJson("/api/v1/reservations/{$id}/cancel");
        $cancelResponse->assertOk();
        $this->assertEquals('cancelled', $cancelResponse->json('data.status'));
    }

    public function test_cannot_cancel_checked_in_reservation(): void
    {
        $res = $this->apiAs($this->admin)->postJson('/api/v1/reservations', [
            'guest_first_name' => 'NoCancel',
            'guest_last_name' => 'Test',
            'room_type_id' => $this->roomType->id,
            'check_in_date' => now()->toDateString(),
            'check_out_date' => now()->addDays(2)->toDateString(),
            'adults' => 1,
        ]);

        $id = $res->json('data.id');
        $this->apiAs($this->admin)->postJson("/api/v1/reservations/{$id}/confirm");
        $this->apiAs($this->admin)->postJson("/api/v1/reservations/{$id}/check-in", [
            'room_id' => $this->room->id,
        ]);

        $cancelResponse = $this->apiAs($this->admin)->postJson("/api/v1/reservations/{$id}/cancel");
        $cancelResponse->assertStatus(422);
    }

    public function test_create_reservation_validates_dates(): void
    {
        $response = $this->apiAs($this->admin)->postJson('/api/v1/reservations', [
            'guest_first_name' => 'Bad',
            'guest_last_name' => 'Dates',
            'room_type_id' => $this->roomType->id,
            'check_in_date' => now()->addDays(3)->toDateString(),
            'check_out_date' => now()->addDays(1)->toDateString(),
            'adults' => 1,
        ]);

        $response->assertStatus(422);
    }

    public function test_public_booking_creates_reservation(): void
    {
        $this->tenant->update(['slug' => 'bazagod-hotel']);

        $response = $this->postJson('/api/v1/public/booking', [
            'guest_first_name' => 'Public',
            'guest_last_name' => 'Guest',
            'guest_email' => 'public@guest.com',
            'room_type_name' => 'Standard Room',
            'check_in_date' => now()->addDays(1)->toDateString(),
            'check_out_date' => now()->addDays(3)->toDateString(),
            'adults' => 2,
            'source' => 'website',
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('data.status', 'pending');
        $this->assertDatabaseHas('guests', ['email' => 'public@guest.com']);
    }

    public function test_dashboard_returns_expected_structure(): void
    {
        $response = $this->apiAs($this->admin)->getJson('/api/v1/dashboard');

        $response->assertOk();
        $response->assertJsonStructure([
            'rooms' => ['total', 'occupied', 'available', 'maintenance', 'occupancy_rate'],
            'reservations' => ['today_arrivals', 'today_departures', 'pending'],
            'revenue' => ['monthly'],
            'occupancy_trend',
            'recent_reservations',
        ]);
    }

    public function test_unauthenticated_access_is_rejected(): void
    {
        $this->getJson('/api/v1/reservations')
            ->assertStatus(401);
    }

    public function test_price_calculation_is_correct(): void
    {
        $response = $this->apiAs($this->admin)->postJson('/api/v1/reservations', [
            'guest_first_name' => 'Price',
            'guest_last_name' => 'Check',
            'guest_email' => 'price@test.com',
            'room_type_id' => $this->roomType->id,
            'check_in_date' => now()->addDays(1)->toDateString(),
            'check_out_date' => now()->addDays(4)->toDateString(),
            'adults' => 1,
        ]);

        $response->assertStatus(201);
        $data = $response->json('data');

        $nights = 3;
        $ratePerNight = 100;
        $subtotal = $nights * $ratePerNight;
        $tax = $subtotal * 0.18;
        $expectedTotal = $subtotal + $tax;

        $this->assertEquals($expectedTotal, (float) $data['total_amount']);
    }
}
