<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Проверяем авторизацию
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Необходима авторизация для доступа к админ-панели');
        }

        $user = Auth::user();

        // Проверяем роль пользователя (admin, organizer, helper)
        if (!in_array($user->role, ['admin', 'organizer', 'helper'])) {
            abort(403, 'Доступ запрещен. Недостаточно прав.');
        }

        return $next($request);
    }
} 