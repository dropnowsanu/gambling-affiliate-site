import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
});

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON." },
      { status: 400 },
    );
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const { email } = parsed.data;

  try {
    await prisma.subscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not save your subscription. Try again later." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
