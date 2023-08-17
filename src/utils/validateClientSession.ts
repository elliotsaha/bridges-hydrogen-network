"use server";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { cache } from "react";

export const validateClientSession = cache(async () => {
  await connectToDatabase();
  // request should only be null if rendered on client
  const authRequest = auth.handleRequest({
    request: null,
    cookies,
  });
  const session = await authRequest.validate();
  return session;
});
