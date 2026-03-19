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
    const { name, nameGurmukhi, bio, photoUrl, birthDate, birthPlace, deathDate, type, verified, featured } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const existing = await prisma.artist.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    let slug = existing.slug;
    if (name !== existing.name) {
      slug = slugify(name);
      const slugExists = await prisma.artist.findFirst({ where: { slug, id: { not: params.id } } });
      if (slugExists) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    const artist = await prisma.artist.update({
      where: { id: params.id },
      data: {
        name,
        nameGurmukhi,
        slug,
        bio,
        photoUrl,
        birthDate: birthDate ? new Date(birthDate) : null,
        birthPlace,
        deathDate: deathDate ? new Date(deathDate) : null,
        type: type || "MULTI",
        verified: verified || false,
        featured: featured || false,
      },
    });

    return NextResponse.json(artist);
  } catch (error: any) {
    console.error("Update artist error:", error);
    return NextResponse.json({ error: error.message || "Failed to update artist" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.artist.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete artist error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete artist" }, { status: 500 });
  }
}
