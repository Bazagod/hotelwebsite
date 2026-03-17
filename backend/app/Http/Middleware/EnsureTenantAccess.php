<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTenantAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if ($user->is_super_admin) {
            return $next($request);
        }

        if (!$user->tenant_id) {
            return response()->json(['message' => 'No tenant assigned.'], 403);
        }

        if (!$user->tenant || !$user->tenant->is_active) {
            return response()->json(['message' => 'Tenant is inactive.'], 403);
        }

        return $next($request);
    }
}
