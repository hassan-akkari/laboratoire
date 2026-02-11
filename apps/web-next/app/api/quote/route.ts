import { NextResponse } from "next/server";
import { quoteRequestSchema } from "../../../lib/bookingSchemas";
import { quoteBooking } from "../../../lib/pricing";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = quoteRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid quote payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const quote = quoteBooking(parsed.data);
    return NextResponse.json({ quote });
  } catch {
    return NextResponse.json(
      { error: "Experience not found for provided slug" },
      { status: 404 },
    );
  }
}
