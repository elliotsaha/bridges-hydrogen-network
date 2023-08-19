import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { auth, connectToDatabase } from "@lib";
import { cookies } from "next/headers";
import { LuciaError } from "lucia";

const UserLoginSchema = z.object({
  email_address: z.string({ required_error: "Email address is required" }),
  password: z.string({ required_error: "Password is required" }),
});

export async function POST(request: NextRequest) {
  const { email_address, password } = await request.json();

  const validation = UserLoginSchema.safeParse({
    email_address,
    password,
  });

  if (validation.success) {
    try {
      await connectToDatabase();
      // find user by key
      // and validate password
      const user = await auth.useKey(
        "email_address",
        email_address.toLowerCase(),
        password
      );

      const session = await auth.createSession({
        userId: user.userId,
        attributes: {},
      });

      const authRequest = auth.handleRequest({
        request,
        cookies,
      });

      authRequest.setSession(session);

      return NextResponse.json({ data: user }, { status: 200 });
    } catch (e) {
      if (
        e instanceof LuciaError &&
        (e.message === "AUTH_INVALID_KEY_ID" ||
          e.message === "AUTH_INVALID_PASSWORD")
      ) {
        // user does not exist or invalid password
        return NextResponse.json(
          {
            error: "Invalid email or password",
          },
          {
            status: 400,
          }
        );
      }
      return NextResponse.json(
        {
          error: "Server Error: something went wrong",
        },
        {
          status: 500,
        }
      );
    }
  } else {
    return NextResponse.json(
      { data: validation.error.issues },
      { status: 422 }
    );
  }
}
