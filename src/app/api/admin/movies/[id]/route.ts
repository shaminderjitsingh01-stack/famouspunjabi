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

export async function PUT(req: Request, { params }: { params: { id: string } }) {
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

    const existing = await prisma.movie.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    // Update slug if title or year changed
    let slug = existing.slug;
    if (title !== existing.title || year !== existing.year) {
      slug = slugify(`${title}-${year}`);
      const slugExists = await prisma.movie.findFirst({ where: { slug, id: { not: params.id } } });
      if (slugExists) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    // Delete existing genres and recreate
    await prisma.movieGenre.deleteMany({ where: { movieId: params.id } });

    const movie = await prisma.movie.update({
      where: { id: params.id },
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

    return NextResponse.json(movie);
  } catch (error: any) {
    console.error("Update movie error:", error);
    return NextResponse.json({ error: error.message || "Failed to update movie" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.movie.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete movie error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete movie" }, { status: 500 });
  }
}
