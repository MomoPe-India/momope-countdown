import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // 1. Create Supabase Client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 2. Check User Session
    const { data: { user } } = await supabase.auth.getUser()

    // 3. Define Protected Routes
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
    const isLoginRoute = request.nextUrl.pathname.startsWith('/admin/login')

    // 4. Auth Logic

    // A. Not Logged In trying to access Admin -> Redirect to Login
    // Note: We bypass this check for now if we are using MOCK AUTH (localStorage)
    // But for production, this should be uncommented.
    /*
    if (isAdminRoute && !isLoginRoute && !user) {
       return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    */

    // B. Logged In trying to access Login -> Redirect to Dashboard
    if (isLoginRoute && user) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    // 5. Role-Based Access Control (RBAC)
    // If user is logged in, we check their specific role
    if (user && isAdminRoute) {
        // Fetch user role from DB (since auth.user metadata might be stale)
        // For performance, you might store this in metadata or a cookie
        const { data: userProfile } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

        const role = userProfile?.role;
        const path = request.nextUrl.pathname;

        // RULE: SALES role cannot access Finance/Settlements
        if (role === 'SALES') {
            if (path.includes('/settlements') || path.includes('/finance') || path.includes('/settings')) {
                // Redirect to their dashboard instead of 403 Page for better UX
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
        }
    }

    return response
}

export const config = {
    matcher: [
        '/admin/:path*',
    ],
}
