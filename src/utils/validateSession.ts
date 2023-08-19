"use server";
import { auth } from "@lib/lucia";
import { connectToDatabase } from "@lib/mongoose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { cache } from "react";

// validates if user is authenticated
export const validateSession = cache(
  async (request: NextRequest | null = null) => {
    await connectToDatabase();

    const authRequest = auth.handleRequest({
      request: request, // request should only be null if rendered on client
      cookies,
    });

    const session = await authRequest.validate();
    return session;
  }
);
