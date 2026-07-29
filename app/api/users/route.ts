import { db } from "@/lib/api/statistics";
import { dbUsers } from "@/lib/api/users";
import { OrderStatus, OrderWithUser } from "@/types";
import { NextRequest, NextResponse } from "next/server";

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
