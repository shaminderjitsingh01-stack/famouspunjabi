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
    const { title, titleGurmukhi, year, album, musicVideoYoutubeId, spotifyUrl, label, genre } = body;

    if (!title || !year) {
      return NextResponse.json({ error: "Title and year are required" }, { status: 400 });
    }

    let slug = slugify(`${title}-${year}`);
    const existing = await prisma.song.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const song = await prisma.song.create({
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

    return NextResponse.json(song, { status: 201 });
  } catch (error: any) {
    console.error("Create song error:", error);
    return NextResponse.json({ error: error.message || "Failed to create song" }, { status: 500 });
  }
}
