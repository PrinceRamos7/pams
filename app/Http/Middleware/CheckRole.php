<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        // Admin has access to everything
        if ($request->user()->isAdmin()) {
            return $next($request);
        }

        // Check if user has one of the required roles
        foreach ($roles as $role) {
            if ($request->user()->role === $role) {
                return $next($request);
            }
        }

        // Redirect based on user role
        if ($request->user()->isAttendanceManager()) {
            return redirect()->route('attendance.index')->with('error', 'You do not have permission to access this page.');
        }

        return redirect()->route('dashboard')->with('error', 'You do not have permission to access this page.');
    }
}
