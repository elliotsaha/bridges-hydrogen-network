"use server";
import { auth } from "@lib/lucia";
import { connectToDatabase } from "@lib/mongoose";
import { cookies } from "next/headers";
import { cache } from "react";

// validates if user is authenticated. should ONLY be used on client side (and not on an api route) because request is set to null and cache function is used
export const getClientSession = cache(async () => {
  await connectToDatabase();

  const authRequest = auth.handleRequest({
    request: null, // request should always be null if rendered on client
    cookies,
  });

  const session = await authRequest.validate();
  return session;
});
