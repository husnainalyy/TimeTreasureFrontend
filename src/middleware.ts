import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export { default } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';

export const config = {
    matcher: [
        '/signIn',
        '/signUp',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ],
};

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    if (token && (url.pathname.startsWith('/signIn') ||
        url.pathname.startsWith('/signUp') ||
        url.pathname.startsWith('/verify') ||
        url.pathname === '/')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (!token && url.pathname === '/') {
        return NextResponse.next();
    }

    return NextResponse.next();
}