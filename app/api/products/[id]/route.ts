import { products } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return NextResponse.json({ message: "محصول یافت نشد" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id);
  const body = await request.json();

  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return NextResponse.json({ message: "محصول یافت نشد" }, { status: 404 });
  }
  const updatedProduct = {
    id: products[index].id,
    name: body.name || products[index].name,
    price: body.price !== undefined ? body.price : products[index].price,
    stock: body.stock !== undefined ? body.stock : products[index].stock,
    status:
      body.stock !== undefined
        ? body.stock > 0
          ? "موجود"
          : "ناموجود"
        : products[index].status,
  };

  products[index] = updatedProduct;
  return NextResponse.json(updatedProduct);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id);
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return NextResponse.json({ message: "محصول یافت نشد" }, { status: 404 });
  }

  products.splice(index, 1);
  return NextResponse.json(
    { message: "محصول با موفقیت حذف شد" },
    { status: 200 },
  );
}
