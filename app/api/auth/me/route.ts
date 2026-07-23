import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    user: {
      id: 1,
      name: "کاربر تست",
      email: "test@example.com",
    },
  });
}
