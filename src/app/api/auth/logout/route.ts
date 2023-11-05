import { NextRequest } from "next/server";
import * as context from "next/headers";
import { auth, connectToDatabase } from "@lib";
import { ServerResponse } from "@helpers";

export const POST = async (request: NextRequest) => {
  await connectToDatabase();

  const authRequest = auth.handleRequest(request.method, context);
  // check if user is authenticated
  const session = await authRequest.validate();

  if (!session) {
    return ServerResponse.userError("Invalid session");
  }
  // make sure to invalidate the current session!
  await auth.invalidateSession(session.sessionId);
  // delete session cookie
  authRequest.setSession(null);

  return ServerResponse.success("Successfully logged out");
};
