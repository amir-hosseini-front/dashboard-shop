import { products } from "@/lib/api/products";
import { NextRequest, NextResponse } from "next/server";

let nextId = 5;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "5", 10);
  const search = searchParams.get("search") || "";
  let filteredUsers = products;

  if (search.trim() !== "") {
    filteredUsers = products.filter((product) => {
      const searchLower = search.toLowerCase().trim();

      return product.name?.toLowerCase().includes(searchLower);
    });
  }
  return NextResponse.json(filteredUsers);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.name || body.price === undefined || body.stock === undefined) {
    return NextResponse.json(
      { message: "نام، قیمت و موجودی الزامی هستند" },
      { status: 400 },
    );
  }

  const newProduct = {
    id: nextId++,
    name: body.name,
    price: body.price,
    stock: body.stock,
    status: body.stock > 0 ? "موجود" : "ناموجود",
    createdAt: new Date(),
  };

  products.push(newProduct);
  return NextResponse.json(newProduct, { status: 201 });
}
