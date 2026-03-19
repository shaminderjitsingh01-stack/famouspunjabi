import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditMovieForm from "./edit-form";

export const dynamic = "force-dynamic";

export default async function EditMoviePage({ params }: { params: { id: string } }) {
  const movie = await prisma.movie.findUnique({
    where: { id: params.id },
    include: { genres: true },
  });
  if (!movie) notFound();

  return <EditMovieForm movie={JSON.parse(JSON.stringify(movie))} />;
}
