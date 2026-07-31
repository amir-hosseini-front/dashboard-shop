import { dbUsers } from "@/lib/api/users";
import { User } from "@/types";
import { NextRequest, NextResponse } from "next/server";
let nextId = 5;
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "5", 10);
  const search = searchParams.get("search") || "";
  let users = dbUsers;

  if (search.trim() !== "") {
    users = users.filter((user) => {
      const searchLower = search.toLowerCase().trim();

      return user.name?.toLowerCase().includes(searchLower);
    });
  }

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.name || !body.email || !body.phone) {
    return NextResponse.json(
      { message: "نام، تلفن و ایمیل الزامی هستند" },
      { status: 400 },
    );
  }

  const newUser: User = {
    id: "user-" + nextId++,
    name: body.name,
    email: body.email,
    phone: body.phone,
    address: body.address,
    createdAt: new Date(),
  };

  dbUsers.push(newUser);
  return NextResponse.json(newUser, { status: 201 });
}
