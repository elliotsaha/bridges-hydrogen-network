import { NextResponse, NextRequest } from "next/server";
import z from "zod";
import { auth } from "@lib/auth";
import { LuciaError } from "lucia";
import { connectToDatabase } from "@/lib/db";
import { cookies } from "next/headers";

const UserCreationSchema = z.object({
  first_name: z.string({ required_error: "First name is required" }),
  last_name: z.string({ required_error: "Last name is required" }),
  email_address: z
    .string({ required_error: "Email Address is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
});

export async function POST(request: NextRequest) {
  let { first_name, last_name, email_address, password } = await request.json();

  email_address = email_address.toLowerCase();

  const validation = UserCreationSchema.safeParse({
    first_name,
    last_name,
    email_address,
    password,
  });

  if (validation.success) {
    try {
      await connectToDatabase();

      const user = await auth.createUser({
        key: {
          providerId: "email_address",
          providerUserId: email_address,
          password,
        },
        attributes: {
          first_name,
          last_name,
          email_address,
        },
      });

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
      if (e instanceof LuciaError && e.message === `AUTH_DUPLICATE_KEY_ID`) {
        return NextResponse.json(
          {
            data: "A user with this email address already exists",
          },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          {
            data: "Server Error: something went wrong",
          },
          { status: 500 }
        );
      }
    }
  } else {
    return NextResponse.json(
      {
        data: validation.error.issues,
      },
      { status: 422 }
    );
  }
}
