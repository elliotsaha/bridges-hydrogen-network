import {NextRequest, NextResponse} from 'next/server';

// set "next-url" header as the current pathname to
// see if route should be protected or not
export const middleware = (request: NextRequest) => {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('next-url', request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
};
