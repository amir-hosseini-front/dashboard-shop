import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "ایمیل و رمز عبور اجباری هستند" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    message: "ورود موفقیت‌آمیز بود",
    user: {
      id: 1,
      name: "کاربر تست",
      email: email,
    },
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  });
}
