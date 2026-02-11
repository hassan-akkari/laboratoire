import { NextResponse } from "next/server";
import { checkoutRequestSchema } from "../../../lib/bookingSchemas";
import { processCheckout } from "../../../lib/orders";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = checkoutRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid checkout payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const order = processCheckout(parsed.data);
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json(
      { error: "Experience not found for provided slug" },
      { status: 404 },
    );
  }
}
