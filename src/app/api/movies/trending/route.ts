import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const movies = await prisma.movie.findMany({
    where: { status: "RELEASED" },
    orderBy: [{ ratingCount: "desc" }, { averageRating: "desc" }],
    take: 12,
    include: { genres: true },
  });

  return NextResponse.json(movies);
}
