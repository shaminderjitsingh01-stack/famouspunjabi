import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, titleGurmukhi, year, runtime, synopsis, posterUrl, trailerYoutubeId, language, status, boxOffice, genres } = body;

    if (!title || !year) {
      return NextResponse.json({ error: "Title and year are required" }, { status: 400 });
    }

    let slug = slugify(`${title}-${year}`);
    const existing = await prisma.movie.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const movie = await prisma.movie.create({
      data: {
        title,
        titleGurmukhi,
        slug,
        year,
        runtime,
        synopsis,
        posterUrl,
        trailerYoutubeId,
        language: language || "PUNJABI",
        status: status || "RELEASED",
        boxOffice,
        genres: {
          create: (genres || []).map((genre: string) => ({ genre })),
        },
      },
    });

    return NextResponse.json(movie, { status: 201 });
  } catch (error: any) {
    console.error("Create movie error:", error);
    return NextResponse.json({ error: error.message || "Failed to create movie" }, { status: 500 });
  }
}
