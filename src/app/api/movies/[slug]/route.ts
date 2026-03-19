import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const movie = await prisma.movie.findUnique({
    where: { slug: params.slug },
    include: {
      genres: true,
      credits: {
        include: { artist: true },
        orderBy: { order: "asc" },
      },
      videos: { orderBy: { order: "asc" } },
      streamingLinks: true,
      reviews: {
        where: { approved: true },
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      _count: { select: { ratings: true, reviews: true } },
    },
  });

  if (!movie) {
    return NextResponse.json({ error: "Movie not found" }, { status: 404 });
  }

  return NextResponse.json(movie);
}
