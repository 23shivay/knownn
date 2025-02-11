// import { NextRequest, NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';
// export { default } from 'next-auth/middleware';

// export const config = {
//   matcher: ['/sign-in', '/sign-up', '/', '/verify/:path*'],
// };

// export async function middleware(request: NextRequest) {
//   const token = await getToken({ req: request });
//   const url = request.nextUrl;

  
//   if (
//     token &&
//     (url.pathname.startsWith('/sign-in') ||
//       url.pathname.startsWith('/sign-up') ||
//       url.pathname.startsWith('/verify') )
//   ) {
//     return NextResponse.redirect(new URL('/', request.url));
//   }

//   if (!token && url.pathname.startsWith('/')) {
//     return NextResponse.redirect(new URL('/sign-in', request.url));
//   }

//   return NextResponse.next();
// }



import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/', '/gossip/:path*', '/contentsuggestion/:path*', '/sign-in', '/sign-up', '/verify','/chat/:path*','/feedback'],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  const url = request.nextUrl;
  const isAuthRoute = ['/sign-in', '/sign-up', '/verify*',].includes(url.pathname);

  // If user is authenticated and trying to access auth routes, redirect to home
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is not authenticated and trying to access protected routes, redirect to sign-in
  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}
