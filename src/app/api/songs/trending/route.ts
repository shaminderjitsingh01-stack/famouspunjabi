import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const songs = await prisma.song.findMany({
    orderBy: [{ ratingCount: "desc" }, { averageRating: "desc" }],
    take: 12,
    include: {
      credits: {
        include: { artist: { select: { name: true, slug: true } } },
        where: { role: "SINGER" },
      },
    },
  });

  return NextResponse.json(songs);
}
