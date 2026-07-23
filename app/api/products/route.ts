import { products } from "@/lib/api";
import { NextResponse } from "next/server";

let nextId = 5;

export async function GET() {
  return NextResponse.json(products);
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
  };

  products.push(newProduct);
  return NextResponse.json(newProduct, { status: 201 });
}
