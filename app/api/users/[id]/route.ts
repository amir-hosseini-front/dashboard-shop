import { dbUsers } from "@/lib/api/users";
import { User } from "@/types";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const body = await request.json();

  const index = dbUsers.findIndex((p) => p.id === params.id);
  if (index === -1) {
    return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 404 });
  }
  const updatedUser: User = {
    id: dbUsers[index].id,
    name: body.name || dbUsers[index].name,
    email: body.price !== undefined ? body.price : dbUsers[index].email,
    phone: body.stock !== undefined ? body.stock : dbUsers[index].phone,
    address: body.stock !== undefined ? body.stock : dbUsers[index].address,
    createdAt: dbUsers[index].createdAt,
  };

  dbUsers[index] = updatedUser;
  return NextResponse.json(updatedUser);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const index = dbUsers.findIndex((p) => p.id === params.id);

  if (index === -1) {
    return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 404 });
  }

  dbUsers.splice(index, 1);
  return NextResponse.json(
    { message: "کاربر با موفقیت حذف شد" },
    { status: 200 },
  );
}
