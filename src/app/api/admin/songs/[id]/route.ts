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
    const { title, titleGurmukhi, year, album, musicVideoYoutubeId, spotifyUrl, label, genre } = body;

    if (!title || !year) {
      return NextResponse.json({ error: "Title and year are required" }, { status: 400 });
    }

    const existing = await prisma.song.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    let slug = existing.slug;
    if (title !== existing.title || year !== existing.year) {
      slug = slugify(`${title}-${year}`);
      const slugExists = await prisma.song.findFirst({ where: { slug, id: { not: params.id } } });
      if (slugExists) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    const song = await prisma.song.update({
      where: { id: params.id },
      data: {
        title,
        titleGurmukhi,
        slug,
        year,
        album,
        musicVideoYoutubeId,
        spotifyUrl,
        label,
        genre: genre || "POP",
      },
    });

    return NextResponse.json(song);
  } catch (error: any) {
    console.error("Update song error:", error);
    return NextResponse.json({ error: error.message || "Failed to update song" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.song.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete song error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete song" }, { status: 500 });
  }
}
