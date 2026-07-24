import { orders } from "@/lib/api/orders";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(orders);
}
