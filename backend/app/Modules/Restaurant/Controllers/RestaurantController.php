<?php

namespace App\Modules\Restaurant\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Restaurant\Models\MenuCategory;
use App\Modules\Restaurant\Models\MenuItem;
use App\Modules\Restaurant\Models\RestaurantOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RestaurantController extends Controller
{
    public function menuCategories(): JsonResponse
    {
        $categories = MenuCategory::withCount('items')
            ->orderBy('sort_order')
            ->get();

        return response()->json($categories);
    }

    public function storeCategory(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $category = MenuCategory::create($validated);

        return response()->json($category, 201);
    }

    public function menuItems(Request $request): JsonResponse
    {
        $query = MenuItem::with('category');

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $items = $query->orderBy('name')->get();

        return response()->json($items);
    }

    public function storeMenuItem(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:menu_categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|string|max:500',
            'is_available' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
        ]);

        $item = MenuItem::create($validated);

        return response()->json($item->load('category'), 201);
    }

    public function orders(Request $request): JsonResponse
    {
        $query = RestaurantOrder::with('items.menuItem');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->orderByDesc('created_at')->paginate(15);

        return response()->json($orders);
    }

    public function storeOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'table_number' => 'nullable|string|max:50',
            'guest_id' => 'nullable|integer|exists:guests,id',
            'reservation_id' => 'nullable|integer|exists:reservations,id',
            'served_by' => 'nullable|integer',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.notes' => 'nullable|string|max:500',
        ]);

        $order = DB::transaction(function () use ($validated) {
            $subtotal = 0;

            $order = RestaurantOrder::create([
                'order_number' => RestaurantOrder::generateOrderNumber(),
                'table_number' => $validated['table_number'] ?? null,
                'guest_id' => $validated['guest_id'] ?? null,
                'reservation_id' => $validated['reservation_id'] ?? null,
                'served_by' => $validated['served_by'] ?? null,
                'subtotal' => 0,
                'tax_amount' => 0,
                'total_amount' => 0,
                'status' => 'pending',
                'payment_status' => 'unpaid',
            ]);

            foreach ($validated['items'] as $itemData) {
                $menuItem = MenuItem::findOrFail($itemData['menu_item_id']);
                $totalPrice = $menuItem->price * $itemData['quantity'];
                $subtotal += $totalPrice;

                $order->items()->create([
                    'menu_item_id' => $itemData['menu_item_id'],
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $menuItem->price,
                    'total_price' => $totalPrice,
                    'notes' => $itemData['notes'] ?? null,
                ]);
            }

            $taxAmount = round($subtotal * 0.18, 2);
            $totalAmount = round($subtotal + $taxAmount, 2);

            $order->update([
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
            ]);

            return $order;
        });

        return response()->json($order->load('items.menuItem'), 201);
    }

    public function updateOrderStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,preparing,ready,served,completed,cancelled',
        ]);

        $order = RestaurantOrder::findOrFail($id);
        $order->update(['status' => $validated['status']]);

        return response()->json($order->load('items.menuItem'));
    }
}
