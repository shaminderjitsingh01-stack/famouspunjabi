import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const year = searchParams.get("year");
  const genre = searchParams.get("genre");
  const sort = searchParams.get("sort") || "newest";
  const search = searchParams.get("search");
  const skip = (page - 1) * limit;

  const where: any = {};
  if (year) where.year = parseInt(year);
  if (genre) where.genre = genre as any;
  if (search) where.title = { contains: search };

  const orderBy: any = sort === "rating"
    ? { averageRating: "desc" }
    : sort === "year"
    ? { year: "desc" }
    : { createdAt: "desc" };

  const [songs, total] = await Promise.all([
    prisma.song.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        credits: {
          include: { artist: { select: { name: true, slug: true } } },
          where: { role: "SINGER" },
        },
      },
    }),
    prisma.song.count({ where }),
  ]);

  return NextResponse.json({
    songs,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
