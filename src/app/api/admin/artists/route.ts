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
    const { name, nameGurmukhi, bio, photoUrl, birthDate, birthPlace, deathDate, type, verified, featured } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    let slug = slugify(name);
    const existing = await prisma.artist.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const artist = await prisma.artist.create({
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

    return NextResponse.json(artist, { status: 201 });
  } catch (error: any) {
    console.error("Create artist error:", error);
    return NextResponse.json({ error: error.message || "Failed to create artist" }, { status: 500 });
  }
}
