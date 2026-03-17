<?php

namespace Database\Seeders;

use App\Models\User;
use App\Modules\Reservation\Models\Guest;
use App\Modules\Reservation\Models\Reservation;
use App\Modules\Room\Models\Room;
use App\Modules\Room\Models\RoomType;
use App\Modules\Staff\Models\Department;
use App\Modules\Staff\Models\Staff;
use App\Modules\Tenant\Models\Tenant;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'view-dashboard',
            'manage-rooms', 'view-rooms',
            'manage-reservations', 'view-reservations',
            'manage-staff', 'view-staff', 'view-salaries',
            'manage-accounting', 'view-accounting',
            'manage-inventory', 'view-inventory',
            'manage-restaurant', 'view-restaurant',
            'manage-conference', 'view-conference',
            'manage-settings', 'manage-users',
        ];

        foreach ($permissions as $p) {
            Permission::firstOrCreate(['name' => $p, 'guard_name' => 'web']);
        }

        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $admin->syncPermissions($permissions);

        $manager = Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'web']);
        $manager->syncPermissions([
            'view-dashboard', 'manage-rooms', 'view-rooms',
            'manage-reservations', 'view-reservations',
            'view-staff', 'view-accounting', 'view-inventory',
            'manage-restaurant', 'view-restaurant',
            'manage-conference', 'view-conference',
        ]);

        $receptionist = Role::firstOrCreate(['name' => 'receptionist', 'guard_name' => 'web']);
        $receptionist->syncPermissions([
            'view-dashboard', 'view-rooms',
            'manage-reservations', 'view-reservations',
        ]);

        $staffRole = Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'web']);
        $staffRole->syncPermissions(['view-dashboard']);

        // --- Tenant ---
        $tenant = Tenant::firstOrCreate(
            ['slug' => 'bazagod-hotel'],
            [
                'name' => 'BAZAGOD Hotel',
                'email' => 'admin@bazagod.bi',
                'phone' => '+257 22 25 12 34',
                'address' => 'Avenue du Lac Tanganyika',
                'city' => 'Bujumbura',
                'country' => 'Burundi',
                'currency' => 'USD',
                'timezone' => 'Africa/Bujumbura',
                'subscription_plan' => 'premium',
                'is_active' => true,
            ]
        );

        // --- Users ---
        $superAdmin = User::firstOrCreate(
            ['email' => 'admin@bazagod.bi'],
            [
                'tenant_id' => $tenant->id,
                'first_name' => 'Super',
                'last_name' => 'Admin',
                'password' => bcrypt('password'),
                'is_super_admin' => true,
                'is_active' => true,
            ]
        );
        $superAdmin->assignRole('admin');

        $managerUser = User::firstOrCreate(
            ['email' => 'manager@bazagod.bi'],
            [
                'tenant_id' => $tenant->id,
                'first_name' => 'Jean',
                'last_name' => 'Ndayisaba',
                'password' => bcrypt('password'),
                'is_active' => true,
            ]
        );
        $managerUser->assignRole('manager');

        $receptionistUser = User::firstOrCreate(
            ['email' => 'reception@bazagod.bi'],
            [
                'tenant_id' => $tenant->id,
                'first_name' => 'Aline',
                'last_name' => 'Niyonkuru',
                'password' => bcrypt('password'),
                'is_active' => true,
            ]
        );
        $receptionistUser->assignRole('receptionist');

        // --- Room Types ---
        $suiteType = RoomType::firstOrCreate(
            ['tenant_id' => $tenant->id, 'slug' => 'lake-tanganyika-suite'],
            [
                'name' => 'Lake Tanganyika Suite',
                'description' => 'Our signature suite with panoramic views of Lake Tanganyika.',
                'base_price' => 350,
                'max_occupancy' => 4,
                'bed_type' => 'King',
                'size' => '75m²',
                'view' => 'Lake View',
                'amenities' => ['Private balcony', 'Lake view', 'Mini bar', 'Room service', 'Butler service'],
                'is_active' => true,
                'sort_order' => 1,
            ]
        );

        $execType = RoomType::firstOrCreate(
            ['tenant_id' => $tenant->id, 'slug' => 'bujumbura-executive'],
            [
                'name' => 'Bujumbura Executive Room',
                'description' => 'Elegant business room with modern amenities and city views.',
                'base_price' => 200,
                'max_occupancy' => 2,
                'bed_type' => 'Queen',
                'size' => '45m²',
                'view' => 'City View',
                'amenities' => ['Work desk', 'High-speed Wi-Fi', 'Mini bar', 'Room service'],
                'is_active' => true,
                'sort_order' => 2,
            ]
        );

        $villaType = RoomType::firstOrCreate(
            ['tenant_id' => $tenant->id, 'slug' => 'rusizi-garden-villa'],
            [
                'name' => 'Rusizi Garden Villa',
                'description' => 'Private villa surrounded by tropical gardens.',
                'base_price' => 500,
                'max_occupancy' => 6,
                'bed_type' => 'King + Twin',
                'size' => '120m²',
                'view' => 'Garden View',
                'amenities' => ['Private pool', 'Garden terrace', 'Kitchenette', 'Room service'],
                'is_active' => true,
                'sort_order' => 3,
            ]
        );

        $deluxeType = RoomType::firstOrCreate(
            ['tenant_id' => $tenant->id, 'slug' => 'karera-falls-deluxe'],
            [
                'name' => 'Karera Falls Deluxe',
                'description' => 'Spacious deluxe room inspired by Karera waterfalls.',
                'base_price' => 280,
                'max_occupancy' => 3,
                'bed_type' => 'King',
                'size' => '55m²',
                'view' => 'Pool View',
                'amenities' => ['Rainfall shower', 'Bathtub', 'Mini bar', 'Room service'],
                'is_active' => true,
                'sort_order' => 4,
            ]
        );

        // --- Rooms ---
        $roomDefs = [
            ['type' => $suiteType, 'numbers' => ['101', '102']],
            ['type' => $execType, 'numbers' => ['201', '202', '203', '204']],
            ['type' => $villaType, 'numbers' => ['V1', 'V2']],
            ['type' => $deluxeType, 'numbers' => ['301', '302', '303']],
        ];

        $allRooms = [];
        foreach ($roomDefs as $def) {
            foreach ($def['numbers'] as $number) {
                $allRooms[$number] = Room::firstOrCreate(
                    ['tenant_id' => $tenant->id, 'number' => $number],
                    [
                        'room_type_id' => $def['type']->id,
                        'floor' => is_numeric($number[0]) ? (int) $number[0] : 1,
                        'status' => 'available',
                        'is_active' => true,
                    ]
                );
            }
        }

        // --- Departments & Staff ---
        $deptNames = ['Front Desk', 'Housekeeping', 'Restaurant', 'Maintenance', 'Management', 'Security'];
        $depts = [];
        foreach ($deptNames as $name) {
            $depts[$name] = Department::firstOrCreate(
                ['tenant_id' => $tenant->id, 'name' => $name],
                ['is_active' => true]
            );
        }

        $staffData = [
            ['first_name' => 'Aline', 'last_name' => 'Niyonkuru', 'email' => 'aline@bazagod.bi', 'position' => 'Head Receptionist', 'department' => 'Front Desk', 'salary' => 1200, 'hire_date' => '2024-01-15', 'user_id' => $receptionistUser->id],
            ['first_name' => 'Patrick', 'last_name' => 'Ndikumana', 'email' => 'patrick@bazagod.bi', 'position' => 'Receptionist', 'department' => 'Front Desk', 'salary' => 800, 'hire_date' => '2024-03-01'],
            ['first_name' => 'Chantal', 'last_name' => 'Iradukunda', 'email' => 'chantal@bazagod.bi', 'position' => 'Housekeeping Supervisor', 'department' => 'Housekeeping', 'salary' => 900, 'hire_date' => '2023-11-20'],
            ['first_name' => 'Dieudonné', 'last_name' => 'Bizimana', 'email' => 'dieudonne@bazagod.bi', 'position' => 'Housekeeper', 'department' => 'Housekeeping', 'salary' => 600, 'hire_date' => '2024-06-10'],
            ['first_name' => 'Aimée', 'last_name' => 'Hakizimana', 'email' => 'aimee@bazagod.bi', 'position' => 'Head Chef', 'department' => 'Restaurant', 'salary' => 1500, 'hire_date' => '2023-09-01'],
            ['first_name' => 'Éric', 'last_name' => 'Ntakirutimana', 'email' => 'eric@bazagod.bi', 'position' => 'Waiter', 'department' => 'Restaurant', 'salary' => 550, 'hire_date' => '2024-08-15'],
            ['first_name' => 'Fabien', 'last_name' => 'Nshimirimana', 'email' => 'fabien@bazagod.bi', 'position' => 'Maintenance Engineer', 'department' => 'Maintenance', 'salary' => 1000, 'hire_date' => '2024-02-01'],
            ['first_name' => 'Grâce', 'last_name' => 'Uwimana', 'email' => 'grace@bazagod.bi', 'position' => 'Security Guard', 'department' => 'Security', 'salary' => 650, 'hire_date' => '2024-04-20'],
        ];

        foreach ($staffData as $s) {
            Staff::firstOrCreate(
                ['tenant_id' => $tenant->id, 'email' => $s['email']],
                [
                    'department_id' => $depts[$s['department']]->id,
                    'user_id' => $s['user_id'] ?? null,
                    'first_name' => $s['first_name'],
                    'last_name' => $s['last_name'],
                    'position' => $s['position'],
                    'salary' => $s['salary'],
                    'salary_type' => 'monthly',
                    'hire_date' => $s['hire_date'],
                    'phone' => '+257 7' . rand(1, 9) . ' ' . rand(10, 99) . ' ' . rand(10, 99) . ' ' . rand(10, 99),
                    'is_active' => true,
                ]
            );
        }

        // --- Guests ---
        $guests = [];
        $guestData = [
            ['first_name' => 'Marie-Claire', 'last_name' => 'Niyonzima', 'email' => 'marie@example.com', 'phone' => '+257 79 12 34 56', 'nationality' => 'Burundian', 'vip_status' => 'vip', 'total_stays' => 5, 'total_spent' => 4200],
            ['first_name' => 'James', 'last_name' => 'Thornton', 'email' => 'james.thornton@gmail.com', 'phone' => '+1 555 234 5678', 'nationality' => 'American', 'vip_status' => 'regular', 'total_stays' => 2, 'total_spent' => 1400],
            ['first_name' => 'Sophie', 'last_name' => 'Dubois', 'email' => 'sophie.dubois@mail.fr', 'phone' => '+33 6 12 34 56 78', 'nationality' => 'French', 'vip_status' => 'regular', 'total_stays' => 1, 'total_spent' => 700],
            ['first_name' => 'Emmanuel', 'last_name' => 'Rukundo', 'email' => 'emmanuel.r@outlook.com', 'phone' => '+257 71 45 67 89', 'nationality' => 'Burundian', 'vip_status' => 'regular', 'total_stays' => 3, 'total_spent' => 1800],
            ['first_name' => 'Yuki', 'last_name' => 'Tanaka', 'email' => 'yuki.tanaka@company.jp', 'phone' => '+81 90 1234 5678', 'nationality' => 'Japanese', 'vip_status' => 'vip', 'total_stays' => 4, 'total_spent' => 5600],
            ['first_name' => 'Amina', 'last_name' => 'Hassan', 'email' => 'amina.h@mail.ke', 'phone' => '+254 712 345 678', 'nationality' => 'Kenyan', 'vip_status' => 'regular', 'total_stays' => 1, 'total_spent' => 500],
            ['first_name' => 'Olivier', 'last_name' => 'Nkurunziza', 'email' => 'olivier.n@gmail.com', 'phone' => '+257 76 88 99 00', 'nationality' => 'Burundian', 'vip_status' => 'regular', 'total_stays' => 2, 'total_spent' => 960],
            ['first_name' => 'Chen', 'last_name' => 'Wei', 'email' => 'chen.wei@business.cn', 'phone' => '+86 138 0013 8000', 'nationality' => 'Chinese', 'vip_status' => 'vip', 'total_stays' => 6, 'total_spent' => 8400],
        ];

        foreach ($guestData as $g) {
            $guests[] = Guest::firstOrCreate(
                ['tenant_id' => $tenant->id, 'email' => $g['email']],
                array_merge($g, ['tenant_id' => $tenant->id])
            );
        }

        // --- Reservations (realistic demo data across all statuses) ---
        $today = now()->startOfDay();
        $reservationDefs = [
            // Checked out (past)
            ['guest' => 0, 'room' => '101', 'type' => $suiteType, 'ci' => -10, 'co' => -7, 'status' => 'checked_out', 'payment' => 'paid', 'source' => 'website'],
            ['guest' => 1, 'room' => '201', 'type' => $execType, 'ci' => -8, 'co' => -5, 'status' => 'checked_out', 'payment' => 'paid', 'source' => 'ota'],
            ['guest' => 2, 'room' => '301', 'type' => $deluxeType, 'ci' => -6, 'co' => -3, 'status' => 'checked_out', 'payment' => 'paid', 'source' => 'direct'],

            // Currently checked in
            ['guest' => 3, 'room' => '102', 'type' => $suiteType, 'ci' => -2, 'co' => 2, 'status' => 'checked_in', 'payment' => 'paid', 'source' => 'phone'],
            ['guest' => 4, 'room' => 'V1', 'type' => $villaType, 'ci' => -1, 'co' => 3, 'status' => 'checked_in', 'payment' => 'paid', 'source' => 'website'],
            ['guest' => 7, 'room' => '202', 'type' => $execType, 'ci' => -3, 'co' => 1, 'status' => 'checked_in', 'payment' => 'partial', 'source' => 'direct'],

            // Arriving today
            ['guest' => 5, 'room' => '302', 'type' => $deluxeType, 'ci' => 0, 'co' => 4, 'status' => 'confirmed', 'payment' => 'pending', 'source' => 'website'],
            ['guest' => 6, 'room' => '203', 'type' => $execType, 'ci' => 0, 'co' => 3, 'status' => 'confirmed', 'payment' => 'pending', 'source' => 'ota'],

            // Future confirmed
            ['guest' => 0, 'room' => '303', 'type' => $deluxeType, 'ci' => 5, 'co' => 9, 'status' => 'confirmed', 'payment' => 'pending', 'source' => 'phone'],
            ['guest' => 1, 'room' => 'V2', 'type' => $villaType, 'ci' => 7, 'co' => 14, 'status' => 'confirmed', 'payment' => 'pending', 'source' => 'website'],

            // Pending (not yet confirmed)
            ['guest' => 2, 'room' => null, 'type' => $suiteType, 'ci' => 3, 'co' => 6, 'status' => 'pending', 'payment' => 'pending', 'source' => 'website'],
            ['guest' => 5, 'room' => null, 'type' => $execType, 'ci' => 10, 'co' => 13, 'status' => 'pending', 'payment' => 'pending', 'source' => 'ota'],

            // Cancelled
            ['guest' => 6, 'room' => null, 'type' => $deluxeType, 'ci' => -4, 'co' => -1, 'status' => 'cancelled', 'payment' => 'refunded', 'source' => 'website'],
        ];

        $confCounter = 1;
        foreach ($reservationDefs as $r) {
            $guest = $guests[$r['guest']];
            $checkIn = $today->copy()->addDays($r['ci']);
            $checkOut = $today->copy()->addDays($r['co']);
            $nights = $checkIn->diffInDays($checkOut);
            $rate = (float) $r['type']->base_price;
            $subtotal = $rate * $nights;
            $tax = round($subtotal * 0.18, 2);
            $total = $subtotal + $tax;

            $room = $r['room'] ? ($allRooms[$r['room']] ?? null) : null;

            $reservation = Reservation::firstOrCreate(
                ['confirmation_number' => 'BZG-DEMO' . str_pad($confCounter, 3, '0', STR_PAD_LEFT)],
                [
                    'tenant_id' => $tenant->id,
                    'guest_id' => $guest->id,
                    'room_id' => $room?->id,
                    'room_type_id' => $r['type']->id,
                    'check_in_date' => $checkIn,
                    'check_out_date' => $checkOut,
                    'actual_check_in' => in_array($r['status'], ['checked_in', 'checked_out']) ? $checkIn->copy()->setHour(14) : null,
                    'actual_check_out' => $r['status'] === 'checked_out' ? $checkOut->copy()->setHour(11) : null,
                    'adults' => rand(1, $r['type']->max_occupancy),
                    'children' => rand(0, 1),
                    'rate_per_night' => $rate,
                    'total_amount' => $total,
                    'discount_amount' => 0,
                    'tax_amount' => $tax,
                    'status' => $r['status'],
                    'payment_status' => $r['payment'],
                    'source' => $r['source'],
                    'created_by' => $superAdmin->id,
                ]
            );

            // Update room status for checked-in reservations
            if ($r['status'] === 'checked_in' && $room) {
                $room->update(['status' => 'occupied']);
            }

            $confCounter++;
        }

        // Mark one room as maintenance for realism
        if (isset($allRooms['204'])) {
            $allRooms['204']->update(['status' => 'maintenance', 'notes' => 'AC repair scheduled']);
        }
        if (isset($allRooms['301'])) {
            $allRooms['301']->update(['is_clean' => false]);
        }
    }
}
