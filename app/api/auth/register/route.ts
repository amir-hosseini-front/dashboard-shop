import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "همه فیلدها اجباری هستند" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    message: "ثبت‌نام با موفقیت انجام شد",
    user: {
      id: 2,
      name: name,
      email: email,
    },
  });
}
