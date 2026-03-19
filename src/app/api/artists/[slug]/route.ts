import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const artist = await prisma.artist.findUnique({
    where: { slug: params.slug },
    include: {
      socialAccounts: true,
      movieCredits: {
        include: {
          movie: {
            include: { genres: true },
          },
        },
        orderBy: { movie: { year: "desc" } },
      },
      songCredits: {
        include: {
          song: true,
        },
        orderBy: { song: { year: "desc" } },
      },
      videos: { orderBy: { order: "asc" } },
    },
  });

  if (!artist) {
    return NextResponse.json({ error: "Artist not found" }, { status: 404 });
  }

  return NextResponse.json(artist);
}
