import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const type = searchParams.get("type");
  const sort = searchParams.get("sort") || "name";
  const search = searchParams.get("search");
  const skip = (page - 1) * limit;

  const where: any = {};
  if (type) where.type = type as any;
  if (search) where.name = { contains: search };

  const orderBy: any = sort === "movies"
    ? { totalMovies: "desc" }
    : sort === "songs"
    ? { totalSongs: "desc" }
    : { name: "asc" };

  const [artists, total] = await Promise.all([
    prisma.artist.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.artist.count({ where }),
  ]);

  return NextResponse.json({
    artists,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
