import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditArtistForm from "./edit-form";

export const dynamic = "force-dynamic";

export default async function EditArtistPage({ params }: { params: { id: string } }) {
  const artist = await prisma.artist.findUnique({ where: { id: params.id } });
  if (!artist) notFound();
  return <EditArtistForm artist={JSON.parse(JSON.stringify(artist))} />;
}
