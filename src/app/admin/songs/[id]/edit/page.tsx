import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditSongForm from "./edit-form";

export const dynamic = "force-dynamic";

export default async function EditSongPage({ params }: { params: { id: string } }) {
  const song = await prisma.song.findUnique({ where: { id: params.id } });
  if (!song) notFound();
  return <EditSongForm song={JSON.parse(JSON.stringify(song))} />;
}
