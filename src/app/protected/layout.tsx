"use server";
import { connectToDatabase } from "@/lib/db";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const domain = headersList.get("x-invoke-path") || "";

  await connectToDatabase();
  const authRequest = auth.handleRequest({ request: null, cookies });
  const session = await authRequest.validate();

  if (!session) {
    redirect(`/auth/login/?redirect=${domain}`);
  } else {
    return <>{children}</>;
  }
}
