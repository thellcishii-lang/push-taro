import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  if (request.headers.get('host') === 'www.push-taro.com') {
    const destination = new URL(request.nextUrl.pathname + request.nextUrl.search, 'https://push-taro.com');
    return NextResponse.redirect(destination, 308);
  }

  return NextResponse.next();
}