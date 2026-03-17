<?php

namespace App\Modules\Inventory\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Inventory\Models\InventoryCategory;
use App\Modules\Inventory\Models\InventoryItem;
use App\Modules\Inventory\Models\InventoryTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    public function categories(): JsonResponse
    {
        $categories = InventoryCategory::withCount('items')->get();

        return response()->json($categories);
    }

    public function storeCategory(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category = InventoryCategory::create($validated);

        return response()->json($category, 201);
    }

    public function items(Request $request): JsonResponse
    {
        $query = InventoryItem::with('category');

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        if ($request->boolean('low_stock')) {
            $query->whereColumn('quantity', '<=', 'min_quantity');
        }

        $items = $query->paginate(20);

        return response()->json($items);
    }

    public function storeItem(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:inventory_categories,id',
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'quantity' => 'required|integer|min:0',
            'min_quantity' => 'required|integer|min:0',
            'unit' => 'required|string|max:50',
            'unit_cost' => 'required|numeric|min:0',
            'location' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        $item = InventoryItem::create($validated);
        $item->load('category');

        return response()->json($item, 201);
    }

    public function adjustStock(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:in,out,adjustment',
            'quantity' => 'required|integer|min:1',
            'reason' => 'nullable|string|max:500',
        ]);

        return DB::transaction(function () use ($validated, $id) {
            $item = InventoryItem::findOrFail($id);
            $quantityBefore = $item->quantity;

            $quantityAfter = match ($validated['type']) {
                'in' => $quantityBefore + $validated['quantity'],
                'out' => $quantityBefore - $validated['quantity'],
                'adjustment' => $validated['quantity'],
            };

            if ($quantityAfter < 0) {
                return response()->json([
                    'message' => 'Insufficient stock. Current quantity: ' . $quantityBefore,
                ], 422);
            }

            $item->update(['quantity' => $quantityAfter]);

            $transaction = InventoryTransaction::create([
                'item_id' => $item->id,
                'type' => $validated['type'],
                'quantity' => $validated['quantity'],
                'quantity_before' => $quantityBefore,
                'quantity_after' => $quantityAfter,
                'reason' => $validated['reason'] ?? null,
                'performed_by' => auth()->id(),
            ]);

            $transaction->load(['item', 'performedBy']);

            return response()->json($transaction, 201);
        });
    }

    public function transactions(Request $request): JsonResponse
    {
        $query = InventoryTransaction::with(['item', 'performedBy'])
            ->latest();

        if ($request->filled('item_id')) {
            $query->where('item_id', $request->input('item_id'));
        }

        $transactions = $query->paginate(20);

        return response()->json($transactions);
    }
}
