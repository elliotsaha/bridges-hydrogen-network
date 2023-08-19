import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@lib";

export const POST = async (request: NextRequest) => {
  const authRequest = auth.handleRequest({ request, cookies });
  // check if user is authenticated
  const session = await authRequest.validate();
  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }
  // make sure to invalidate the current session!
  await auth.invalidateSession(session.sessionId);
  // delete session cookie
  authRequest.setSession(null);

  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: "/", // redirect to homepage
    },
  });
};
