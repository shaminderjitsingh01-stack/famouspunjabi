import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "FamousPunjabi — The Home of Punjabi Entertainment",
    template: "%s — FamousPunjabi",
  },
  description:
    "Discover Punjabi movies, songs, and artists. The ultimate database for Pollywood films, Punjabi music, and entertainment — video-first, community-driven.",
  keywords: [
    "punjabi movies",
    "punjabi songs",
    "pollywood",
    "famous punjabi",
    "punjabi artists",
    "punjabi films",
    "punjabi music",
    "diljit dosanjh",
    "sidhu moosewala",
  ],
  openGraph: {
    title: "FamousPunjabi — The Home of Punjabi Entertainment",
    description: "Discover Punjabi movies, songs, and artists. Video-first, community-driven.",
    siteName: "FamousPunjabi",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
