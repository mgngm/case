import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  console.log(`[API] ${request.method} ${request.url}`);
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
