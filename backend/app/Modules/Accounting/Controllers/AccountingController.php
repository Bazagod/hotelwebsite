<?php

namespace App\Modules\Accounting\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Accounting\Models\Expense;
use App\Modules\Accounting\Models\Invoice;
use App\Modules\Accounting\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccountingController extends Controller
{
    public function invoices(Request $request): JsonResponse
    {
        $query = Invoice::with('guest');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->paginate(15));
    }

    public function storeInvoice(Request $request): JsonResponse
    {
        $data = $request->validate([
            'reservation_id' => 'nullable|exists:reservations,id',
            'guest_id' => 'nullable|exists:guests,id',
            'subtotal' => 'required|numeric|min:0',
            'tax_amount' => 'required|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'status' => 'required|string',
            'issue_date' => 'required|date',
            'due_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $data['tenant_id'] = $request->user()->tenant_id;
        $data['invoice_number'] = Invoice::generateInvoiceNumber();

        $invoice = Invoice::create($data);

        return response()->json($invoice->load('guest'), 201);
    }

    public function payments(Request $request): JsonResponse
    {
        $query = Payment::with('guest');

        if ($request->filled('method')) {
            $query->where('method', $request->method);
        }

        return response()->json($query->latest()->paginate(15));
    }

    public function storePayment(Request $request): JsonResponse
    {
        $data = $request->validate([
            'invoice_id' => 'nullable|exists:invoices,id',
            'reservation_id' => 'nullable|exists:reservations,id',
            'guest_id' => 'nullable|exists:guests,id',
            'amount' => 'required|numeric|min:0',
            'method' => 'required|string',
            'reference' => 'nullable|string',
            'status' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $data['tenant_id'] = $request->user()->tenant_id;
        $data['processed_by'] = $request->user()->id;

        $payment = Payment::create($data);

        return response()->json($payment->load('guest'), 201);
    }

    public function expenses(Request $request): JsonResponse
    {
        $query = Expense::query();

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        return response()->json($query->latest()->paginate(15));
    }

    public function storeExpense(Request $request): JsonResponse
    {
        $data = $request->validate([
            'category' => 'required|string',
            'description' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'vendor' => 'nullable|string',
            'receipt' => 'nullable|string',
            'approved_by' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
        ]);

        $data['tenant_id'] = $request->user()->tenant_id;

        $expense = Expense::create($data);

        return response()->json($expense, 201);
    }

    public function summary(Request $request): JsonResponse
    {
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();

        $totalRevenue = Payment::where('status', 'completed')
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->sum('amount');

        $totalExpenses = Expense::whereBetween('date', [$startOfMonth, $endOfMonth])
            ->sum('amount');

        $outstandingInvoices = Invoice::where('status', '!=', 'paid')->count();

        $netIncome = $totalRevenue - $totalExpenses;

        return response()->json([
            'total_revenue' => round($totalRevenue, 2),
            'total_expenses' => round($totalExpenses, 2),
            'outstanding_invoices' => $outstandingInvoices,
            'net_income' => round($netIncome, 2),
        ]);
    }
}
