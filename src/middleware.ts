import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token');
    const { pathname } = request.nextUrl;

    if (request.nextUrl.pathname === '/api/login') {
        return NextResponse.next();
    }

    if (pathname.startsWith('/dashboard')) {
        if (!token) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    if (pathname === '/' && token) {
        return NextResponse.redirect(new URL('/absensiteknomedia/dashboard', request.url));
    }


    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/dashboard/:path*',
        '/api/:path*'
    ]
};