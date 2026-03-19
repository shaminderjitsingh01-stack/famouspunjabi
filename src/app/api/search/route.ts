import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q || q.trim().length < 2) {
    return NextResponse.json({ movies: [], songs: [], artists: [] });
  }

  const search = q.trim();

  const [movies, songs, artists] = await Promise.all([
    prisma.movie.findMany({
      where: { title: { contains: search } },
      take: 5,
      include: { genres: true },
      orderBy: { averageRating: "desc" },
    }),
    prisma.song.findMany({
      where: { title: { contains: search } },
      take: 5,
      include: {
        credits: {
          include: { artist: { select: { name: true, slug: true } } },
          where: { role: "SINGER" },
        },
      },
      orderBy: { averageRating: "desc" },
    }),
    prisma.artist.findMany({
      where: { name: { contains: search } },
      take: 5,
      orderBy: { totalMovies: "desc" },
    }),
  ]);

  return NextResponse.json({ movies, songs, artists });
}
