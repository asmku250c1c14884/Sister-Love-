import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: "✦ Subhaa's Cosmic Memory Galaxy ✦",
  description: "A cinematic, futuristic interactive surprise universe created for a truly special little sister.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full bg-[#03000a] text-white flex flex-col font-space antialiased">
        {children}
      </body>
    </html>
  );
}
