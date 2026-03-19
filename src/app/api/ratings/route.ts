import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { score, movieId, songId } = body;

    if (!score || score < 1 || score > 10) {
      return NextResponse.json({ error: "Score must be between 1 and 10" }, { status: 400 });
    }

    if (!movieId && !songId) {
      return NextResponse.json({ error: "Must provide movieId or songId" }, { status: 400 });
    }

    // For Phase 1, we create ratings without user association
    // We'll use a temporary "anonymous" approach - create a rating and update the average

    if (movieId) {
      // Update movie average rating
      const allRatings = await prisma.rating.findMany({
        where: { movieId },
        select: { score: true },
      });

      const newAvg = allRatings.length > 0
        ? (allRatings.reduce((sum, r) => sum + r.score, 0) + score) / (allRatings.length + 1)
        : score;

      await prisma.movie.update({
        where: { id: movieId },
        data: {
          averageRating: Math.round(newAvg * 10) / 10,
          ratingCount: allRatings.length + 1,
        },
      });
    }

    if (songId) {
      const allRatings = await prisma.rating.findMany({
        where: { songId },
        select: { score: true },
      });

      const newAvg = allRatings.length > 0
        ? (allRatings.reduce((sum, r) => sum + r.score, 0) + score) / (allRatings.length + 1)
        : score;

      await prisma.song.update({
        where: { id: songId },
        data: {
          averageRating: Math.round(newAvg * 10) / 10,
          ratingCount: allRatings.length + 1,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Rating error:", error);
    return NextResponse.json({ error: "Failed to save rating" }, { status: 500 });
  }
}
